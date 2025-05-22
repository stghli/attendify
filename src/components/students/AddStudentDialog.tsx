
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
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import StudentFormFields from "./StudentFormFields";
import { StudentFormValues, studentFormSchema } from "./StudentFormSchema";
import { useStudents } from "@/context/students/StudentsContext";
import { toast } from "sonner";

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddStudentDialog: React.FC<AddStudentDialogProps> = ({ open, onOpenChange }) => {
  const { addStudent } = useStudents();
  
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
    },
  });

  const onSubmit = (data: StudentFormValues) => {
    addStudent({
      ...data,
      age: Number(data.age), // Convert age to number
    });
    toast.success(`Student ${data.name} added successfully`);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Fill in the student details below to create a new student record.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
            <StudentFormFields form={form} />
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
