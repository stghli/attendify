
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useTeachers } from "@/context/teachers/TeachersContext";
import { teacherFormSchema, TeacherFormValues } from "./TeacherFormSchema";
import TeacherFormFields from "./TeacherFormFields";
import { useStudents } from "@/context/students/StudentsContext";

interface AddTeacherDialogProps {
  trigger?: React.ReactNode;
}

const AddTeacherDialog: React.FC<AddTeacherDialogProps> = ({ trigger }) => {
  const { addTeacher } = useTeachers();
  const { getAllClasses } = useStudents();
  const [open, setOpen] = React.useState(false);
  
  const classes = getAllClasses();
  
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      name: "",
      gender: "",
      email: "",
      contact: "",
      assignedClass: "",
    },
  });
  
  const onSubmit = (values: TeacherFormValues) => {
    const teacherData = {
      name: values.name,
      email: values.email,
      role: "teacher" as const,
      gender: values.gender,
      contact: values.contact,
      assignedClass: values.assignedClass,
      qrCode: `teacher-${Date.now()}-qr`,
      createdAt: new Date().toISOString(),
    };
    
    addTeacher(teacherData);
    
    form.reset();
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button className="bg-purple-600 hover:bg-purple-700">Add New Teacher</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
          <DialogDescription>
            Enter the teacher information to add them to the system.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <TeacherFormFields 
              control={form.control}
              classes={classes}
            />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Add Teacher</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeacherDialog;
