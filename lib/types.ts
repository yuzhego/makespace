export interface User {
  id: string;
  email: string;
  user_type: 'popup' | 'host';
  created_at: string;
}

export interface Profile {
  user_id: string;
  user_type?: 'popup' | 'host';
  business_name: string;
  description: string;
  photos: string[]; // array of photo URLs
  space_description?: string; // for hosts
  space_photos?: string[]; // for hosts
  pricing?: string; // for hosts
  availability?: AvailabilitySlot[]; // for hosts
}

export interface AvailabilitySlot {
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
}

export interface Space {
  id: string;
  host_id: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  pricing: string;
}

export interface Request {
  id: string;
  popup_id: string;
  host_id: string;
  requested_date: string;
  requested_time: string;
  message: string;
  status: 'pending' | 'approved' | 'declined';
  response_notes?: string;
  created_at: string;
}

export interface AvailableSpace {
  id: string;
  name: string;
  description?: string;
  availableTimes: DaySchedule[];
  maxOccupancy: number;
  costPerHour: number;
  address?: string;
  imageUrl?: string;
}

export interface DaySchedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}