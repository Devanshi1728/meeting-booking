export type Room = {
  id: string
  name: string
  seats: number
  status: 'Available' | 'Busy'
  amenities: string[]
  image: string
  tag?: string
  price?: string
}

export const availableRooms: Room[] = [
  {
    id: 'emerald',
    name: 'Leaders Den 1',
    seats: 6,
    status: 'Available',
    amenities: ['TV', 'Whiteboard', 'AC'],
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'sapphire',
    name: 'Leaders Den 2',
    seats: 8,
    status: 'Available',
    amenities: ['TV', 'VC', 'Whiteboard'],
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
  },

  {
    id: 'ruby',
    name: 'Innovation Cove',
    seats: 10,
    status: 'Busy',
    amenities: ['TV', 'VC' ],
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',    
    tag: 'Busy till 2:30 PM',
  },
  {
    id: 'pearl',
    name: 'Pearl Room',
    seats: 4,
    status: 'Available',
    amenities: ['TV' ],
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'topaz',
    name: 'Topaz Room',
    seats: 12,
    status: 'Busy',
    amenities: ['TV', 'VC', 'AC'],
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    tag: 'Busy till 6:00 PM',
  },
  {
    id: 'onyx',
    name: 'Onyx Room',
    seats: 6,
    status: 'Available',
    amenities: ['AC'],
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
  },
]

export const bookingCards = [
  {
    id: 'booking-1',
    room: 'Emerald Room',
    date: 'Today — May 26, 2024',
    start: '02:00 PM',
    end: '03:00 PM',
    seats: 6,
    status: 'Upcoming',
    note: 'Design Sync',
  },
  {
    id: 'booking-2',
    room: 'Ruby Room',
    date: 'Today — May 26, 2024',
    start: '04:00 PM',
    end: '05:00 PM',
    seats: 10,
    status: 'Upcoming',
    note: 'Dev Team Discussion',
  },
  {
    id: 'booking-3',
    room: 'Sapphire Room',
    date: 'Tomorrow — May 27, 2024',
    start: '11:00 AM',
    end: '12:00 PM',
    seats: 6,
    status: 'Upcoming',
    note: 'Sprint Planning',
  },
  {
    id: 'booking-4',
    room: 'Pearl Room',
    date: 'Tomorrow — May 27, 2024',
    start: '03:00 PM',
    end: '04:00 PM',
    seats: 4,
    status: 'Upcoming',
    note: 'Quick Standup',
  },
]
