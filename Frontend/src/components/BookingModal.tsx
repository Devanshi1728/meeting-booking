import { useState } from 'react'
import Modal from './ui/Modal'
import { Button } from './ui/Button'
import type { Room } from '../data/rooms'

type Props = {
  room: Room
  onClose: () => void
}

export const BookingModal = ({ room, onClose }: Props) => {
  // date window: today through next 5 days
  const today = new Date()
  const formatDate = (d: Date) => d.toISOString().slice(0, 10)
  const minDate = formatDate(today)
  const maxDate = formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5))

  const [date, setDate] = useState<string>(minDate)
  // use HTML time inputs (24h) for native time pickers
  const [start, setStart] = useState<string>('14:00')
  const [end, setEnd] = useState<string>('15:00')
  const [name, setName] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  const submit = (e: any) => {
    e.preventDefault()
    // naive local persistence
    const bookings = JSON.parse(localStorage.getItem('meeting-booking-bookings') || '[]')
    bookings.push({ id: crypto.randomUUID(), room: room.name, date, start, end, name })
    localStorage.setItem('meeting-booking-bookings', JSON.stringify(bookings))
    setSuccess('Booked successfully')
    setTimeout(() => onClose(), 900)
  }

  return (
    <Modal title={`Book ${room.name}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
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
            Department name
            <input className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Legal" />
          </label>
          
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-600">
            Start
            <input
              required
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </label>
          <label className="block text-sm text-slate-600">
            End
            <input
              required
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </label>
         
        </div>

  
        <div className="flex items-center gap-3">
          <Button type="submit">Confirm Booking</Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </div>

        {success ? <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm text-emerald-800">{success}</div> : null}
      </form>
    </Modal>
  )
}

export default BookingModal
