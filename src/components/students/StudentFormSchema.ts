
import * as z from "zod";

export const studentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  gender: z.string().min(1, "Please select a gender"),
  age: z.string().min(1, "Age is required").transform((val) => Number(val)),
  address: z.string().min(5, "Address must be at least 5 characters"),
  parentPhone: z.string().min(10, "Phone number must be at least 10 characters"),
  assignedTeacherId: z.string().min(1, "Please select a teacher"),
  class: z.string().min(1, "Please select a class"),
});

// Input type (before transform) - for form defaultValues
export type StudentFormInput = z.input<typeof studentFormSchema>;
// Output type (after transform) - for form submission
export type StudentFormValues = z.infer<typeof studentFormSchema>;
