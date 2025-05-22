
import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, QrCode, Printer, Search } from "lucide-react";
import QrCodeModal from "@/components/QrCodeModal";
import AddTeacherDialog from "@/components/teachers/AddTeacherDialog";
import { Input } from "@/components/ui/input";

const TeachersPage: React.FC = () => {
  const { teachers, getStudentsByTeacher } = useData();
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewQR = (teacher: any) => {
    setSelectedTeacher(teacher);
    setIsQrModalOpen(true);
  };

  const filteredTeachers = searchQuery
    ? teachers.filter(teacher => 
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.assignedClass.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : teachers;

  return (
    <div>
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Teachers</h1>
        <p className="text-muted-foreground">
          Manage teachers and their QR codes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_200px]">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teachers by name, email, or class..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <AddTeacherDialog />
      </div>

      <div className="flex justify-between items-center my-6">
        <div className="flex items-center px-3 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/20">
          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Teachers: {filteredTeachers.length}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeachers.map(teacher => (
          <Card key={teacher.id} className="overflow-hidden border-purple-100 dark:border-purple-800/30 transition-all hover:shadow-md">
            <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-purple-900 dark:text-purple-100">{teacher.name}</CardTitle>
                <div className="bg-purple-200 dark:bg-purple-700/30 p-1.5 rounded-full">
                  <Users className="h-4 w-4 text-purple-700 dark:text-purple-300" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2 mb-4">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">Class:</span>
                  <span className="text-sm col-span-2">{teacher.assignedClass}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">Email:</span>
                  <span className="text-sm col-span-2">{teacher.email}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">Contact:</span>
                  <span className="text-sm col-span-2">{teacher.contact}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">Gender:</span>
                  <span className="text-sm col-span-2">{teacher.gender}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">Students:</span>
                  <span className="text-sm col-span-2 font-medium">
                    {getStudentsByTeacher(teacher.id).length}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => handleViewQR(teacher)} className="text-purple-700 border-purple-200 hover:bg-purple-50 hover:text-purple-800 dark:text-purple-300 dark:border-purple-800 dark:hover:bg-purple-900/30">
                  <QrCode className="h-4 w-4 mr-1" />
                  View QR
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleViewQR(teacher)} className="text-purple-700 border-purple-200 hover:bg-purple-50 hover:text-purple-800 dark:text-purple-300 dark:border-purple-800 dark:hover:bg-purple-900/30">
                  <Printer className="h-4 w-4 mr-1" />
                  Print QR
                </Button>
                <Button variant="outline" size="sm" className="text-purple-700 border-purple-200 hover:bg-purple-50 hover:text-purple-800 dark:text-purple-300 dark:border-purple-800 dark:hover:bg-purple-900/30">
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
