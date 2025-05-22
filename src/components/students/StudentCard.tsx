
import React from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
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
  Users,
  CalendarDays
} from "lucide-react";
import { Student } from "@/types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group relative border-none bg-white shadow-md">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-blue-500"></div>
      
      <CardHeader className="p-5 pb-0 flex flex-row items-start gap-3">
        <Avatar className="h-14 w-14 border-2 border-primary/20">
          <AvatarImage src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${student.name}`} alt={student.name} />
          <AvatarFallback className="bg-gradient-to-br from-primary/30 to-blue-500/30 text-primary font-medium">
            {getInitials(student.name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {student.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>ID: {student.id.substring(0, 8)}</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 px-2">
              {student.class}
            </Badge>
          </div>
        </div>
        
        <Badge className="bg-primary/10 text-primary border-primary/20">Student</Badge>
      </CardHeader>
      
      <CardContent className="p-5 pt-4">
        <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
          <div className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg">
            <div className="bg-primary/10 rounded-full p-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-sm">{student.age} years</span>
          </div>
          
          <div className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg">
            <div className="bg-primary/10 rounded-full p-1.5">
              <User className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-sm">{student.gender}</span>
          </div>
          
          <div className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg">
            <div className="bg-primary/10 rounded-full p-1.5">
              <Phone className="h-3.5 w-3.5 text-primary" />
            </div>
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="text-sm truncate cursor-help max-w-[100px]">
                  {student.parentPhone}
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto">
                <p>Parent Phone: {student.parentPhone}</p>
              </HoverCardContent>
            </HoverCard>
          </div>
          
          <div className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg">
            <div className="bg-primary/10 rounded-full p-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
            </div>
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
        
        <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg mb-4">
          <div className="bg-blue-100 rounded-full p-1.5">
            <Users className="h-3.5 w-3.5 text-blue-600" />
          </div>
          <span className="text-sm text-blue-700">Teacher: <span className="font-medium">{teacherName}</span></span>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 bg-slate-50 gap-2 flex-wrap">
        <Button variant="outline" size="sm" className="flex-1 bg-white hover:bg-primary/5" onClick={() => onViewQR(student)}>
          <QrCode className="h-4 w-4 mr-1.5" />
          QR Code
        </Button>
        
        <Button variant="outline" size="sm" className="flex-1 bg-white text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200" onClick={() => onEdit(student)}>
          <PenSquare className="h-4 w-4 mr-1.5" />
          Edit
        </Button>
        
        <Button variant="outline" size="sm" className="flex-1 bg-white text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => onDelete(student)}>
          <Trash2 className="h-4 w-4 mr-1.5" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudentCard;
