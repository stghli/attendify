
import { Teacher } from "@/types";

const sampleTeachers: Teacher[] = [
  {
    id: "teacher-1",
    name: "Dr. Sarah Mitchell",
    email: "smitchell@school.edu",
    role: "teacher",
    gender: "Female",
    contact: "555-1111",
    assignedClass: "Science",
    qrCode: "teacher-1-qr",
    createdAt: new Date().toISOString(),
  },
  {
    id: "teacher-2",
    name: "Prof. Michael Chen",
    email: "mchen@school.edu",
    role: "teacher",
    gender: "Male",
    contact: "555-2222",
    assignedClass: "Mathematics",
    qrCode: "teacher-2-qr",
    createdAt: new Date().toISOString(),
  },
  {
    id: "teacher-3",
    name: "Dr. Jessica Thompson",
    email: "jthompson@school.edu",
    role: "teacher",
    gender: "Female",
    contact: "555-3333",
    assignedClass: "English",
    qrCode: "teacher-3-qr",
    createdAt: new Date().toISOString(),
  },
];

export default sampleTeachers;
