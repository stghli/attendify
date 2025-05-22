
import { SMSLog } from "@/types";

const sampleSmsLogs: SMSLog[] = [
  {
    id: "sms-1",
    studentId: "student-1",
    studentName: "Alice Smith",
    parentPhone: "555-1234",
    message: "Alice was marked present today at 7:55 AM",
    sentAt: new Date(new Date().setHours(8, 0)).toISOString(),
    status: "delivered",
  },
  {
    id: "sms-2",
    studentId: "student-2",
    studentName: "Bob Johnson",
    parentPhone: "555-5678",
    message: "Bob was marked present today at 8:05 AM",
    sentAt: new Date(new Date().setHours(8, 10)).toISOString(),
    status: "delivered",
  },
  {
    id: "sms-3",
    studentId: "student-3",
    studentName: "Carol Williams",
    parentPhone: "555-9012",
    message: "Carol was marked present today at 7:58 AM",
    sentAt: new Date(new Date().setHours(8, 5)).toISOString(),
    status: "delivered",
  },
  {
    id: "sms-4",
    studentId: "student-4",
    studentName: "David Brown",
    parentPhone: "555-3456",
    message: "David was marked absent today",
    sentAt: new Date(new Date().setHours(9, 15)).toISOString(),
    status: "delivered",
  },
];

export default sampleSmsLogs;
