import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type AttendanceLog = {
  id: string;
  student_id: string;
  student_name: string;
  check_in_time: string;
  status: string;
  notes?: string;
  scanned_by?: string | null;
  created_at: string;
};

const morningScriptures = [
  { text: "The LORD is my shepherd; I shall not want.", reference: "Psalm 23:1" },
  { text: "This is the day the LORD has made; let us rejoice and be glad in it.", reference: "Psalm 118:24" },
  { text: "Trust in the LORD with all your heart and lean not on your own understanding.", reference: "Proverbs 3:5" },
];

const eveningScriptures = [
  { text: "The LORD will watch over your coming and going both now and forevermore.", reference: "Psalm 121:8" },
  { text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.", reference: "Joshua 1:9" },
  { text: "May the LORD bless you and keep you.", reference: "Numbers 6:24" },
];

export const useAttendanceLogs = () => {
  return useQuery({
    queryKey: ['attendance-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_logs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AttendanceLog[];
    },
  });
};

export const useRecordAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ studentId, studentName, notes }: {
      studentId: string;
      studentName: string;
      notes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('attendance_logs')
        .insert([{
          student_id: studentId,
          student_name: studentName,
          status: 'present',
          notes: notes || '',
          scanned_by: user?.id || null,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attendance-logs'] });
      
      // Get random scripture and greeting
      const scriptures = morningScriptures;
      const randomScripture = scriptures[Math.floor(Math.random() * scriptures.length)];
      
      const currentHour = new Date().getHours();
      const isLate = currentHour > 8;
      
      const greeting = getGreeting(variables.studentName, true, isLate);
      
      toast.success(greeting, {
        description: `"${randomScripture.text}" - ${randomScripture.reference}`,
        duration: 5000,
      });
    },
    onError: (error: any) => {
      toast.error(`Failed to record attendance: ${error.message}`);
    },
  });
};

const getGreeting = (name: string, isCheckin: boolean, isLate?: boolean): string => {
  const firstName = name.split(' ')[0];
  
  if (isCheckin) {
    if (isLate) {
      return `Better late than never, ${firstName}! Welcome to school.`;
    }
    return `Good morning, ${firstName}! Have a blessed day at school.`;
  } else {
    if (isLate) {
      return `Have a wonderful evening, ${firstName}! See you tomorrow.`;
    }
    return `Great day at school, ${firstName}! Get home safely.`;
  }
};

export const getTimeStatus = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Check-in allowed from 6:00 AM to 10:00 AM
  const canCheckIn = (currentHour >= 6 && currentHour < 10) || (currentHour === 10 && currentMinute === 0);
  
  // Check-out allowed from 2:00 PM to 6:00 PM
  const canCheckOut = (currentHour >= 14 && currentHour < 18) || (currentHour === 18 && currentMinute === 0);
  
  // Late if after 8:00 AM for check-in or before 3:00 PM for check-out
  const isLateCheckIn = currentHour > 8 || (currentHour === 8 && currentMinute > 0);
  const isEarlyCheckOut = currentHour < 15;
  
  return {
    canCheckIn,
    canCheckOut,
    isLateCheckIn,
    isEarlyCheckOut,
    suggestedAction: (canCheckIn ? 'time-in' : canCheckOut ? 'time-out' : null) as 'time-in' | 'time-out' | null,
  };
};