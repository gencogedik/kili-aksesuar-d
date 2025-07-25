// src/pages/PrivacyPolicy.tsx

import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gizlilik Politikası</h1>

      <p className="mb-4">
        ShuffleCase olarak, kişisel verilerinizin gizliliği ve güvenliği bizim için büyük önem taşımaktadır. Bu gizlilik politikası, web sitemizi ziyaret ettiğinizde, bizimle iletişime geçtiğinizde veya alışveriş yaptığınızda bize sağladığınız bilgilerin nasıl toplandığını, kullanıldığını, saklandığını ve korunduğunu açıklamaktadır.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Toplanan Bilgiler</h2>
      <ul className="list-disc list-inside mb-4 text-gray-700">
        <li>Ad, soyad</li>
        <li>Telefon numarası</li>
        <li>E-posta adresi</li>
        <li>Adres bilgileri</li>
        <li>IP adresi ve cihaz bilgileri</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. Bilgileriniz Nasıl Kullanılır?</h2>
      <ul className="list-disc list-inside mb-4 text-gray-700">
        <li>Sipariş ve teslimat işlemleri için</li>
        <li>Müşteri desteği sunmak için</li>
        <li>İyileştirme ve analiz yapmak için</li>
        <li>Pazarlama ve bilgilendirme amaçlı (onaylıysa)</li>
        <li>Yasal yükümlülükleri yerine getirmek için</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Bilgi Paylaşımı</h2>
      <p className="mb-4">
        Bilgileriniz, yalnızca hizmetin sağlanması için gerekli iş ortaklarıyla (örneğin kargo, ödeme altyapısı) sınırlı olarak paylaşılır. Üçüncü şahıslarla izniniz olmadan paylaşılmaz.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Güvenlik</h2>
      <p className="mb-4">
        Verileriniz şifreli iletişim protokolleri (SSL/HTTPS) ile korunmakta, sunucularımızda güvenli şekilde saklanmaktadır.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Çerezler (Cookies)</h2>
      <p className="mb-4">
        Web sitemiz kullanıcı deneyimini geliştirmek için çerezlerden faydalanır. Tarayıcınızdan çerez ayarlarını kontrol edebilirsiniz.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">6. Haklarınız</h2>
      <ul className="list-disc list-inside mb-4 text-gray-700">
        <li>Verilerinize erişim talep etme</li>
        <li>Düzenleme ve silme hakkı</li>
        <li>İtiraz ve kısıtlama hakkı</li>
        <li>İzninizi geri çekme hakkı</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">7. İletişim</h2>
      <p className="mb-4">
        Gizlilikle ilgili her türlü soru için <strong>shufflekap@gmail.com</strong> veya <strong>gedikgenco@gmail.com</strong> adresine yazabilirsiniz.
      </p>

      <p className="text-gray-600 text-sm mt-4">
        Bu politika en son {new Date().toLocaleDateString("tr-TR")} tarihinde güncellenmiştir.
      </p>

      <hr className="my-8 border-gray-300" />

      <h1 className="text-3xl font-bold mb-6 mt-12">Kullanım Şartları (Terms of Service)</h1>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Hizmetin Kapsamı</h2>
      <p className="mb-4">
        ShuffleCase, telefon aksesuarları ve benzeri ürünlerin satışını gerçekleştiren bir e-ticaret sitesidir. Siteyi kullanan her ziyaretçi bu şartları kabul etmiş sayılır.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. Kullanıcı Sorumluluğu</h2>
      <p className="mb-4">
        Kullanıcı, verdiği tüm bilgilerin doğru olduğunu kabul eder. Hesap güvenliğinden kullanıcı sorumludur.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Sipariş ve Ödeme</h2>
      <p className="mb-4">
        Siparişler, ödemenin onaylanmasının ardından işleme alınır. Fiyatlar ve stok bilgileri haber verilmeden değiştirilebilir.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. İptal ve İade</h2>
      <p className="mb-4">
        Kullanıcı, ürün tesliminden itibaren 14 gün içinde iade hakkına sahiptir. Ayrıntılar için <Link to="/return-policy" className="text-blue-600 underline">İade Politikası</Link> sayfasını inceleyin.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Fikri Mülkiyet</h2>
      <p className="mb-4">
        ShuffleCase markası ve sitedeki tüm içerikler (tasarım, görseller, yazılar) ShuffleCase’e aittir. İzinsiz kullanılamaz.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">6. Uygunsuz Kullanım</h2>
      <p className="mb-4">
        Siteyi yasalara aykırı, zararlı ya da hizmeti bozacak şekilde kullanan kullanıcıların erişimi engellenebilir.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">7. Sorumluluk Reddi</h2>
      <p className="mb-4">
        Hizmetlerdeki gecikme, kesinti veya hatalardan doğrudan ya da dolaylı olarak sorumluluk kabul edilmez.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">8. Şartların Değişimi</h2>
      <p className="mb-4">
        ShuffleCase, bu kullanım şartlarını herhangi bir zamanda güncelleme hakkını saklı tutar. Değişiklikler yayınlandığı anda geçerli olur.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">9. Uygulanacak Hukuk</h2>
      <p className="mb-4">
        Bu sayfada yer alan şartlar Türkiye Cumhuriyeti yasalarına tabidir. Taraflar arasında doğabilecek ihtilaflarda Adana Mahkemeleri yetkilidir.
      </p>

      <p className="text-gray-500 text-sm mt-8">
        © {new Date().getFullYear()} ShuffleCase. Tüm hakları saklıdır.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
