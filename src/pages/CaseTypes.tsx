"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";

const slugify = (text: string) =>
  (text || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

const CaseTypesPage = () => {
  const [searchParams] = useSearchParams();
  const selectedModel = searchParams.get("model"); // Örn: iphone-11

  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        console.error("Ürünleri alma hatası:", error.message);
        return;
      }

      const filteredData = selectedModel
        ? data.filter((product) => {
            if (!Array.isArray(product.phoneModels)) return false;

            return product.phoneModels.some(
              (model) => slugify(model) === selectedModel.toLowerCase()
            );
          })
        : data;

      setFiltered(filteredData);
    };

    fetchProducts();
  }, [selectedModel]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-metallic-800 mb-10">
          Kılıf Modelleri
        </h1>
        {filtered.length === 0 ? (
          <p className="text-center text-gray-600">Uygun ürün bulunamadı.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseTypesPage;
