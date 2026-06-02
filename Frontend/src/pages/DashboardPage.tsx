import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchRooms } from '../lib/api'
import type { RoomApi } from '../types'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import BookingModal from '../components/BookingModal'

const placeholderImage = 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407??auto=format&fit=crop&w=900&q=80'

export const DashboardPage = () => {
  const selectedRoom = null
  const [bookingRoom, setBookingRoom] = useState<RoomApi | null>(null)

  const { data: rooms = [], isLoading, isError } = useQuery<RoomApi[]>({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
    staleTime: 1000 * 60 * 2,
  })

  const date = () => {
    const today = new Date()
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }
    return today.toLocaleDateString(undefined, options)
  }

  return (
    <div className={`grid gap-6 ${selectedRoom ? 'xl:grid-cols-[1.25fr_0.9fr]' : 'grid-cols-1'}`}>
      <section className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
        {/* <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Available Rooms</h2>
            <p className="mt-2 text-sm text-slate-600">Search, filter, and book rooms tailored to your team.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <input className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="Search by room name or feature..." />
            <select className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200">
              <option>{date()}</option> 
            </select>
            <select className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200">
              <option>Any capacity</option>
              <option>4+</option>
              <option>8+</option>
            </select>
          </div>
        </div> */}

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600">Loading rooms…</div>
          ) : isError ? (
            <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-10 text-center text-rose-600">Unable to load rooms.</div>
          ) : rooms.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600">No rooms available.</div>
          ) : (
            rooms.map((room) => {
              const isBusy = room.is_busy || !room.is_active
              return (
                <article
                  key={room.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!isBusy) {
                      setBookingRoom(room)
                    }
                  }}
                  className={`flex h-full min-h-[260px] ${isBusy ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'} flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:shadow-lg`}
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <img className="h-full w-full object-cover" src={placeholderImage} alt={room.name} />
                    <div className="absolute left-4 top-4 flex flex-col gap-2">
                      <Badge
                        variant={room.is_busy ? 'warning' : room.is_active ? 'success' : 'muted'}
                        label={room.is_busy ? 'Busy' : room.is_active ? 'Available' : 'Inactive'}
                      />
                      {/* <span className="rounded-3xl bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                        {new Date(room.created_at).toLocaleDateString()}
                      </span> */}
                    </div>
                  </div>
                  <div className="flex h-full flex-col justify-between gap-4 p-5">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{room.name}</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                            <span>🪑</span> {room.capacity} seats
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                            <span>🆔</span> Room {room.id}
                          </span>
                        </div>
                      </div>
                      {room.today_bookings && room.today_bookings.length > 0 && (
                        <div className="rounded-2xl bg-gray-100 p-3">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">📅 Booked today</p>
                          <div className="space-y-1.5">
                            {room.today_bookings.map((booking, idx) => (
                              <div key={idx} className="flex items-center justify-between rounded-lg bg-white/70 px-2 py-1.5">
                                <span className="text-xs font-semibold text-slate-700">{booking.start_time} - {booking.end_time}</span>
                                <span className="text-xs text-slate-500 line-clamp-1">{booking.department_name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <Button disabled={isBusy} className="w-full">
                      {room.is_busy ? 'Busy' : room.is_active ? 'Book Now' : 'View Slots'}
                    </Button>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </section>

      {bookingRoom ? <BookingModal room={bookingRoom} onClose={() => setBookingRoom(null)} /> : null}
    </div>
  )
}
