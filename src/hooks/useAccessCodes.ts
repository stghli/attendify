import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AccessCode {
  id: string;
  code: string;
  description: string | null;
  is_active: boolean;
  max_uses: number | null;
  current_uses: number;
  expires_at: string | null;
  created_at: string;
}

export const useAccessCodes = () => {
  const { data: accessCodes, isLoading } = useQuery({
    queryKey: ["access-codes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("access_codes")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as AccessCode[];
    },
  });

  const validateCode = async (code: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc("validate_access_code", {
        input_code: code,
      });

      if (error) {
        console.error("Error validating code:", error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error("Error validating code:", error);
      return false;
    }
  };

  return {
    accessCodes,
    isLoading,
    validateCode,
  };
};
