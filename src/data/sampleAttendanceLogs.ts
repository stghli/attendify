
import { AttendanceLog } from "@/types";

const sampleAttendanceLogs: AttendanceLog[] = [
  {
    id: "log-1",
    userId: "student-1",
    userName: "Alice Smith",
    userRole: "student",
    action: "time-in",
    timestamp: new Date(new Date().setHours(7, 55)).toISOString(),
    processed: true,
  },
  {
    id: "log-2",
    userId: "student-2",
    userName: "Bob Johnson",
    userRole: "student",
    action: "time-in",
    timestamp: new Date(new Date().setHours(8, 5)).toISOString(),
    processed: true,
  },
  {
    id: "log-3",
    userId: "teacher-1",
    userName: "Dr. Sarah Mitchell",
    userRole: "teacher",
    action: "time-in",
    timestamp: new Date(new Date().setHours(7, 30)).toISOString(),
    processed: true,
  },
  {
    id: "log-4",
    userId: "student-3",
    userName: "Carol Williams",
    userRole: "student",
    action: "time-in",
    timestamp: new Date(new Date().setHours(7, 58)).toISOString(),
    processed: true,
  },
  {
    id: "log-5",
    userId: "student-1",
    userName: "Alice Smith",
    userRole: "student",
    action: "time-out",
    timestamp: new Date(new Date().setHours(16, 0)).toISOString(),
    processed: true,
  },
];

export default sampleAttendanceLogs;
