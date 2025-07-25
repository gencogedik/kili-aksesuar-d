"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import supabase from "@/lib/supabaseClient";

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  phoneModel: string;
  caseType: string;
  rating: number;
}

export default function CaseTypesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const selectedModel = searchParams.get("model");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        console.error("Ürünleri getirirken hata oluştu:", error.message);
      } else {
        const filtered = selectedModel
          ? data.filter(
              (p) =>
                p.phoneModel.toLowerCase().replace(/\s+/g, "-") ===
                selectedModel.toLowerCase()
            )
          : data;

        setProducts(filtered as Product[]);
      }

      setLoading(false);
    };

    fetchProducts();
  }, [selectedModel]);

  return (
    <div className="p-4">
      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
