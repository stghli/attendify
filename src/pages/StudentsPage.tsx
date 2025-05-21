
import React from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, QrCode } from "lucide-react";
import { toast } from "sonner";

const StudentsPage: React.FC = () => {
  const { students, teachers } = useData();

  const getTeacherName = (teacherId: string): string => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : "Unassigned";
  };

  const handleViewQR = (student: any) => {
    // In a real app, we would show a QR code modal
    toast.info(`QR code for ${student.name} would be displayed here`);
  };

  const handlePrintQR = (student: any) => {
    // In a real app, we would print the QR code
    toast.info(`Printing QR code for ${student.name}`);
  };

  return (
    <div>
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">
          Manage students and their QR codes.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <Button>Add New Student</Button>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-muted-foreground">Total Students:</span>
          <span className="font-semibold">{students.length}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {students.map(student => (
          <Card key={student.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{student.name}</CardTitle>
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm text-muted-foreground">Age:</span>
                  <span className="text-sm col-span-2">{student.age}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm text-muted-foreground">Gender:</span>
                  <span className="text-sm col-span-2">{student.gender}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm text-muted-foreground">Teacher:</span>
                  <span className="text-sm col-span-2">{getTeacherName(student.assignedTeacherId)}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm text-muted-foreground">Parent Phone:</span>
                  <span className="text-sm col-span-2">{student.parentPhone}</span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => handleViewQR(student)}>
                  <QrCode className="h-4 w-4 mr-1" />
                  View QR
                </Button>
                <Button variant="outline" size="sm" onClick={() => handlePrintQR(student)}>
                  Print QR
                </Button>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentsPage;
