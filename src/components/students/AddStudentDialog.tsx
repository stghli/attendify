
import React, { useState } from "react";
import { useStudents } from "@/context/students/StudentsContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StudentFormFields } from "./StudentFormFields";
import { studentFormSchema, type StudentFormValues } from "./StudentFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const AddStudentDialog = () => {
  const [open, setOpen] = useState(false);
  const { addStudent } = useStudents();

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      age: "",
      gender: "",
      contact: "",
      parentContact: "",
      address: "",
      class: "",
    },
  });

  const onSubmit = async (data: StudentFormValues) => {
    try {
      // Convert age string to number
      const studentData = {
        ...data,
        age: Number(data.age), // Convert string to number here
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
            <StudentFormFields form={form} />
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
