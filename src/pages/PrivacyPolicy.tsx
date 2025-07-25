// src/pages/PrivacyPolicy.tsx

import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Gizlilik Politikası</h1>

      <p className="mb-4">
        ShuffleCase olarak, kişisel verilerinizin gizliliği ve güvenliği bizim için büyük önem taşımaktadır. Bu gizlilik politikası, web sitemizi ziyaret ettiğinizde, bizimle iletişime geçtiğinizde veya alışveriş yaptığınızda bize sağladığınız bilgilerin nasıl toplandığını, kullanıldığını, saklandığını ve korunduğunu açıklamaktadır.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Toplanan Bilgiler</h2>
      <p className="mb-4">
        Web sitemiz üzerinden gerçekleştirdiğiniz işlemler sırasında aşağıdaki kişisel bilgiler toplanabilir:
      </p>
      <ul className="list-disc list-inside mb-4 text-gray-700">
        <li>Ad, soyad</li>
        <li>Telefon numarası</li>
        <li>E-posta adresi</li>
        <li>Adres bilgileri (sipariş için)</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. Bilgileriniz Nasıl Kullanılır?</h2>
      <p className="mb-4">
        Topladığımız bilgiler aşağıdaki amaçlarla kullanılabilir:
      </p>
      <ul className="list-disc list-inside mb-4 text-gray-700">
        <li>Siparişlerinizi işlemek ve teslimat sağlamak</li>
        <li>Sorularınıza ve destek taleplerinize yanıt vermek</li>
        <li>Sitemizi ve hizmet kalitemizi geliştirmek</li>
        <li>Kampanya, promosyon ve duyuruları iletmek (izin vermeniz durumunda)</li>
        <li>Dolandırıcılık önleme ve yasal yükümlülükleri yerine getirme</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Bilgi Paylaşımı</h2>
      <p className="mb-4">
        Kişisel bilgileriniz, yasal zorunluluklar dışında hiçbir koşulda üçüncü şahıslarla paylaşılmaz. Ödeme hizmetleri, kargo firmaları gibi iş ortaklarımızla yalnızca hizmeti sağlamak amacıyla gerekli minimum veriler paylaşılır.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Güvenlik</h2>
      <p className="mb-4">
        Verilerinizin güvenliği için teknik ve idari önlemler almaktayız. Web sitemiz HTTPS protokolüyle korunmaktadır ve verileriniz güvenli sunucularda saklanır.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Çerez (Cookie) Kullanımı</h2>
      <p className="mb-4">
        Kullanıcı deneyimini geliştirmek için çerezler kullanılmaktadır. Çerezler, web tarayıcınız üzerinden cihazınıza geçici olarak kaydedilen küçük veri parçalarıdır. Tarayıcı ayarlarınızdan çerezleri reddedebilir veya silebilirsiniz.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">6. Haklarınız</h2>
      <p className="mb-4">
        6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili yasal düzenlemeler kapsamında:
      </p>
      <ul className="list-disc list-inside mb-4 text-gray-700">
        <li>Hangi verilerin toplandığını öğrenme</li>
        <li>Yanlış veya eksik verilerin düzeltilmesini talep etme</li>
        <li>Verilerin silinmesini ya da yok edilmesini isteme</li>
        <li>Verilerinizin sadece amaca uygun kullanılmasını talep etme</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">7. İletişim</h2>
      <p className="mb-4">
        Gizlilik politikamızla ilgili her türlü soru, görüş ve talepleriniz için bizimle <strong>shufflekap@gmail.com</strong> veya <strong>gedikgenco@gmail.com</strong> e-posta adresleri üzerinden iletişime geçebilirsiniz.
      </p>

      <p className="text-gray-600 text-sm mt-8">
        Bu gizlilik politikası {new Date().toLocaleDateString('tr-TR')} tarihinde güncellenmiştir. Gerektiğinde değişiklik yapılabilir ve güncel hali bu sayfada yayımlanır.
      </p>

      <p className="text-gray-500 text-sm mt-4">
        © {new Date().getFullYear()} ShuffleCase. Tüm hakları saklıdır.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
