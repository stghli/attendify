
import React, { createContext, useState, useContext } from "react";
import { Student, Teacher, AttendanceLog, SMSLog, UserRole } from "@/types";

// Sample data
import sampleStudents from "@/data/sampleStudents";
import sampleTeachers from "@/data/sampleTeachers";
import sampleAttendanceLogs from "@/data/sampleAttendanceLogs";
import sampleSmsLogs from "@/data/sampleSmsLogs";

// Define the data context type
interface DataContextType {
  students: Student[];
  teachers: Teacher[];
  attendanceLogs: AttendanceLog[];
  smsLogs: SMSLog[];
  users: any[]; // User array from AuthContext
  addStudent: (student: Omit<Student, "id" | "qrCode" | "createdAt">) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addTeacher: (teacher: Omit<Teacher, "id" | "qrCode" | "createdAt">) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  addAttendanceLog: (log: Omit<AttendanceLog, "id">) => void;
  addSmsLog: (log: Omit<SMSLog, "id">) => void;
  addUser: (user: any) => void;
  deleteUser: (id: string) => void;
  recordAttendance: (userId: string, userRole: "student" | "teacher", action: "time-in" | "time-out") => void;
  getStudentsByTeacher: (teacherId: string) => Student[];
}

const DataContext = createContext<DataContextType>({
  students: [],
  teachers: [],
  attendanceLogs: [],
  smsLogs: [],
  users: [],
  addStudent: () => {},
  updateStudent: () => {},
  deleteStudent: () => {},
  addTeacher: () => {},
  updateTeacher: () => {},
  deleteTeacher: () => {},
  addAttendanceLog: () => {},
  addSmsLog: () => {},
  addUser: () => {},
  deleteUser: () => {},
  recordAttendance: () => {},
  getStudentsByTeacher: () => [],
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(sampleStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(sampleTeachers);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>(sampleAttendanceLogs);
  const [smsLogs, setSmsLogs] = useState<SMSLog[]>(sampleSmsLogs);
  const [users, setUsers] = useState<any[]>([]);

  // Student CRUD operations
  const addStudent = (student: Omit<Student, "id" | "qrCode" | "createdAt">) => {
    const newStudent: Student = {
      ...student,
      id: `student-${Date.now()}`,
      qrCode: `student-qr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setStudents([...students, newStudent]);
  };

  const updateStudent = (id: string, studentUpdate: Partial<Student>) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, ...studentUpdate } : student
    ));
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(student => student.id !== id));
  };

  // Teacher CRUD operations
  const addTeacher = (teacher: Omit<Teacher, "id" | "qrCode" | "createdAt">) => {
    const newTeacher: Teacher = {
      ...teacher,
      id: `teacher-${Date.now()}`,
      qrCode: `teacher-qr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTeachers([...teachers, newTeacher]);
  };

  const updateTeacher = (id: string, teacherUpdate: Partial<Teacher>) => {
    setTeachers(teachers.map(teacher => 
      teacher.id === id ? { ...teacher, ...teacherUpdate } : teacher
    ));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(teachers.filter(teacher => teacher.id !== id));
  };

  // Attendance log operations
  const addAttendanceLog = (log: Omit<AttendanceLog, "id">) => {
    const newLog: AttendanceLog = {
      ...log,
      id: `log-${Date.now()}`,
    };
    setAttendanceLogs([newLog, ...attendanceLogs]);
  };

  // Record attendance for a user (student or teacher)
  const recordAttendance = (userId: string, userRole: "student" | "teacher", action: "time-in" | "time-out") => {
    // Find the user
    let userName = "";
    
    if (userRole === "student") {
      const student = students.find(s => s.id === userId);
      if (student) userName = student.name;
    } else if (userRole === "teacher") {
      const teacher = teachers.find(t => t.id === userId);
      if (teacher) userName = teacher.name;
    }
    
    if (!userName) return;
    
    // Create and add attendance log
    const attendanceLog: Omit<AttendanceLog, "id"> = {
      userId,
      userName,
      userRole,
      action,
      timestamp: new Date().toISOString(),
      status: action === "time-in" ? "entry" : "exit",
    };
    
    addAttendanceLog(attendanceLog);
    
    // If it's a student, send SMS notification
    if (userRole === "student") {
      const student = students.find(s => s.id === userId);
      if (student && student.parentPhone) {
        const message = `${student.name} was marked ${action === "time-in" ? "present" : "out"} at ${new Date().toLocaleTimeString()}`;
        
        const smsLog: Omit<SMSLog, "id"> = {
          studentId: student.id,
          studentName: student.name,
          parentPhone: student.parentPhone,
          message,
          timestamp: new Date().toISOString(),
          status: "delivered",
        };
        
        addSmsLog(smsLog);
      }
    }
  };

  // Function to get students by teacher
  const getStudentsByTeacher = (teacherId: string): Student[] => {
    return students.filter(student => student.assignedTeacherId === teacherId);
  };

  // SMS log operations
  const addSmsLog = (log: Omit<SMSLog, "id">) => {
    const newLog: SMSLog = {
      ...log,
      id: `sms-${Date.now()}`,
    };
    setSmsLogs([newLog, ...smsLogs]);
  };

  // User management
  const addUser = (user: any) => {
    setUsers([...users, user]);
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <DataContext.Provider value={{
      students,
      teachers,
      attendanceLogs,
      smsLogs,
      users,
      addStudent,
      updateStudent,
      deleteStudent,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      addAttendanceLog,
      addSmsLog,
      addUser,
      deleteUser,
      recordAttendance,
      getStudentsByTeacher,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
