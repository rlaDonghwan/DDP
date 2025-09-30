// 인증 관련 타입은 types/auth.ts에서 import
export type { User, UserDetails, UserRole, LoginRequest, LoginResponse, SessionResponse } from './auth';

export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  businessNumber: string;
  type: 'manufacturer' | 'repair';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Device {
  id: string;
  serialNumber: string;
  model: string;
  userId: string;
  companyId: string;
  installDate: Date;
  status: 'active' | 'inactive' | 'maintenance';
  lastCheckDate?: Date;
  nextCheckDate: Date;
}

export interface DrivingRecord {
  id: string;
  userId: string;
  deviceId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  alcoholLevel: number;
  location: string;
  status: 'normal' | 'warning' | 'violation';
  submitted: boolean;
  submittedAt?: Date;
}

export interface Booking {
  id: string;
  userId: string;
  companyId: string;
  type: 'inspection' | 'repair' | 'education';
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Education {
  id: string;
  userId: string;
  companyId: string;
  date: Date;
  type: 'initial' | 'refresher';
  status: 'completed' | 'failed';
  score?: number;
  certificate?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalDevices: number;
  totalRecords: number;
  violationCount: number;
  monthlyRecords: Array<{
    month: string;
    count: number;
  }>;
  riskLevels: Array<{
    level: string;
    count: number;
  }>;
}