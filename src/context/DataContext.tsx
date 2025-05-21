
import React from "react";
import { StudentsProvider } from "./students/StudentsContext";
import { TeachersProvider } from "./teachers/TeachersContext";
import { SmsProvider } from "./sms/SmsContext";
import { AttendanceProvider } from "./attendance/AttendanceContext";

// Re-export all context hooks for backward compatibility
export { useStudents } from "./students/StudentsContext";
export { useTeachers } from "./teachers/TeachersContext";
export { useAttendance } from "./attendance/AttendanceContext";
export { useSmsNotifications } from "./sms/SmsContext";

// Combine all context functionality to maintain the same API
export const useData = () => {
  const { students, addStudent, updateStudent, deleteStudent, getStudentsByTeacher } = useStudents();
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useTeachers();
  const { attendanceLogs, recordAttendance, generateQRCode } = useAttendance();
  const { smsLogs } = useSmsNotifications();

  return {
    students,
    teachers,
    attendanceLogs,
    smsLogs,
    addStudent,
    updateStudent,
    deleteStudent,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    recordAttendance,
    generateQRCode,
    getStudentsByTeacher,
  };
};

// Combined provider that wraps all individual providers
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StudentsProvider>
      <TeachersProvider>
        <SmsProvider>
          <AttendanceProvider>
            {children}
          </AttendanceProvider>
        </SmsProvider>
      </TeachersProvider>
    </StudentsProvider>
  );
};
