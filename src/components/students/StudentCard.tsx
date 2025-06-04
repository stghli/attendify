
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
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md border rounded-lg bg-white/80 backdrop-blur-sm group hover:bg-white/90">
      {/* Compact top gradient bar */}
      <div className="absolute h-1 w-full bg-gradient-to-r from-violet-500 to-blue-500"></div>
      
      <CardHeader className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="bg-violet-100 rounded-lg p-2 shadow-sm">
            <User className="h-4 w-4 text-violet-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-base truncate">{student.name}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>ID: {student.id.split('-')[1]}</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs px-1.5 py-0.5">
                {student.class}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 py-3 pt-1">
        {/* Compact info grid */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="h-3 w-3 text-violet-500" />
            <span>{student.age}y</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="h-3 w-3 text-blue-500" />
            <span className="truncate">{student.gender}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <Phone className="h-3 w-3 text-emerald-500" />
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="truncate cursor-help text-xs">
                  {student.parentPhone}
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto text-xs">
                <p>Parent: {student.parentPhone}</p>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
        
        {/* Compact teacher info */}
        <div className="border-t pt-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Teacher:</span>
            <span className="font-medium truncate">{teacherName}</span>
          </div>
        </div>
        
        {/* Compact action buttons */}
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="flex-1 h-7 text-xs px-2 border-blue-200 hover:bg-blue-50" onClick={() => onViewQR(student)}>
            <QrCode className="h-3 w-3" />
          </Button>
          
          <Button variant="outline" size="sm" className="flex-1 h-7 text-xs px-2 text-amber-600 hover:bg-amber-50 border-amber-200" onClick={() => onEdit(student)}>
            <PenSquare className="h-3 w-3" />
          </Button>
          
          <Button variant="outline" size="sm" className="flex-1 h-7 text-xs px-2 text-red-600 hover:bg-red-50 border-red-200" onClick={() => onDelete(student)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
