import { useEffect, useState, type FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { fetchDepartments } from '../lib/api'
import type { Department } from '../types'
import { Button } from '../components/ui/Button'

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth()
  const [department, setDepartment] = useState(user?.department_name ?? '')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    setDepartment(user?.department_name ?? '')
  }, [user])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!department.trim()) {
      setError('Please select a department.')
      return
    }

    const errorMessage = await updateProfile({ department_name: department.trim() })
    if (errorMessage) {
      setError(errorMessage)
      return
    }

    setSuccess('Profile updated successfully.')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">My Profile</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Update your department</h2>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Name</label>
            <input
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
              type="text"
              value={user?.name ?? ''}
              readOnly
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Email</label>
            <input
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
              type="email"
              value={user?.email ?? ''}
              readOnly
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Department</label>
            <select
              required
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
            >
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit">Save changes</Button>
          </div>

          {error ? <div className="rounded-2xl bg-rose-50 px-4 py-2 text-sm text-rose-800">{error}</div> : null}
          {success ? <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm text-emerald-800">{success}</div> : null}
        </form>
      </div>
    </div>
  )
}
