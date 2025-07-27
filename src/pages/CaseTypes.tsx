"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import { Slider } from "@/components/ui/slider";

const slugify = (text: string) =>
  (text || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

const iphoneModels = ["iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "iPhone 16"];

const CaseTypesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedModel = searchParams.get("model");

  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [selectedCaseType, setSelectedCaseType] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const navigate = useNavigate();

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

    if (selectedModel) {
      data = data.filter((product) =>
        Array.isArray(product.phoneModels)
          ? product.phoneModels.some(
              (model: string) => slugify(model) === selectedModel.toLowerCase()
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

        {/* ✅ iPhone model filtreleri */}
        <div className="flex flex-wrap items-center gap-4 mb-4 justify-center">
          <button
            onClick={() => handleModelClick(null)}
            className={`px-4 py-2 rounded ${
              !selectedModel ? "bg-metallic-800 text-white" : "bg-white"
            }`}
          >
            Hepsi
          </button>
          {iphoneModels.map((model) => (
            <button
              key={model}
              onClick={() => handleModelClick(model)}
              className={`px-4 py-2 rounded ${
                slugify(model) === selectedModel?.toLowerCase()
                  ? "bg-metallic-800 text-white"
                  : "bg-white"
              }`}
            >
              {model}
            </button>
          ))}
        </div>

        {/* ✅ Seçili model açıklama */}
        <p className="text-gray-600 text-sm mb-4 text-center">
          {selectedModel
            ? `• ${iphoneModels.find((m) => slugify(m) === selectedModel)?.toUpperCase()} modelleri için filtrelenmiş ürünler`
            : "• Tüm iPhone modelleri gösteriliyor"}
        </p>

        {/* ✅ Kılıf türü filtreleri */}
        <div className="flex flex-wrap items-center gap-4 mb-8 justify-center">
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
