import { bookingCards } from '../data/rooms'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

export const BookingsPage = () => {
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

      <div className="space-y-4">
        {bookingCards.map((booking) => (
          <div key={booking.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{booking.room}</h3>
                <p className="mt-2 text-sm text-slate-500">{booking.date}</p>
                <p className="mt-1 text-sm text-slate-600">{booking.start} - {booking.end}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success" label={booking.status} />
                <Button variant="ghost">Edit</Button>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">{booking.seats} seats</div>
              <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">Optional</div>
              <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">{booking.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
