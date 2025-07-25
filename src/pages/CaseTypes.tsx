"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header"; // ✅ Geri eklendi
import { Slider } from "@/components/ui/slider"; // Örnek fiyat filtresi için varsayım

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
  const selectedModel = searchParams.get("model");

  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [selectedCaseType, setSelectedCaseType] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        console.error("Ürünleri alma hatası:", error.message);
        return;
      }

      setProducts(data);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let data = [...products];

    if (selectedModel) {
      data = data.filter((product) =>
        Array.isArray(product.phoneModels)
          ? product.phoneModels.some(
              (model) => slugify(model) === selectedModel.toLowerCase()
            )
          : false
      );
    }

    if (selectedCaseType) {
      data = data.filter((product) => product.caseType === selectedCaseType);
    }

    if (priceRange) {
      data = data.filter(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1]
      );
    }

    setFiltered(data);
  }, [products, selectedModel, selectedCaseType, priceRange]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header /> {/* ✅ Üstteki navigasyon */}
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-metallic-800 mb-6 text-center">
          Kılıf Modelleri
        </h1>

        {/* ✅ Filtreler */}
        <div className="flex flex-wrap items-center gap-4 mb-8 justify-center">
          <button
            onClick={() => setSelectedCaseType(null)}
            className={`px-4 py-2 rounded ${
              !selectedCaseType ? "bg-metallic-800 text-white" : "bg-white"
            }`}
          >
            Hepsi
          </button>
          <button
            onClick={() => setSelectedCaseType("Şeffaf")}
            className={`px-4 py-2 rounded ${
              selectedCaseType === "Şeffaf" ? "bg-metallic-800 text-white" : "bg-white"
            }`}
          >
            Şeffaf
          </button>
          <button
            onClick={() => setSelectedCaseType("Desenli")}
            className={`px-4 py-2 rounded ${
              selectedCaseType === "Desenli" ? "bg-metallic-800 text-white" : "bg-white"
            }`}
          >
            Desenli
          </button>
        </div>

        {/* ✅ Fiyat Aralığı Slider (örnek) */}
        <div className="mb-8 max-w-md mx-auto">
          <p className="text-center mb-2">Fiyat Aralığı: {priceRange[0]}₺ - {priceRange[1]}₺</p>
          <Slider
            min={0}
            max={1000}
            step={10}
            defaultValue={[0, 1000]}
            onValueChange={(values) => setPriceRange([values[0], values[1]])}
          />
        </div>

        {/* ✅ Ürünler */}
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
