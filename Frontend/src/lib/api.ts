import axios from 'axios'
import type { RoomApi, BookingApi, CreateBookingPayload, UpdateBookingPayload, Department } from '../types'

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetchRooms = async (): Promise<RoomApi[]> => {
  const response = await api.get<{ success: boolean; data: RoomApi[] }>('/rooms')
  return response.data.data
}

export const fetchBookings = async (): Promise<BookingApi[]> => {
  const response = await api.get<{ success: boolean; data: BookingApi[] }>('/booking')
  return response.data.data
}

export const fetchDepartments = async (): Promise<Department[]> => {
  const response = await api.get<{ success: boolean; data: Department[] }>('/departments')
  return response.data.data
}

export const createBooking = async (payload: CreateBookingPayload): Promise<BookingApi> => {
  const response = await api.post<{ success: boolean; data: BookingApi }>('/booking', payload)
  return response.data.data
}

export const updateBooking = async (id: number, payload: UpdateBookingPayload): Promise<BookingApi> => {
  const response = await api.put<{ success: boolean; data: BookingApi }>(`/booking/${id}`, payload)
  return response.data.data
}
