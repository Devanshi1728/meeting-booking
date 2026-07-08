import axios from 'axios'
import type { RoomApi, BookingApi, CreateBookingPayload, UpdateBookingPayload, Department, UpdateProfilePayload, CreateRoomPayload } from '../types'

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('meeting-booking-token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      const err = new Error(error.response.data.message)
      return Promise.reject(err)
    }
    return Promise.reject(error)
  }
)

export const fetchRooms = async (): Promise<RoomApi[]> => {
  const response = await api.get<{ success: boolean; data: RoomApi[] }>('/rooms')
  return response.data.data
}

export const fetchBookings = async (): Promise<BookingApi[]> => {
  const response = await api.get<{ success: boolean; data: BookingApi[] }>('/booking')
  return response.data.data
}

export const fetchRoomBookings = async (roomId: number): Promise<BookingApi[]> => {
  const response = await api.get<{ success: boolean; data: BookingApi[] }>(`/booking?room_id=${roomId}`)
  return response.data.data
}

export const fetchDepartments = async (): Promise<Department[]> => {
  const response = await api.get<{ success: boolean; data: Department[] }>('/departments')
  return response.data.data
}

export const createBooking = async (payload: CreateBookingPayload): Promise<BookingApi> => {
  const response = await api.post<{ success: boolean; data: BookingApi, message?: string }>('/booking', payload)
  return response.data.data
}

export const updateBooking = async (id: number, payload: UpdateBookingPayload): Promise<BookingApi> => {
  const response = await api.put<{ success: boolean; data: BookingApi }>(`/booking/${id}`, payload)
  return response.data.data
}

export const cancelBooking = async (id: number): Promise<BookingApi> => {
  const response = await api.delete<{ success: boolean; data: BookingApi }>(`/booking/${id}`)
  return response.data.data
}

export const updateProfile = async (payload: UpdateProfilePayload): Promise<void> => {
  await api.put('/auth/profile', payload)
}

export const createRoom = async (payload: CreateRoomPayload): Promise<RoomApi> => {
  const response = await api.post<{ success: boolean; data: RoomApi }>(`/admin/rooms`, payload)
  return response.data.data
}
