
import React, { createContext, useState, useContext } from "react";
import { Student } from "@/types";
import { toast } from "sonner";

// Mock data with class information
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
    class: "Grade 5A",
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
    class: "Grade 6B",
  },
  {
    id: "student-3",
    name: "Charlie Brown",
    role: "student",
    gender: "Male",
    age: 12,
    address: "789 Knowledge Blvd",
    parentPhone: "+1567890123",
    assignedTeacherId: "teacher-2",
    qrCode: "student-3-qr",
    createdAt: new Date().toISOString(),
    class: "Grade 5A",
  },
  {
    id: "student-4",
    name: "Diana Prince",
    role: "student",
    gender: "Female",
    age: 13,
    address: "101 Wonder St",
    parentPhone: "+1345678901",
    assignedTeacherId: "teacher-2",
    qrCode: "student-4-qr",
    createdAt: new Date().toISOString(),
    class: "Grade 6B",
  },
  {
    id: "student-5",
    name: "Edward Smith",
    role: "student",
    gender: "Male",
    age: 12,
    address: "202 Scholar Ave",
    parentPhone: "+1234509876",
    assignedTeacherId: "teacher-1",
    qrCode: "student-5-qr",
    createdAt: new Date().toISOString(),
    class: "Grade 5A",
  },
];

interface StudentsContextType {
  students: Student[];
  addStudent: (student: Omit<Student, "id" | "createdAt" | "qrCode">) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudentsByTeacher: (teacherId: string) => Student[];
  getStudentsByClass: (className: string) => Student[]; // New method to get students by class
  getAllClasses: () => string[]; // New method to get all classes
}

const StudentsContext = createContext<StudentsContextType>({
  students: [],
  addStudent: () => {},
  updateStudent: () => {},
  deleteStudent: () => {},
  getStudentsByTeacher: () => [],
  getStudentsByClass: () => [], // Initialize new method
  getAllClasses: () => [], // Initialize new method
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

  // Get students by class
  const getStudentsByClass = (className: string): Student[] => {
    return students.filter(student => student.class === className);
  };

  // Get all unique classes
  const getAllClasses = (): string[] => {
    const classSet = new Set<string>();
    students.forEach(student => {
      if (student.class) {
        classSet.add(student.class);
      }
    });
    return Array.from(classSet);
  };

  return (
    <StudentsContext.Provider
      value={{
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudentsByTeacher,
        getStudentsByClass,
        getAllClasses,
      }}
    >
      {children}
    </StudentsContext.Provider>
  );
};

export const useStudents = () => useContext(StudentsContext);
