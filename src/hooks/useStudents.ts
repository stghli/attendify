import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Student = {
  id: string;
  user_id?: string | null;
  name: string;
  age?: number | null;
  gender?: string | null;
  class_id?: string | null;
  address?: string | null;
  parent_phone: string;
  teacher_id?: string | null;
  qr_code?: string | null;
  created_at: string;
  updated_at: string;
};

export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Student[];
    },
  });
};

export const useAddStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (student: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('students')
        .insert([student])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student added successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to add student: ${error.message}`);
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Student> & { id: string }) => {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update student: ${error.message}`);
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete student: ${error.message}`);
    },
  });
};

export const useValidateStudentId = () => {
  return useMutation({
    mutationFn: async (qrCode: string) => {
      const { data, error } = await supabase
        .from('students')
        .select('id, name, qr_code')
        .eq('qr_code', qrCode)
        .maybeSingle();
      
      if (error) throw error;
      return data ? { id: data.id, name: data.name, student_id: data.qr_code || '' } : null;
    },
    onError: (error: any) => {
      toast.error(`Failed to validate student: ${error.message}`);
    },
  });
};