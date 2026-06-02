const events = [
  { title: 'Emerald Room', time: '02:00 - 03:00 PM', color: 'bg-emerald-100 text-emerald-900' },
  { title: 'Sapphire Room', time: '09:00 - 10:00 AM', color: 'bg-sky-100 text-sky-900' },
  { title: 'Ruby Room', time: '04:00 - 05:00 PM', color: 'bg-rose-100 text-rose-900' },
  { title: 'Pearl Room', time: '03:00 - 04:00 PM', color: 'bg-violet-100 text-violet-900' },
]

export const CalendarPage = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Calendar View</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">This week at a glance</h2>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            <button className="rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">Day</button>
            <button className="rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm">Week</button>
            <button className="rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">Month</button>
            <button className="rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">Today</button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 text-sm text-slate-500">
          <div>May 26 – June 1, 2024</div>
          <div className="flex items-center gap-2">
            <button className="rounded-3xl border border-slate-200 px-4 py-2 text-sm text-slate-700">←</button>
            <button className="rounded-3xl border border-slate-200 px-4 py-2 text-sm text-slate-700">→</button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-7">
          {['Sun 26', 'Mon 27', 'Tue 28', 'Wed 29', 'Thu 30', 'Fri 31', 'Sat 1'].map((day) => (
            <div key={day} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">{day}</p>
              <div className="mt-4 space-y-3">
                {events.slice(0, 1).map((event) => (
                  <div key={event.title} className={`rounded-3xl p-3 ${event.color}`}>
                    <p className="text-sm font-semibold">{event.title}</p>
                    <p className="mt-1 text-xs">{event.time}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
