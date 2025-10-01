
import { z } from "zod";

export const teacherFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  phone: z.string().min(6, {
    message: "Phone number must be at least 6 characters."
  }).optional(),
  subject: z.string().optional(),
});

export type TeacherFormValues = z.infer<typeof teacherFormSchema>;
