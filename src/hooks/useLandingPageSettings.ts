import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LandingPageSettings {
  id: string;
  is_enabled: boolean;
  welcome_message: string | null;
  updated_at: string;
}

export const useLandingPageSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["landing-page-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landing_page_settings")
        .select("*")
        .limit(1)
        .single();

      if (error) throw error;
      return data as LandingPageSettings;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (updates: Partial<LandingPageSettings>) => {
      if (!settings) throw new Error("No settings found");

      const { data, error } = await supabase
        .from("landing_page_settings")
        .update(updates)
        .eq("id", settings.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landing-page-settings"] });
      toast.success("Settings updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update settings: " + error.message);
    },
  });

  return {
    settings,
    isLoading,
    updateSettings: updateSettings.mutate,
  };
};
