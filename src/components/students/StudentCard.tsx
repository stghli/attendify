
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  QrCode, 
  Printer, 
  PenSquare, 
  Trash2, 
  GraduationCap, 
  Phone, 
  MapPin,
} from "lucide-react";
import { Student } from "@/types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface StudentCardProps {
  student: Student;
  teacherName: string;
  onViewQR: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  teacherName,
  onViewQR,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:border-primary/40 group relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-600"></div>
      
      <CardHeader className="px-6 pt-6 pb-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full p-2">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-lg">{student.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>ID: {student.id.split('-')[1]}</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2">
                  {student.class}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 pt-4">
        <div className="grid grid-cols-2 gap-3 mb-4 mt-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{student.age} years</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{student.gender}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="text-sm truncate cursor-help">
                  {student.parentPhone}
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto">
                <p>Parent Phone: {student.parentPhone}</p>
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="text-sm truncate cursor-help max-w-[100px]">
                  {student.address}
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto">
                <p>{student.address}</p>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
        
        <div className="border-t pt-4 mt-2">
          <div className="flex items-center gap-2 text-sm mb-3">
            <span className="text-muted-foreground">Teacher:</span>
            <span className="font-medium">{teacherName}</span>
          </div>
          
          <div className="flex justify-between gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onViewQR(student)}>
              <QrCode className="h-4 w-4 mr-1" />
              QR Code
            </Button>
            
            <Button variant="outline" size="sm" className="flex-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200" onClick={() => onEdit(student)}>
              <PenSquare className="h-4 w-4 mr-1" />
              Edit
            </Button>
            
            <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => onDelete(student)}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
