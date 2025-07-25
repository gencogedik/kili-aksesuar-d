"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

const CaseTypesPage = () => {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const selectedModel = searchParams.get("model"); // örn. iphone-11

  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Ürünler alınamadı:", error.message);
        return;
      }

      // Filtre burada, selectedModel geldikten sonra
      const filteredData = selectedModel
        ? data.filter(
            (product) =>
              Array.isArray(product.phoneModels) &&
              product.phoneModels.some(
                (m) => slugify(m ?? "") === selectedModel.toLowerCase()
              )
          )
        : data;

      setProducts(data);
      setFiltered(filteredData);
    };

    fetchProducts();
  }, [selectedModel]); // 🔁 Model değiştiğinde tekrar çalış

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
