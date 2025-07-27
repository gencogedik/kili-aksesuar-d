"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import { Slider } from "@/components/ui/slider";

// Slugify fonksiyonu URL uyumlu hale getirir
const slugify = (text: string) =>
  (text || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

// Sabit model listesi
const iPhoneModels = [
  "iPhone 11",
  "iPhone 11 Pro",
  "iPhone 11 Pro Max",
  "iPhone 12",
  "iPhone 12 Mini",
  "iPhone 12 Pro",
  "iPhone 12 Pro Max",
  "iPhone 13",
  "iPhone 13 Mini",
  "iPhone 13 Pro",
  "iPhone 13 Pro Max",
  "iPhone 14",
  "iPhone 14 Plus",
  "iPhone 14 Pro",
  "iPhone 14 Pro Max",
  "iPhone 15",
  "iPhone 15 Plus",
  "iPhone 15 Pro",
  "iPhone 15 Pro Max",
];

const CaseTypesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedModelSlug = searchParams.get("model")?.toLowerCase() ?? null;

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

      setProducts(data || []);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let data = [...products];

    if (selectedModelSlug) {
      data = data.filter((product) =>
        Array.isArray(product.phoneModels)
          ? product.phoneModels.some((model: string) =>
              slugify(model).includes(selectedModelSlug)
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
  }, [products, selectedModelSlug, selectedCaseType, priceRange]);

  const handleModelClick = (model: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (model) {
      params.set("model", slugify(model));
    } else {
      params.delete("model");
    }
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-metallic-800 mb-6 text-center">
          Kılıf Modelleri
        </h1>

        {/* ✅ Model filtreleri */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button
            onClick={() => handleModelClick(null)}
            className={`px-4 py-2 rounded ${
              !selectedModelSlug ? "bg-metallic-800 text-white" : "bg-white"
            }`}
          >
            Hepsi
          </button>
          {iPhoneModels.map((model) => {
            const slug = slugify(model);
            const isActive = slug.includes(selectedModelSlug || "");
            return (
              <button
                key={model}
                onClick={() => handleModelClick(model)}
                className={`px-4 py-2 rounded ${
                  isActive ? "bg-metallic-800 text-white" : "bg-white"
                }`}
              >
                {model}
              </button>
            );
          })}
        </div>

        {/* ✅ Seçili filtre açıklaması */}
        <p className="text-gray-600 text-sm mb-4 text-center">
          {selectedModelSlug
            ? `• ${iPhoneModels.find((m) =>
                slugify(m).includes(selectedModelSlug)
              )} modelleri için filtre uygulanıyor`
            : "• Tüm iPhone modelleri gösteriliyor"}
        </p>

        {/* ✅ Kılıf tipi filtreleri */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedCaseType(null)}
            className={`px-4 py-2 rounded ${
              !selectedCaseType ? "bg-metallic-800 text-white" : "bg-white"
            }`}
          >
            Tümü
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

        {/* ✅ Fiyat filtresi */}
        <div className="mb-8 max-w-md mx-auto">
          <p className="text-center mb-2">
            Fiyat Aralığı: {priceRange[0]}₺ - {priceRange[1]}₺
          </p>
          <Slider
            min={0}
            max={1000}
            step={10}
            defaultValue={[0, 1000]}
            onValueChange={(values) => setPriceRange([values[0], values[1]])}
          />
        </div>

        {/* ✅ Ürün listesi */}
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
