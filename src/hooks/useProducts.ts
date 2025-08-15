import { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";

export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*");
      if (error) {
        setProducts([]);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return { products, loading };
}

// ...existing code...
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
