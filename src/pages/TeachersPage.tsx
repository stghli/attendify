
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
  GraduationCap,
  PenSquare,
  Trash2
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
    <div className="space-y-6 p-4">
      {/* Compact header */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-xl font-bold tracking-tight">Teachers</h1>
        <p className="text-sm text-muted-foreground">
          Manage teachers and their QR codes.
        </p>
      </div>

      {/* Compact controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search teachers..."
            className="pl-10 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <AddTeacherDialog />
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{filteredTeachers.length}</span> teachers
          </div>
        </div>
      </div>

      {/* Compact teacher cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTeachers.map(teacher => (
          <Card key={teacher.id} className="overflow-hidden transition-all duration-200 hover:shadow-md border rounded-lg bg-white/80 backdrop-blur-sm group hover:bg-white/90">
            {/* Compact top gradient bar */}
            <div className="absolute h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
            
            <CardHeader className="px-4 pt-4 pb-2">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-lg p-2 shadow-sm">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-base truncate">{teacher.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>ID: {teacher.id.split('-')[1]}</span>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 text-xs px-1.5 py-0.5">
                      {teacher.assignedClass}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="px-4 py-3 pt-1">
              {/* Compact info grid */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-blue-500" />
                  <span className="truncate">{teacher.email.split('@')[0]}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-emerald-500" />
                  <span className="truncate">{teacher.contact}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserRound className="h-3 w-3 text-violet-500" />
                  <span className="truncate">{teacher.gender}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3 w-3 text-orange-500" />
                  <span>{getStudentsByTeacher(teacher.id).length} students</span>
                </div>
              </div>
              
              {/* Compact action buttons */}
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs px-2 border-blue-200 hover:bg-blue-50" onClick={() => handleViewQR(teacher)}>
                  <QrCode className="h-3 w-3" />
                </Button>
                
                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs px-2 text-amber-600 hover:bg-amber-50 border-amber-200">
                  <PenSquare className="h-3 w-3" />
                </Button>
                
                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs px-2 text-red-600 hover:bg-red-50 border-red-200">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredTeachers.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-muted/40 rounded-full p-3 mb-3">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-base font-medium">No teachers found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery ? "Try adjusting your search term" : "Add teachers to get started"}
            </p>
          </div>
        )}
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
