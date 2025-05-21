
import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, QrCode, Printer } from "lucide-react";
import QrCodeModal from "@/components/QrCodeModal";

const TeachersPage: React.FC = () => {
  const { teachers, getStudentsByTeacher } = useData();
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const handleViewQR = (teacher: any) => {
    setSelectedTeacher(teacher);
    setIsQrModalOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Teachers</h1>
        <p className="text-muted-foreground">
          Manage teachers and their QR codes.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <Button>Add New Teacher</Button>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-muted-foreground">Total Teachers:</span>
          <span className="font-semibold">{teachers.length}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teachers.map(teacher => (
          <Card key={teacher.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{teacher.name}</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm text-muted-foreground">Class:</span>
                  <span className="text-sm col-span-2">{teacher.assignedClass}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="text-sm col-span-2">{teacher.email}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm text-muted-foreground">Contact:</span>
                  <span className="text-sm col-span-2">{teacher.contact}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm text-muted-foreground">Students:</span>
                  <span className="text-sm col-span-2">
                    {getStudentsByTeacher(teacher.id).length}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => handleViewQR(teacher)}>
                  <QrCode className="h-4 w-4 mr-1" />
                  View QR
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleViewQR(teacher)}>
                  <Printer className="h-4 w-4 mr-1" />
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
      
      {selectedTeacher && (
        <QrCodeModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          userId={selectedTeacher.id}
          userName={selectedTeacher.name}
          userRole="teacher"
        />
      )}
    </div>
  );
};

export default TeachersPage;
