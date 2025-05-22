
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import StudentFormFields from "./StudentFormFields";
import { StudentFormValues, studentFormSchema } from "./StudentFormSchema";
import { useStudents } from "@/context/students/StudentsContext";
import { useData } from "@/context/DataContext";
import { toast } from "sonner";

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const AddStudentDialog: React.FC<AddStudentDialogProps> = ({ open, onOpenChange, trigger }) => {
  const { addStudent } = useStudents();
  const { teachers } = useData();
  const { getAllClasses } = useStudents();
  
  const classes = getAllClasses();
  
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      gender: "Male",
      age: 0,
      address: "",
      parentPhone: "",
      assignedTeacherId: "",
      class: "",
      role: "student",
    },
  });

  const onSubmit = (data: StudentFormValues) => {
    addStudent({
      ...data,
      age: Number(data.age),
      role: "student"
    });
    toast.success(`Student ${data.name} added successfully`);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Fill in the student details below to create a new student record.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
            <StudentFormFields 
              control={form.control} 
              teachers={teachers} 
              classes={classes}
            />
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
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
