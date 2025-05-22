
import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  QrCode, 
  Printer, 
  Search, 
  Mail, 
  Phone, 
  BookOpen,
  UserRound,
  GraduationCap 
} from "lucide-react";
import QrCodeModal from "@/components/QrCodeModal";
import AddTeacherDialog from "@/components/teachers/AddTeacherDialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
        <div className="flex items-center px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/20">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Teachers: {filteredTeachers.length}</span>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeachers.map(teacher => (
          <Card key={teacher.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-slate-800">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">{teacher.name}</CardTitle>
                <div className="bg-white/20 p-1.5 rounded-full">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
              </div>
              <Badge variant="secondary" className="bg-white/30 text-white hover:bg-white/40 mt-1 w-fit">
                {teacher.assignedClass}
              </Badge>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="grid gap-4 mb-5">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">{teacher.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">{teacher.contact}</span>
                </div>
                <div className="flex items-center">
                  <UserRound className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">{teacher.gender}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  <div>
                    <span className="text-sm font-medium">
                      {getStudentsByTeacher(teacher.id).length} Students
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-6">
                <Button variant="outline" size="sm" onClick={() => handleViewQR(teacher)} 
                  className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-800/50">
                  <QrCode className="h-4 w-4 mr-1.5" />
                  QR Code
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleViewQR(teacher)}
                  className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-800/50">
                  <Printer className="h-4 w-4 mr-1.5" />
                  Print
                </Button>
                <Button variant="outline" size="sm"
                  className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-800/50">
                  <BookOpen className="h-4 w-4 mr-1.5" />
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
