import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useCases = () => {
  return useQuery({
    queryKey: ["cases"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cases").select("*");

      if (error) throw error;
      return data;
    },
  });
};
