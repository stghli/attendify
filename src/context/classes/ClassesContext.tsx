
import React, { createContext, useState, useContext } from "react";
import { Class } from "@/types";
import { toast } from "sonner";

// Mock data
const initialClasses: Class[] = [
  {
    id: "class-1",
    name: "Grade 5A",
    description: "Elementary Grade 5 Section A",
    teacherId: "teacher-1",
    studentIds: ["student-1", "student-3", "student-5"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "class-2",
    name: "Grade 6B",
    description: "Elementary Grade 6 Section B",
    teacherId: "teacher-2",
    studentIds: ["student-2", "student-4"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "class-3",
    name: "Math Advanced",
    description: "Advanced Mathematics Class",
    teacherId: undefined,
    studentIds: [],
    createdAt: new Date().toISOString(),
  },
];

interface ClassesContextType {
  classes: Class[];
  addClass: (classData: Omit<Class, "id" | "createdAt">) => void;
  updateClass: (id: string, classData: Partial<Class>) => void;
  deleteClass: (id: string) => void;
  assignTeacherToClass: (classId: string, teacherId: string) => void;
  assignStudentToClass: (classId: string, studentId: string) => void;
  removeStudentFromClass: (classId: string, studentId: string) => void;
  getClassById: (id: string) => Class | undefined;
}

const ClassesContext = createContext<ClassesContextType>({
  classes: [],
  addClass: () => {},
  updateClass: () => {},
  deleteClass: () => {},
  assignTeacherToClass: () => {},
  assignStudentToClass: () => {},
  removeStudentFromClass: () => {},
  getClassById: () => undefined,
});

export const ClassesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [classes, setClasses] = useState<Class[]>(initialClasses);

  // Add a class
  const addClass = (classData: Omit<Class, "id" | "createdAt">) => {
    const newClass: Class = {
      ...classData,
      id: `class-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    setClasses([...classes, newClass]);
    toast.success(`Class ${newClass.name} created successfully`);
  };

  // Update a class
  const updateClass = (id: string, classData: Partial<Class>) => {
    setClasses(
      classes.map((cls) =>
        cls.id === id ? { ...cls, ...classData } : cls
      )
    );
    toast.success("Class updated successfully");
  };

  // Delete a class
  const deleteClass = (id: string) => {
    setClasses(classes.filter((cls) => cls.id !== id));
    toast.success("Class deleted successfully");
  };

  // Assign teacher to class
  const assignTeacherToClass = (classId: string, teacherId: string) => {
    setClasses(
      classes.map((cls) =>
        cls.id === classId ? { ...cls, teacherId } : cls
      )
    );
    toast.success("Teacher assigned to class successfully");
  };

  // Assign student to class
  const assignStudentToClass = (classId: string, studentId: string) => {
    setClasses(
      classes.map((cls) =>
        cls.id === classId 
          ? { ...cls, studentIds: [...cls.studentIds, studentId] }
          : cls
      )
    );
    toast.success("Student assigned to class successfully");
  };

  // Remove student from class
  const removeStudentFromClass = (classId: string, studentId: string) => {
    setClasses(
      classes.map((cls) =>
        cls.id === classId 
          ? { ...cls, studentIds: cls.studentIds.filter(id => id !== studentId) }
          : cls
      )
    );
    toast.success("Student removed from class successfully");
  };

  // Get class by ID
  const getClassById = (id: string): Class | undefined => {
    return classes.find(cls => cls.id === id);
  };

  return (
    <ClassesContext.Provider
      value={{
        classes,
        addClass,
        updateClass,
        deleteClass,
        assignTeacherToClass,
        assignStudentToClass,
        removeStudentFromClass,
        getClassById,
      }}
    >
      {children}
    </ClassesContext.Provider>
  );
};

export const useClasses = () => useContext(ClassesContext);
