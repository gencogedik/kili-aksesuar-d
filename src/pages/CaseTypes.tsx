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

const simplifyModel = (model: string) => {
  // iPhone 15 Pro Max => Ip 15 Pro Max
  return model.replace("iPhone", "Ip");
};

const CaseTypesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedModelSlug = searchParams.get("model")?.toLowerCase() ?? null;

  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [selectedCaseType, setSelectedCaseType] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [allModels, setAllModels] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        console.error("Ürünleri alma hatası:", error.message);
        return;
      }

      setProducts(data || []);

      // Benzersiz modelleri çıkart
      const modelsSet = new Set<string>();
      data?.forEach((product) => {
        if (Array.isArray(product.phoneModels)) {
          product.phoneModels.forEach((model: string) => modelsSet.add(model));
        }
      });

      const sortedModels = Array.from(modelsSet).sort((a, b) =>
        a.localeCompare(b, "tr", { numeric: true })
      );
      setAllModels(sortedModels);
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

        {/* ✅ Dinamik model butonları */}
        <div className="flex flex-wrap items-center gap-4 mb-4 justify-center">
          <button
            onClick={() => handleModelClick(null)}
            className={`px-4 py-2 rounded ${
              !selectedModelSlug ? "bg-metallic-800 text-white" : "bg-white"
            }`}
          >
            Hepsi
          </button>
          {allModels.map((model) => {
            const isActive = selectedModelSlug
              ? slugify(model).includes(selectedModelSlug)
              : false;
            return (
              <button
                key={model}
                onClick={() => handleModelClick(model)}
                className={`px-4 py-2 rounded ${
                  isActive ? "bg-metallic-800 text-white" : "bg-white"
                }`}
              >
                {simplifyModel(model)}
              </button>
            );
          })}
        </div>

        <p className="text-gray-600 text-sm mb-4 text-center">
          {selectedModelSlug
            ? `• ${allModels.find((m) =>
                slugify(m).includes(selectedModelSlug)
              ) || "Filtre"} için filtre uygulanıyor`
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
              selectedCaseType === "Şeffaf"
                ? "bg-metallic-800 text-white"
                : "bg-white"
            }`}
          >
            Şeffaf
          </button>
          <button
            onClick={() => setSelectedCaseType("Desenli")}
            className={`px-4 py-2 rounded ${
              selectedCaseType === "Desenli"
                ? "bg-metallic-800 text-white"
                : "bg-white"
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
