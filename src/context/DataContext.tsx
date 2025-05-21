
import React, { createContext, useState, useContext, useEffect } from "react";
import { Student, Teacher, AttendanceLog, SMSLog } from "@/types";
import { toast } from "sonner";

// Mock data
const initialStudents: Student[] = [
  {
    id: "student-1",
    name: "Alice Johnson",
    role: "student",
    gender: "Female",
    age: 12,
    address: "123 School St",
    parentPhone: "+1234567890",
    assignedTeacherId: "teacher-1",
    qrCode: "student-1-qr",
    createdAt: new Date().toISOString(),
  },
  {
    id: "student-2",
    name: "Bob Williams",
    role: "student",
    gender: "Male",
    age: 13,
    address: "456 Learn Ave",
    parentPhone: "+1987654321",
    assignedTeacherId: "teacher-1",
    qrCode: "student-2-qr",
    createdAt: new Date().toISOString(),
  },
];

const initialTeachers: Teacher[] = [
  {
    id: "teacher-1",
    name: "John Smith",
    email: "jsmith@school.edu",
    role: "teacher",
    gender: "Male",
    contact: "555-123-4567",
    assignedClass: "Science",
    qrCode: "teacher-1-qr",
    createdAt: new Date().toISOString(),
  },
  {
    id: "teacher-2",
    name: "Sarah Davis",
    email: "sdavis@school.edu",
    role: "teacher",
    gender: "Female",
    contact: "555-987-6543",
    assignedClass: "Math",
    qrCode: "teacher-2-qr",
    createdAt: new Date().toISOString(),
  },
];

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

const initialSmsLogs: SMSLog[] = [
  {
    id: "sms-1",
    studentId: "student-1",
    studentName: "Alice Johnson",
    parentPhone: "+1234567890",
    message: "Alice Johnson checked in at 8:00 AM",
    timestamp: "2025-05-21T08:00:10Z",
    status: "delivered",
  },
];

interface DataContextType {
  students: Student[];
  teachers: Teacher[];
  attendanceLogs: AttendanceLog[];
  smsLogs: SMSLog[];
  addStudent: (student: Omit<Student, "id" | "createdAt" | "qrCode">) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addTeacher: (teacher: Omit<Teacher, "id" | "createdAt" | "qrCode">) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  recordAttendance: (
    userId: string, 
    userRole: "student" | "teacher",
    action: "time-in" | "time-out"
  ) => void;
  generateQRCode: (userId: string, userRole: "student" | "teacher") => string;
  getStudentsByTeacher: (teacherId: string) => Student[];
}

const DataContext = createContext<DataContextType>({
  students: [],
  teachers: [],
  attendanceLogs: [],
  smsLogs: [],
  addStudent: () => {},
  updateStudent: () => {},
  deleteStudent: () => {},
  addTeacher: () => {},
  updateTeacher: () => {},
  deleteTeacher: () => {},
  recordAttendance: () => {},
  generateQRCode: () => "",
  getStudentsByTeacher: () => [],
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>(initialAttendanceLogs);
  const [smsLogs, setSmsLogs] = useState<SMSLog[]>(initialSmsLogs);

  // Add a student
  const addStudent = (studentData: Omit<Student, "id" | "createdAt" | "qrCode">) => {
    const newStudent: Student = {
      ...studentData,
      id: `student-${Date.now()}`,
      createdAt: new Date().toISOString(),
      qrCode: `student-${Date.now()}-qr`,
    };
    
    setStudents([...students, newStudent]);
    toast.success(`Student ${newStudent.name} added successfully`);
  };

  // Update a student
  const updateStudent = (id: string, studentData: Partial<Student>) => {
    setStudents(
      students.map((student) =>
        student.id === id ? { ...student, ...studentData } : student
      )
    );
    toast.success("Student updated successfully");
  };

  // Delete a student
  const deleteStudent = (id: string) => {
    setStudents(students.filter((student) => student.id !== id));
    toast.success("Student deleted successfully");
  };

  // Add a teacher
  const addTeacher = (teacherData: Omit<Teacher, "id" | "createdAt" | "qrCode">) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: `teacher-${Date.now()}`,
      createdAt: new Date().toISOString(),
      qrCode: `teacher-${Date.now()}-qr`,
    };
    
    setTeachers([...teachers, newTeacher]);
    toast.success(`Teacher ${newTeacher.name} added successfully`);
  };

  // Update a teacher
  const updateTeacher = (id: string, teacherData: Partial<Teacher>) => {
    setTeachers(
      teachers.map((teacher) =>
        teacher.id === id ? { ...teacher, ...teacherData } : teacher
      )
    );
    toast.success("Teacher updated successfully");
  };

  // Delete a teacher
  const deleteTeacher = (id: string) => {
    setTeachers(teachers.filter((teacher) => teacher.id !== id));
    toast.success("Teacher deleted successfully");
  };

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
      const student = user as Student;
      const actionText = action === "time-in" ? "arrived at" : "left";
      const timeString = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const message = `${student.name} has ${actionText} school at ${timeString}.`;
      
      // Create SMS log
      const smsLog: SMSLog = {
        id: `sms-${Date.now()}`,
        studentId: student.id,
        studentName: student.name,
        parentPhone: student.parentPhone,
        message,
        timestamp: new Date().toISOString(),
        status: "delivered", // In a real app, this would depend on the SMS API response
      };
      
      setSmsLogs([smsLog, ...smsLogs]);
      
      // In a real app, you would integrate with Twilio or another SMS provider here
      console.log(`SMS sent to ${student.parentPhone}: ${message}`);
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

  // Get students by teacher
  const getStudentsByTeacher = (teacherId: string): Student[] => {
    return students.filter(student => student.assignedTeacherId === teacherId);
  };

  return (
    <DataContext.Provider
      value={{
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
