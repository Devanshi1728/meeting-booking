import { useEffect, useState, type FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchDepartments } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import Modal from './ui/Modal'
import { Button } from './ui/Button'
import type { Department } from '../types'

type DepartmentSelectModalProps = {
  open: boolean
  onComplete: () => void
}

export const DepartmentSelectModal = ({ open, onComplete }: DepartmentSelectModalProps) => {
  const { user, updateProfile } = useAuth()
  const [departmentName, setDepartmentName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { data: departments = [], isLoading } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (user?.department_name && user.department_name !== '__select_department__') {
      setDepartmentName(user.department_name)
    }
  }, [user?.department_name])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!departmentName.trim()) {
      setError('Please select a department')
      return
    }

    const result = await updateProfile({ department_name: departmentName.trim() })
    if (result) {
      setError(result)
      return
    }

    setSuccess('Department saved successfully')
    onComplete()
  }

  if (!open) return null

  return (
    <Modal title="Choose your department" onClose={() => {}}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2 text-sm text-slate-600">
          <label className="block">Department</label>
          <select
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            value={departmentName}
            onChange={(event) => setDepartmentName(event.target.value)}
            disabled={isLoading}
          >
            <option value="">Select a department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.name}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        {error ? <div className="rounded-2xl bg-rose-50 px-4 py-2 text-sm text-rose-800">{error}</div> : null}
        {success ? <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm text-emerald-800">{success}</div> : null}

        <div className="flex justify-end gap-3">
          <Button type="submit">Save department</Button>
        </div>
      </form>
    </Modal>
  )
}
