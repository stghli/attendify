
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  QrCode, 
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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl border-none rounded-xl relative group">
      {/* Top gradient bar */}
      <div className="absolute h-1.5 w-full bg-gradient-to-r from-violet-500 to-blue-500"></div>
      
      {/* Hover effect gradient background */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ 
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(96, 165, 250, 0.03))',
          borderRadius: 'inherit'
        }}
      ></div>
      
      <CardHeader className="px-6 pt-6 pb-0 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-violet-100 rounded-full p-3 shadow-sm transform group-hover:scale-110 transition-transform duration-300">
              <User className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <h3 className="font-medium text-lg group-hover:translate-x-1 transition-transform duration-300">{student.name}</h3>
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
      
      <CardContent className="p-6 pt-4 relative z-10">
        <div className="grid grid-cols-2 gap-3 mb-4 mt-3">
          <div className="flex items-center gap-2 group-hover:translate-y-[-2px] transition-transform duration-200">
            <GraduationCap className="h-4 w-4 text-violet-500" />
            <span className="text-sm">{student.age} years</span>
          </div>
          <div className="flex items-center gap-2 group-hover:translate-y-[-2px] transition-transform duration-300 delay-75">
            <User className="h-4 w-4 text-blue-500" />
            <span className="text-sm">{student.gender}</span>
          </div>
          <div className="flex items-center gap-2 group-hover:translate-y-[-2px] transition-transform duration-300 delay-100">
            <Phone className="h-4 w-4 text-emerald-500" />
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="text-sm truncate cursor-help">
                  {student.parentPhone}
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto shadow-lg border-none bg-white/95 backdrop-blur-sm">
                <p>Parent Phone: {student.parentPhone}</p>
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="flex items-center gap-2 group-hover:translate-y-[-2px] transition-transform duration-300 delay-150">
            <MapPin className="h-4 w-4 text-amber-500" />
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="text-sm truncate cursor-help max-w-[100px]">
                  {student.address}
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto shadow-lg border-none bg-white/95 backdrop-blur-sm">
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
            <Button variant="outline" size="sm" className="flex-1 border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-300" onClick={() => onViewQR(student)}>
              <QrCode className="h-4 w-4 mr-1" />
              QR Code
            </Button>
            
            <Button variant="outline" size="sm" className="flex-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200 transition-colors duration-300" onClick={() => onEdit(student)}>
              <PenSquare className="h-4 w-4 mr-1" />
              Edit
            </Button>
            
            <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 transition-colors duration-300" onClick={() => onDelete(student)}>
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
