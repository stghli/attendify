
import { Student } from "@/types";

const sampleStudents: Student[] = [
  {
    id: "student-1",
    name: "Alice Smith",
    gender: "Female",
    age: 16,
    class: "10A",
    address: "123 School Lane",
    parentPhone: "555-1234",
    role: "student",
    assignedTeacherId: "teacher-1",
    qrCode: "student-student-1-qr",
    createdAt: new Date().toISOString(),
    attendance: {
      present: 18,
      absent: 2,
      late: 1,
    }
  },
  {
    id: "student-2",
    name: "Bob Johnson",
    gender: "Male",
    age: 15,
    class: "9B",
    address: "456 Education Street",
    parentPhone: "555-5678",
    role: "student",
    assignedTeacherId: "teacher-1",
    qrCode: "student-student-2-qr",
    createdAt: new Date().toISOString(),
    attendance: {
      present: 16,
      absent: 3,
      late: 2,
    }
  },
  {
    id: "student-3",
    name: "Carol Williams",
    gender: "Female",
    age: 16,
    class: "10A",
    address: "789 Learning Avenue",
    parentPhone: "555-9012",
    role: "student",
    assignedTeacherId: "teacher-2",
    qrCode: "student-student-3-qr",
    createdAt: new Date().toISOString(),
    attendance: {
      present: 19,
      absent: 1,
      late: 0,
    }
  },
  {
    id: "student-4",
    name: "David Brown",
    gender: "Male",
    age: 15,
    class: "9B",
    address: "321 Knowledge Road",
    parentPhone: "555-3456",
    role: "student",
    assignedTeacherId: "teacher-2",
    qrCode: "student-student-4-qr",
    createdAt: new Date().toISOString(),
    attendance: {
      present: 17,
      absent: 2,
      late: 1,
    }
  },
  {
    id: "student-5",
    name: "Eva Davis",
    gender: "Female",
    age: 17,
    class: "11C",
    address: "654 Wisdom Court",
    parentPhone: "555-7890",
    role: "student",
    assignedTeacherId: "teacher-1",
    qrCode: "student-student-5-qr",
    createdAt: new Date().toISOString(),
    attendance: {
      present: 20,
      absent: 0,
      late: 0,
    }
  },
];

export default sampleStudents;
