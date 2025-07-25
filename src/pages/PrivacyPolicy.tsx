// src/pages/PrivacyPolicy.tsx

import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Gizlilik Politikası</h1>
      <p className="mb-4">
        Bu web sitesi kullanıcı bilgilerini gizli tutmayı taahhüt eder. Kişisel bilgileriniz hiçbir şekilde üçüncü şahıslarla paylaşılmaz...
      </p>
      <p className="text-gray-600 text-sm">© {new Date().getFullYear()} ShuffleCase</p>
    </div>
  );
};

export default PrivacyPolicy;
