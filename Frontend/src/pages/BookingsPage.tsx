import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchBookings, updateBooking, fetchDepartments } from '../lib/api'
import type { BookingApi, UpdateBookingPayload, Department } from '../types'
import { Button } from '../components/ui/Button'

const formatBookingDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}

export const BookingsPage = () => {
  const queryClient = useQueryClient()
  const { data: bookings = [], isLoading, isError } = useQuery<BookingApi[]>({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
    staleTime: 1000 * 60,
  })

  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
    staleTime: 1000 * 60 * 5,
  })

  const [editingBooking, setEditingBooking] = useState<BookingApi | null>(null)
  const [userName, setUserName] = useState('')
  const [departmentName, setDepartmentName] = useState('')
  const [editDate, setEditDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  useEffect(() => {
    if (editingBooking) {
      setUserName(editingBooking.user_name)
      setDepartmentName(editingBooking.department_name)
      setEditDate(editingBooking.date)
      setStartTime(editingBooking.start_time)
      setEndTime(editingBooking.end_time)
      setFormError('')
      setFormSuccess('')
    } else {
      setUserName('')
      setDepartmentName('')
      setEditDate('')
      setStartTime('09:00')
      setEndTime('10:00')
      setFormError('')
      setFormSuccess('')
    }
  }, [editingBooking])

  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateBookingPayload }) => updateBooking(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      setFormSuccess('Booking updated successfully')
      setTimeout(() => setEditingBooking(null), 900)
    },
    onError: (error: unknown) => {
      setFormError(error instanceof Error ? error.message : 'Unable to update booking')
    },
  })

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError('')
    setFormSuccess('')

    if (!editingBooking) return
    if (!userName.trim()) {
      setFormError('Name is required')
      return
    }
    if (!departmentName.trim()) {
      setFormError('Department name is required')
      return
    }

    mutation.mutate({
      id: editingBooking.id,
      payload: {
        user_name: userName.trim(),
        department_name: departmentName.trim(),
        date: editDate,
        start_time: startTime,
        end_time: endTime,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">My Bookings</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Upcoming meetings</h2>
          </div>
        </div>
      </div>

      {editingBooking ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Editing booking for</p>
              <h3 className="text-xl font-semibold text-slate-900">{editingBooking.room_name}</h3>
            </div>
            <Button variant="ghost" onClick={() => setEditingBooking(null)}>
              Cancel edit
            </Button>
          </div>

          <form onSubmit={handleEditSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-slate-600">
                Name
                <input
                  required
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                  type="text"
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                />
              </label>
              <label className="block text-sm text-slate-600">
                Department
                <select
                  required
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                  value={departmentName}
                  onChange={(event) => setDepartmentName(event.target.value)}
                >
                  <option value="">Select a department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-slate-600">
                Date
                <input
                  required
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                  type="date"
                  value={editDate}
                  onChange={(event) => setEditDate(event.target.value)}
                />
              </label>
              <label className="block text-sm text-slate-600">
                Time
                <div className="mt-2 flex gap-2">
                  <input
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                    type="time"
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                  />
                  <span className="flex items-center text-slate-500">to</span>
                  <input
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                    type="time"
                    value={endTime}
                    onChange={(event) => setEndTime(event.target.value)}
                  />
                </div>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={mutation.status === 'pending'}>
                {mutation.status === 'pending' ? 'Saving…' : 'Save changes'}
              </Button>
              <Button variant="ghost" onClick={() => setEditingBooking(null)} type="button">
                Cancel
              </Button>
            </div>

            {formError ? <div className="rounded-2xl bg-rose-50 px-4 py-2 text-sm text-rose-800">{formError}</div> : null}
            {formSuccess ? <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm text-emerald-800">{formSuccess}</div> : null}
          </form>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600">Loading bookings…</div>
        ) : isError ? (
          <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-10 text-center text-rose-600">Unable to load bookings.</div>
        ) : bookings.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600">No bookings found.</div>
        ) : (
          bookings.map((booking) => 
          {
              const bookingEnd = new Date(
              `${booking.date.split('T')[0]}T${booking.end_time}`
            );
              const isPast = bookingEnd.getTime() < Date.now();
            console.log(isPast, bookingEnd.getTime(), Date.now())
           return (
            <div key={booking.id} 
           className={`flex flex-col rounded-3xl border border-slate-200 ${
                    isPast ? 'bg-slate-100' : 'bg-white'
                  } shadow-sm`}>
              <div className="space-y-4 p-5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{booking.room_name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{booking.user_name}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-3">
                    <span>📋</span>
                    <div className="text-xs">
                      <p className="font-semibold text-slate-700">{booking.department_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-3">
                    <span>⏰</span>
                    <div className="text-xs">
                      <p className="font-semibold text-slate-700">{formatBookingDate(booking.date)}</p>
                      <p className="text-slate-500">{booking.start_time} - {booking.end_time}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    <span>🆔</span> Room {booking.room_id}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                    <span>🪑</span> {booking.capacity || 0} seats
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Booked on {formatBookingDate(booking.created_at)}
                </div>
              </div>
              <div className="flex gap-2 border-t border-slate-200 p-1">
                <Button variant="ghost" onClick={() => setEditingBooking(booking)} className="flex-1" 
                  disabled={booking.date < new Date().toISOString().split('T')[0] || mutation.status === 'pending'}>
                  Edit
                </Button>
              </div>
            </div>
          )})
        )}
      </div>
    </div>
  )
}
