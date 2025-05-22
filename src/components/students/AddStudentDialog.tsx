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
import { useStudents } from "@/context/students/StudentsContext";
import { studentFormSchema, StudentFormValues } from "./StudentFormSchema";
import StudentFormFields from "./StudentFormFields";

interface AddStudentDialogProps {
  trigger?: React.ReactNode;
}

const AddStudentDialog: React.FC<AddStudentDialogProps> = ({ trigger }) => {
  const { teachers } = useTeachers();
  const { addStudent, getAllClasses } = useStudents();
  const [open, setOpen] = React.useState(false);
  
  const classes = getAllClasses();
  
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      gender: "",
      age: "",
      address: "",
      parentPhone: "",
      assignedTeacherId: "",
      class: "",
    },
  });
  
  const onSubmit = (values: StudentFormValues) => {
    // Explicitly convert age to a number to satisfy TypeScript
    const studentData = {
      name: values.name,
      gender: values.gender,
      age: Number(values.age), // Ensure age is converted to a number
      address: values.address,
      parentPhone: values.parentPhone,
      assignedTeacherId: values.assignedTeacherId,
      role: "student" as const,
      class: values.class,
    };
    
    addStudent(studentData);
    
    form.reset();
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Add New Student</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Enter the student information to add them to the system.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <StudentFormFields 
              control={form.control}
              teachers={teachers}
              classes={classes}
            />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Student</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;
