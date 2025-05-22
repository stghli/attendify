
import { z } from "zod";

export const teacherFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  gender: z.string({
    required_error: "Please select a gender.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  contact: z.string().min(6, {
    message: "Contact number must be at least 6 characters."
  }),
  assignedClass: z.string({
    required_error: "Please select a class.",
  }),
});

export type TeacherFormValues = z.infer<typeof teacherFormSchema>;
