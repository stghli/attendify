
import React, { useState } from "react";
import { useClasses } from "@/context/classes/ClassesContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Users, 
  GraduationCap, 
  BookOpen,
  PenSquare,
  Trash2,
  UserPlus
} from "lucide-react";
import { AddClassDialog } from "@/components/classes/AddClassDialog";
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
import { Class } from "@/types";

const ClassesPage: React.FC = () => {
  const { classes, deleteClass } = useClasses();
  const { students, teachers } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cls.description && cls.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getTeacherName = (teacherId?: string): string => {
    if (!teacherId) return "Unassigned";
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : "Unknown Teacher";
  };

  const getStudentCount = (studentIds: string[]): number => {
    return studentIds.length;
  };

  const handleDelete = (cls: Class) => {
    setClassToDelete(cls);
  };

  const confirmDelete = () => {
    if (classToDelete) {
      deleteClass(classToDelete.id);
      setClassToDelete(null);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-xl font-bold tracking-tight">Classes</h1>
        <p className="text-sm text-muted-foreground">
          Manage classes and assign teachers and students.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <AddClassDialog />
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{filteredClasses.length}</span> classes
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredClasses.map(cls => (
          <Card key={cls.id} className="overflow-hidden transition-all duration-200 hover:shadow-md border rounded-lg bg-white/80 backdrop-blur-sm group hover:bg-white/90">
            {/* Top gradient bar */}
            <div className="absolute h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            
            <CardHeader className="px-4 pt-4 pb-2">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 rounded-lg p-2 shadow-sm">
                  <BookOpen className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-base truncate">{cls.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>ID: {cls.id.split('-')[1]}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="px-4 py-3 pt-1">
              {/* Description */}
              {cls.description && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {cls.description}
                </p>
              )}

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="h-3 w-3 text-blue-500" />
                  <span className="truncate">{getTeacherName(cls.teacherId)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3 w-3 text-emerald-500" />
                  <span>{getStudentCount(cls.studentIds)} students</span>
                </div>
              </div>

              {/* Status badges */}
              <div className="flex gap-1 mb-3">
                <Badge 
                  variant={cls.teacherId ? "default" : "secondary"} 
                  className="text-xs px-2 py-0.5"
                >
                  {cls.teacherId ? "Assigned" : "No Teacher"}
                </Badge>
                <Badge 
                  variant={cls.studentIds.length > 0 ? "default" : "outline"} 
                  className="text-xs px-2 py-0.5"
                >
                  {cls.studentIds.length > 0 ? `${cls.studentIds.length} Students` : "Empty"}
                </Badge>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs px-2 border-indigo-200 hover:bg-indigo-50">
                  <UserPlus className="h-3 w-3" />
                </Button>
                
                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs px-2 text-amber-600 hover:bg-amber-50 border-amber-200">
                  <PenSquare className="h-3 w-3" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 h-7 text-xs px-2 text-red-600 hover:bg-red-50 border-red-200"
                  onClick={() => handleDelete(cls)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredClasses.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-muted/40 rounded-full p-3 mb-3">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-base font-medium">No classes found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchTerm ? "Try adjusting your search term" : "Create classes to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!classToDelete} onOpenChange={(open) => !open && setClassToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the class "{classToDelete?.name}".
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

export default ClassesPage;
