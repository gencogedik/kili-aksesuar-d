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
  phoneModels: string[]; // güncellendi
  caseType: string;
  rating: number;
}

export default function CaseTypesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const selectedModel = searchParams.get("model");

  // string'i slug haline getir (örneğin "iPhone 11" → "iphone-11")
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        console.error("Ürün verisi alınamadı:", error.message);
        setProducts([]);
      } else {
        const filtered = selectedModel
          ? data.filter((product) =>
              Array.isArray(product.phoneModels) &&
              product.phoneModels.some(
                (m) => slugify(m) === selectedModel.toLowerCase()
              )
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
