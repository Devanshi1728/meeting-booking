export type AuthUser = {
  id: string
  name: string
  email: string
  department: string
}

export type AuthState = {
  user: AuthUser | null
}

export type RegisterFormValues = {
  name: string
  email: string
  department: string
  password: string
  confirmPassword: string
}

export type LoginFormValues = {
  email: string
  password: string
}

export type RoomApi = {
  id: number
  name: string
  capacity: number
  image_url: string | null
  is_active: boolean
  is_busy: boolean
  created_at: string
  today_bookings?: Array<{
    start_time: string
    end_time: string
    department_name: string
  }>
}

export type Department = {
  id: number
  name: string
}

export type BookingApi = {
  id: number
  room_id: number
  room_name: string
  department_name: string
  user_name: string
  date: string
  start_time: string
  end_time: string
  created_at: string
  capacity?: number
}

export type CreateBookingPayload = {
  room_id: number
  user_name: string
  department_name: string
  date: string
  start_time: string
  end_time: string
}

export type UpdateBookingPayload = {
  user_name: string
  department_name: string
  date: string
  start_time: string
  end_time: string
}
