import React, { useState, useEffect } from "react";
import { useStudents, useDeleteStudent } from "@/hooks/useStudents";
import { useTeachers } from "@/hooks/useTeachers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import QrCodeModal from "@/components/QrCodeModal";
import StudentCard from "@/components/students/StudentCard";
import { AddStudentDialog } from "@/components/students/AddStudentDialog";
import ClassFilterTabs from "@/components/students/ClassFilterTabs";
import { Student } from "@/hooks/useStudents";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const StudentsPage: React.FC = () => {
  const { data: students = [] } = useStudents();
  const { data: teachers = [] } = useTeachers();
  const deleteStudent = useDeleteStudent();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  
  // Get all unique classes
  const classes = Array.from(new Set(students.map(student => student.class)));
  
  // Count students in each class
  const studentsCount: Record<string, number> = {};
  classes.forEach(cls => {
    studentsCount[cls] = students.filter(student => student.class === cls).length;
  });
  
  // Filter students based on search term and selected class
  useEffect(() => {
    let result = students;
    
    if (selectedClass !== "all") {
      result = result.filter(student => student.class === selectedClass);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        student =>
          student.name.toLowerCase().includes(term) ||
          student.class.toLowerCase().includes(term)
      );
    }
    
    setFilteredStudents(result);
  }, [students, searchTerm, selectedClass]);

  const getTeacherName = (teacherId: string): string => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : "Unassigned";
  };

  const handleViewQR = (student: Student) => {
    setSelectedStudent(student);
    setIsQrModalOpen(true);
  };
  
  const handleEdit = (student: Student) => {
    console.log("Edit student:", student.name);
  };
  
  const handleDelete = (student: Student) => {
    setStudentToDelete(student);
  };
  
  const confirmDelete = () => {
    if (studentToDelete) {
      deleteStudent.mutate(studentToDelete.id);
      setStudentToDelete(null);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Compact header */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-xl font-bold tracking-tight">Students</h1>
        <p className="text-sm text-muted-foreground">
          Manage students and their QR codes.
        </p>
      </div>

      {/* Compact controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <AddStudentDialog />
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{filteredStudents.length}</span> students
          </div>
        </div>
      </div>
      
      {/* Class filter tabs */}
      <ClassFilterTabs
        classes={classes}
        selectedClass={selectedClass}
        onSelectClass={setSelectedClass}
        studentsCount={studentsCount}
      />

      {/* Compact student cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredStudents.map(student => (
          <StudentCard
            key={student.id}
            student={student as any}
            teacherName={getTeacherName(student.user_id)}
            onViewQR={handleViewQR as any}
            onEdit={handleEdit as any}
            onDelete={handleDelete as any}
          />
        ))}
        
        {filteredStudents.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-muted/40 rounded-full p-3 mb-3">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-base font-medium">No students found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchTerm ? "Try adjusting your search term" : "Add students to get started"}
            </p>
          </div>
        )}
      </div>
      
      {/* QR Code Modal */}
      {selectedStudent && (
        <QrCodeModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          userId={selectedStudent.id}
          userName={selectedStudent.name}
          userRole="student"
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!studentToDelete} onOpenChange={(open) => !open && setStudentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {studentToDelete?.name} from the system.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentsPage;
