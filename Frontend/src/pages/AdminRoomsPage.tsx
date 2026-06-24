import { useState, type FormEvent } from 'react'
import { createRoom } from '../lib/api'
import { Button } from '../components/ui/Button'

export const AdminRoomsPage = () => {
  const [name, setName] = useState('')
  const [capacity, setCapacity] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!name.trim()) {
      setError('Room name is required')
      return
    }

    const parsedCapacity = Number(capacity)
    if (Number.isNaN(parsedCapacity) || parsedCapacity <= 0) {
      setError('Capacity must be a positive number')
      return
    }

    try {
      await createRoom({
        name: name.trim(),
        capacity: parsedCapacity,
        image_url: imageUrl.trim() || null,
        is_active: isActive,
      })
      setSuccess('Room created successfully.')
      setName('')
      setCapacity('')
      setImageUrl('')
      setIsActive(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to create room')
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Add a new meeting room</h2>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Room name</label>
            <input
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Conference Room A"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Capacity</label>
            <input
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              type="number"
              value={capacity}
              onChange={(event) => setCapacity(event.target.value)}
              placeholder="10"
              min={1}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Image URL</label>
            <input
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://example.com/room.jpg"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-sky-600"
            />
            <label htmlFor="isActive" className="text-sm text-slate-600">
              Active room
            </label>
          </div>

          {error ? <div className="rounded-2xl bg-rose-50 px-4 py-2 text-sm text-rose-800">{error}</div> : null}
          {success ? <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm text-emerald-800">{success}</div> : null}

          <Button type="submit">Create room</Button>
        </form>
      </div>
    </div>
  )
}
