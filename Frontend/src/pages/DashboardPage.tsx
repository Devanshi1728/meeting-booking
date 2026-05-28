import { useState } from 'react'
import type { Room } from '../data/rooms'
import { availableRooms } from '../data/rooms'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import BookingModal from '../components/BookingModal'

export const DashboardPage = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null)

  const date = () => {
    const today = new Date()
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }
    return today.toLocaleDateString(undefined, options)
  }

  // date window for selected-room form: today through next 5 days
  const todayObj = new Date()
  const formatDate = (d: Date) => d.toISOString().slice(0, 10)
  const minDate = formatDate(todayObj)
  const maxDate = formatDate(new Date(todayObj.getFullYear(), todayObj.getMonth(), todayObj.getDate()))

  return (
    <div className={`grid gap-6 ${selectedRoom ? 'xl:grid-cols-[1.25fr_0.9fr]' : 'grid-cols-1'}`}>
      <section className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Available Rooms</h2>
            <p className="mt-2 text-sm text-slate-600">Search, filter, and book rooms tailored to your team.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <input className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="Search by room name or feature..." />
            <select className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200">
              <option>{date()}</option>
              {/* <option>Tomorrow, May 27</option> */}
            </select>
            <select className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200">
              <option>Any capacity</option>
              <option>4+</option>
              <option>8+</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {availableRooms.map((room) => (
            <article
              key={room.id}
               onClick={(e) => {
                    e.stopPropagation()
                    // open booking modal
                    setBookingRoom(room)
                  }}
              className="flex h-full min-h-[260px] cursor-pointer flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <img className="h-full w-full object-cover" src={room.image} alt={room.name} />
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  <Badge variant={room.status === 'Available' ? 'success' : 'warning'} label={room.status} />
                  {room.tag ? (
                    <span className="rounded-3xl bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                      {room.tag}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex h-full flex-col justify-between gap-4 p-5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{room.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{room.seats} seats</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">
                  {room.amenities.map((amenity) => (
                    <span key={amenity} className="rounded-full bg-slate-100 px-3 py-1">
                      {amenity}
                    </span>
                  ))}
                </div>
                <Button
                  className="w-full"
                  // onClick={(e) => {
                  //   e.stopPropagation()
                  //   // open booking modal
                  //   setBookingRoom(room)
                  // }}
                >
                  {room.status === 'Available' ? 'Book Now' : 'View Slots'}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {bookingRoom ? <BookingModal room={bookingRoom} onClose={() => setBookingRoom(null)} /> : null}
    </div>
  )
}
