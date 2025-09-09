

import React, { useState } from "react";
import { useAddStudent, useStudents } from "@/hooks/useStudents";
import { useTeachers } from "@/hooks/useTeachers";
import { useClasses } from "@/hooks/useClasses";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import StudentFormFields from "./StudentFormFields";
import { studentFormSchema, type StudentFormValues, type StudentFormInput } from "./StudentFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const AddStudentDialog = () => {
  const [open, setOpen] = useState(false);
  const addStudent = useAddStudent();
  const { data: teachers = [] } = useTeachers();
  const { user } = useAuth();

  const form = useForm<StudentFormInput>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      age: "",  // String for form input, will be transformed to number
      gender: "",
      parentPhone: "",
      address: "",
      class: "",
      assignedTeacherId: "",
    },
  });

  const onSubmit = async (data: StudentFormInput) => {
    if (!user) {
      toast.error("You must be logged in to add a student");
      return;
    }

    try {
      // Parse and validate the data to get the transformed types
      const validatedData = studentFormSchema.parse(data);
      
      const studentData = {
        user_id: user.id,
        name: validatedData.name,
        gender: validatedData.gender,
        age: validatedData.age,
        address: validatedData.address,
        parent_phone: validatedData.parentPhone,
        class: validatedData.class,
        qr_code: `student-${user.id}-${Date.now()}-qr`,
      };
      
      await addStudent.mutateAsync(studentData);
      toast.success("Student added successfully!");
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to add student");
      console.error("Error adding student:", error);
    }
  };

  // Get classes from database
  const { data: classesData = [] } = useClasses();
  const classes = classesData.map(cls => cls.name);

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

