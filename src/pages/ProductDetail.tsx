import React from 'react';

import { Link } from 'react-router-dom';

import { Star, ShoppingCart } from 'lucide-react';

import { useCart } from '@/contexts/CartContext';



interface Product {

id: string;

name: string;

price: number;

image?: string;

phoneModel: string;

caseType: string;

rating: number;

stock_quantity: number; // ✅ stok alanı

}



// Türkçe karakterleri sadeleştiren ve dosya adına dönüştüren yardımcı fonksiyon

const normalizeFileName = (name: string): string => {

return name

.toLowerCase()

.replace(/ç/g, 'c')

.replace(/ğ/g, 'g')

.replace(/ı/g, 'i')

.replace(/ö/g, 'o')

.replace(/ş/g, 's')

.replace(/ü/g, 'u')

.replace(/\s+/g, '-')

.replace(/[^\w\-]/g, '');

};



// Görsel yolu çözümleyici

const getImagePath = (product: Product): string => {

if (product.image?.startsWith('http')) {

return product.image;

}

return `/images/${normalizeFileName(product.name)}.jpg`;

};



const ProductCard: React.FC<{ product: Product }> = ({ product }) => {

const { dispatch } = useCart();



// ✅ TEST LOG'LARI

console.log("🧪 Ürün adı:", product.name);

console.log("📦 Stok (ham):", product.stock_quantity);

console.log("🔢 Stok (Number):", Number(product.stock_quantity));



const handleAddToCart = (e: React.MouseEvent) => {

e.preventDefault();

dispatch({

type: 'ADD_ITEM',

payload: {

id: product.id,

name: product.name,

price: product.price,

image: getImagePath(product),

phoneModel: product.phoneModel,

caseType: product.caseType,

},

});

};



const imageFile = getImagePath(product);



return (

<div className="product-card relative group">

<Link to={`/product/${product.id}`}>

<div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">

<img

src={imageFile}

alt={product.name}

className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"

/>

<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

</div>

<div className="p-6">

<div className="flex items-center mb-2">

{[...Array(5)].map((_, i) => (

<Star

key={i}

className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}

/>

))}

<span className="text-sm text-gray-600 ml-2">({product.rating})</span>

</div>

<h3 className="text-xl font-semibold mb-1 text-metallic-800 group-hover:text-metallic-600 transition-colors">

{product.name}

</h3>

<p className="text-gray-600 text-sm mb-1">{product.phoneModel} • {product.caseType}</p>



{/* ✅ STOK GÖRÜNÜMÜ */}

{Number(product.stock_quantity) > 0 ? (

<p className="text-sm text-green-600 mb-2">✅ Stokta {product.stock_quantity} adet var</p>

) : (

<p className="text-sm text-red-500 mb-2">❌ Stokta kalmadı</p>

)}



<div className="flex items-center justify-between">

<span className="text-2xl font-bold text-metallic-800">{product.price}₺</span>

<button

onClick={handleAddToCart}

className="metallic-button text-white px-4 py-2 rounded-lg text-sm font-medium hover:transform hover:scale-105 transition-all duration-300 flex items-center gap-2"

disabled={Number(product.stock_quantity) === 0}

>

<ShoppingCart className="w-4 h-4" />

Sepete Ekle

</button>

</div>

</div>

</Link>

</div>

);

};



export default ProductCard;

