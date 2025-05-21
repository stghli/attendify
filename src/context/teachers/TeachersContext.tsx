
import React, { createContext, useState, useContext } from "react";
import { Teacher } from "@/types";
import { toast } from "sonner";

// Mock data
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

interface TeachersContextType {
  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, "id" | "createdAt" | "qrCode">) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
}

const TeachersContext = createContext<TeachersContextType>({
  teachers: [],
  addTeacher: () => {},
  updateTeacher: () => {},
  deleteTeacher: () => {},
});

export const TeachersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);

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

  return (
    <TeachersContext.Provider
      value={{
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
      }}
    >
      {children}
    </TeachersContext.Provider>
  );
};

export const useTeachers = () => useContext(TeachersContext);
