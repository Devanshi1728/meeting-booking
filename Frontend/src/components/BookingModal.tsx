import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import Modal from './ui/Modal'
import { Button } from './ui/Button'
import { createBooking, fetchRoomBookings } from '../lib/api'
import type { RoomApi, CreateBookingPayload } from '../types'

type Props = {
  room: RoomApi
  onClose: () => void
}

export const BookingModal = ({ room, onClose }: Props) => {
  // date window: today through next 5 days
  const today = new Date()
  const formatDate = (d: Date) => d.toISOString().slice(0, 10)
  const minDate = formatDate(today)
  const maxDate = formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7))

  const [date, setDate] = useState<string>(minDate)
  // use HTML time inputs (24h) for native time pickers
  const [start, setStart] = useState<string>('14:00')
  const [end, setEnd] = useState<string>('15:00')
  const { user } = useAuth()
  const [userName, setUserName] = useState<string>(user?.name ?? '')
  const [departmentName, setDepartmentName] = useState<string>(user?.department ?? '')
  const [success, setSuccess] = useState<string>('')
  const [error, setError] = useState<string>('')

  const queryClient = useQueryClient()

  const { data: roomBookings = [] } = useQuery({
    queryKey: ['roomBookings', room.id],
    queryFn: () => fetchRoomBookings(room.id),
    staleTime: 1000 * 60 * 2,
  })

  const hasSlotConflict = useMemo(() => {
    if (!date || !start || !end) return false

    return roomBookings.some((booking) => {
      return (
        booking.date === date &&
        booking.start_time < end &&
        booking.end_time > start
      )
    })
  }, [date, end, roomBookings, start])

  useEffect(() => {
    setUserName(user?.name ?? '')
    setDepartmentName(user?.department ?? '')
  }, [user])

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      setSuccess('Booked successfully')
      setTimeout(() => onClose(), 900)
    },
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : 'Unable to book room')
    },
  })

  const submit = (e: any) => {
    e.preventDefault()
    setError('')

    if (!user) {
      setError('You must be signed in to book a room.')
      return
    }

    if (!userName.trim()) {
      setError('Name is required')
      return
    }

    if (!departmentName.trim()) {
      setError('Department is required')
      return
    }

    const payload: CreateBookingPayload = {
      room_id: room.id,
      user_name: userName.trim(),
      department_name: departmentName.trim(),
      date,
      start_time: start,
      end_time: end,
    }

    mutation.mutate(payload)
  }

  return (
    <Modal title={`Book ${room.name}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-600">
            Your Name
            <input
              required
              disabled
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600"
              type="text"
              placeholder="Enter your name"
              value={userName}
              readOnly
            />
          </label>
          <label className="block text-sm text-slate-600">
            Department
            <input
              required
              disabled
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600"
              type="text"
              value={departmentName}
              readOnly
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-600">
            Date
            <input
              required
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              type="date"
              value={date}
              min={minDate}
              max={maxDate}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="block text-sm text-slate-600">
            Time
            <div className="mt-2 flex gap-2">
              <input
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
              <span className="flex items-center text-slate-500">to</span>
              <input
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </label>
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={mutation.status === 'pending' || hasSlotConflict}>
            {mutation.status === 'pending' ? 'Booking…' : 'Confirm Booking'}
          </Button>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
        </div>

        {hasSlotConflict ? (
          <div className="rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-800">
            This room is already booked for the selected date and time.
          </div>
        ) : null}
        {error ? <div className="rounded-2xl bg-rose-50 px-4 py-2 text-sm text-rose-800">{error}</div> : null}
        {success ? <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm text-emerald-800">{success}</div> : null}
      </form>
    </Modal>
  )
}

export default BookingModal
