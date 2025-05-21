
import React, { createContext, useState, useContext } from "react";
import { Student } from "@/types";
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

interface StudentsContextType {
  students: Student[];
  addStudent: (student: Omit<Student, "id" | "createdAt" | "qrCode">) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudentsByTeacher: (teacherId: string) => Student[];
}

const StudentsContext = createContext<StudentsContextType>({
  students: [],
  addStudent: () => {},
  updateStudent: () => {},
  deleteStudent: () => {},
  getStudentsByTeacher: () => [],
});

export const StudentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);

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

  // Get students by teacher
  const getStudentsByTeacher = (teacherId: string): Student[] => {
    return students.filter(student => student.assignedTeacherId === teacherId);
  };

  return (
    <StudentsContext.Provider
      value={{
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudentsByTeacher,
      }}
    >
      {children}
    </StudentsContext.Provider>
  );
};

export const useStudents = () => useContext(StudentsContext);
