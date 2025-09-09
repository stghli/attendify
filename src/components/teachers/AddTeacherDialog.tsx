
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
import { useAddTeacher } from "@/hooks/useTeachers";
import { useClasses } from "@/hooks/useClasses";
import { useAuth } from "@/context/AuthContext";
import { teacherFormSchema, TeacherFormValues } from "./TeacherFormSchema";
import TeacherFormFields from "./TeacherFormFields";
import { toast } from "sonner";

interface AddTeacherDialogProps {
  trigger?: React.ReactNode;
}

const AddTeacherDialog: React.FC<AddTeacherDialogProps> = ({ trigger }) => {
  const addTeacher = useAddTeacher();
  const { data: classes = [] } = useClasses();
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);
  
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
  
  const onSubmit = async (values: TeacherFormValues) => {
    if (!user) {
      toast.error("You must be logged in to add a teacher");
      return;
    }

    try {
      const teacherData = {
        user_id: user.id,
        name: values.name,
        email: values.email,
        gender: values.gender,
        contact: values.contact,
        assigned_class: values.assignedClass,
        qr_code: `teacher-${user.id}-${Date.now()}-qr`,
      };
      
      await addTeacher.mutateAsync(teacherData);
      
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error adding teacher:", error);
    }
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
              classes={classes.map(c => c.name)}
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
