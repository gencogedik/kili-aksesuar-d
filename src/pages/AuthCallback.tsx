// src/pages/AuthCallback.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      // Supabase oturumu tamamlasın
      const { error } = await supabase.auth.getSession();
      if (error) {
        console.error("Giriş hatası:", error.message);
        navigate("/login"); // giriş başarısızsa login sayfasına
      } else {
        navigate("/"); // başarıyla giriş yaptıysa anasayfaya
      }
    };

    handleRedirect();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Giriş yapılıyor, lütfen bekleyin...</p>
    </div>
  );
};

export default AuthCallback;
