// src/pages/Auth.tsx

import React from "react";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://shufflecase.com/auth/callback",
      },
    });

    if (error) {
      console.error("Google ile giriş hatası:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Giriş Yap</h1>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md text-lg font-semibold transition duration-300"
        >
          Google ile Devam Et
        </button>
      </div>
    </div>
  );
};

export default Auth;
