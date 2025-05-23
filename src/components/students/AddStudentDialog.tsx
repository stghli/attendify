
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useData } from "@/context/DataContext";
import {
  studentFormSchema,
  StudentFormValues,
} from "./StudentFormSchema";
import StudentFormFields from "./StudentFormFields";
import { toast } from "sonner";

interface AddStudentDialogProps {
  trigger: React.ReactNode;
}

const AddStudentDialog: React.FC<AddStudentDialogProps> = ({ trigger }) => {
  const { addStudent, teachers } = useData();
  const [open, setOpen] = React.useState(false);

  // Extract all unique class names from existing students
  const { students } = useData();
  const classes = Array.from(new Set(students.map(student => student.class)));

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      gender: "",
      age: "", // This is a string in the form, but will be transformed to number
      address: "",
      parentPhone: "",
      assignedTeacherId: "",
      class: "",
    },
  });

  const onSubmit = (values: StudentFormValues) => {
    // Convert age to number and add required Student fields
    const studentData = {
      name: values.name,
      gender: values.gender,
      age: Number(values.age), // Explicit conversion of age to number
      address: values.address,
      parentPhone: values.parentPhone,
      assignedTeacherId: values.assignedTeacherId,
      class: values.class,
      role: "student" as const,
    };

    addStudent(studentData);
    toast.success(`Student ${values.name} added successfully`);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
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
              teachers={teachers.map((teacher) => ({ id: teacher.id, name: teacher.name }))}
              classes={classes.length > 0 ? classes : ["Class 1", "Class 2", "Class 3"]}
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
