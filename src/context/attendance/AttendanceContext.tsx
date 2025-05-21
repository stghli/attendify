
import React, { createContext, useState, useContext } from "react";
import { AttendanceLog } from "@/types";
import { toast } from "sonner";
import { useStudents } from "../students/StudentsContext";
import { useTeachers } from "../teachers/TeachersContext";
import { useSmsNotifications } from "../sms/SmsContext";

// Mock data
const initialAttendanceLogs: AttendanceLog[] = [
  {
    id: "log-1",
    userId: "student-1",
    userName: "Alice Johnson",
    userRole: "student",
    timestamp: "2025-05-21T08:00:00Z",
    action: "time-in",
    status: "entry",
  },
  {
    id: "log-2",
    userId: "teacher-1",
    userName: "John Smith",
    userRole: "teacher",
    timestamp: "2025-05-21T07:45:00Z",
    action: "time-in",
    status: "entry",
  },
];

interface AttendanceContextType {
  attendanceLogs: AttendanceLog[];
  recordAttendance: (
    userId: string, 
    userRole: "student" | "teacher",
    action: "time-in" | "time-out"
  ) => void;
  generateQRCode: (userId: string, userRole: "student" | "teacher") => string;
}

const AttendanceContext = createContext<AttendanceContextType>({
  attendanceLogs: [],
  recordAttendance: () => {},
  generateQRCode: () => "",
});

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>(initialAttendanceLogs);
  const { students } = useStudents();
  const { teachers } = useTeachers();
  const { addSmsLog } = useSmsNotifications();

  // Record attendance
  const recordAttendance = (
    userId: string, 
    userRole: "student" | "teacher",
    action: "time-in" | "time-out"
  ) => {
    // Find the user
    const user = userRole === "student" 
      ? students.find(s => s.id === userId)
      : teachers.find(t => t.id === userId);

    if (!user) {
      toast.error("User not found");
      return;
    }

    // Create attendance log
    const newLog: AttendanceLog = {
      id: `log-${Date.now()}`,
      userId,
      userName: user.name,
      userRole,
      timestamp: new Date().toISOString(),
      action,
      status: action === "time-in" ? "entry" : "exit",
    };

    setAttendanceLogs([newLog, ...attendanceLogs]);
    
    // If student, send SMS notification
    if (userRole === "student") {
      const student = user;
      const actionText = action === "time-in" ? "arrived at" : "left";
      const timeString = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const message = `${student.name} has ${actionText} school at ${timeString}.`;
      
      // Send SMS via SmsContext
      addSmsLog({
        studentId: student.id,
        studentName: student.name,
        parentPhone: student.parentPhone,
        message,
      });
      
      toast.success(`Attendance recorded and notification sent`);
    } else {
      toast.success(`Attendance recorded for ${user.name}`);
    }
  };

  // Generate QR code (simplified for demo)
  const generateQRCode = (userId: string, userRole: "student" | "teacher"): string => {
    // In a real app, this would generate an actual QR code
    return `${userRole}-${userId}-qr`;
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendanceLogs,
        recordAttendance,
        generateQRCode,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext);
