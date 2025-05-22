
// User roles
export type UserRole = "admin" | "teacher" | "student" | "scanner";

// Base user type
export interface User {
  id: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

// Admin user type
export interface Admin extends User {
  email: string;
  role: "admin";
}

// Teacher user type
export interface Teacher extends User {
  email: string;
  gender: string;
  contact: string;
  assignedClass: string;
  qrCode: string;
  role: "teacher";
}

// Scanner user type
export interface Scanner extends User {
  email: string;
  role: "scanner";
}

// Student user type
export interface Student extends User {
  gender: string;
  age: number;
  address: string;
  parentPhone: string;
  assignedTeacherId: string;
  qrCode: string;
  role: "student";
  class: string; // Added class field
}

// Attendance log type
export interface AttendanceLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  timestamp: string;
  action: "time-in" | "time-out";
  status: "entry" | "exit";
}

// SMS notification log
export interface SMSLog {
  id: string;
  studentId: string;
  studentName: string;
  parentPhone: string;
  message: string;
  timestamp: string;
  status: "sent" | "failed" | "delivered";
}

// Auth state
export interface AuthState {
  user: Admin | Teacher | Scanner | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
