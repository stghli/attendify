
import React, { useState } from "react";
import { useStudents } from "@/context/students/StudentsContext";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import StudentFormFields from "./StudentFormFields";
import { studentFormSchema, type StudentFormValues } from "./StudentFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const AddStudentDialog = () => {
  const [open, setOpen] = useState(false);
  const { addStudent } = useStudents();
  const { teachers } = useData();

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      age: "",
      gender: "",
      parentPhone: "",
      address: "",
      class: "",
      assignedTeacherId: "",
    },
  });

  const onSubmit = async (data: StudentFormValues) => {
    try {
      // Convert age to number and prepare student data
      const studentData = {
        name: data.name,
        gender: data.gender,
        age: data.age, // Already converted by schema transform
        address: data.address,
        parentPhone: data.parentPhone,
        assignedTeacherId: data.assignedTeacherId,
        class: data.class,
        role: "student" as const,
      };
      
      await addStudent(studentData);
      toast.success("Student added successfully!");
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to add student");
      console.error("Error adding student:", error);
    }
  };

  // Get all unique classes from existing students
  const { students } = useStudents();
  const classes = Array.from(new Set(students.map(student => student.class).filter(Boolean)));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <StudentFormFields 
              control={form.control}
              teachers={teachers}
              classes={classes}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Student</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;
