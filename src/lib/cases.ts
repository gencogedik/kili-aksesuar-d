import { Case, Item } from '@/types';

// ShuffleCase phone case products
const phoneCase: Item[] = [
  // Basic Cases
  {
    id: 'clear-basic',
    name: 'Şeffaf Temel Kılıf',
    price: 150,
    rarity: 'basic',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=500&fit=crop',
    collection: 'Temel Koleksiyon',
    compatibility: ['iPhone 14', 'iPhone 15']
  },
  {
    id: 'silicon-basic',
    name: 'Silikon Koruma Kılıfı',
    price: 180,
    rarity: 'basic',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=500&fit=crop',
    collection: 'Temel Koleksiyon',
    compatibility: ['iPhone 13', 'iPhone 14']
  },
  {
    id: 'rubber-grip',
    name: 'Kaydırmaz Tutma Kılıfı',
    price: 200,
    rarity: 'basic',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop',
    collection: 'Temel Koleksiyon',
    compatibility: ['iPhone 12', 'iPhone 13']
  },
  {
    id: 'basic-leather',
    name: 'Basit Deri Kılıf',
    price: 220,
    rarity: 'basic',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=500&fit=crop',
    collection: 'Temel Koleksiyon',
    compatibility: ['iPhone 15']
  },

  // Premium Cases
  {
    id: 'metallic-edge',
    name: 'Metalik Kenarlı Kılıf',
    price: 300,
    rarity: 'premium',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=500&fit=crop',
    collection: 'Premium Koleksiyon',
    compatibility: ['iPhone 14', 'iPhone 15']
  },
  {
    id: 'leather-premium',
    name: 'Premium Deri Kılıf',
    price: 350,
    rarity: 'premium',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=500&fit=crop',
    collection: 'Premium Koleksiyon',
    compatibility: ['iPhone 13', 'iPhone 14', 'iPhone 15']
  },
  {
    id: 'fabric-texture',
    name: 'Dokulu Kumaş Kılıf',
    price: 280,
    rarity: 'premium',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=500&fit=crop',
    collection: 'Premium Koleksiyon',
    compatibility: ['iPhone 12', 'iPhone 13']
  },

  // Elite Cases
  {
    id: 'carbon-fiber',
    name: 'Karbon Fiber Kılıf',
    price: 500,
    rarity: 'elite',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=500&fit=crop',
    collection: 'Elite Koleksiyon',
    compatibility: ['iPhone 15']
  },
  {
    id: 'geometric-pattern',
    name: 'Geometrik Desen Kılıfı',
    price: 420,
    rarity: 'elite',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop',
    collection: 'Elite Koleksiyon',
    compatibility: ['iPhone 14', 'iPhone 15']
  },
  {
    id: 'wood-grain',
    name: 'Ahşap Görünümlü Kılıf',
    price: 380,
    rarity: 'elite',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=500&fit=crop',
    collection: 'Elite Koleksiyon',
    compatibility: ['iPhone 13', 'iPhone 14']
  },

  // Legendary Cases
  {
    id: 'hero-design',
    name: 'Kahraman Tasarım Kılıfı',
    price: 650,
    rarity: 'legendary',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=500&fit=crop',
    collection: 'Özel Tasarım',
    compatibility: ['iPhone 14', 'iPhone 15']
  },
  {
    id: 'custom-art',
    name: 'Özel Sanat Kılıfı',
    price: 750,
    rarity: 'legendary',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=500&fit=crop',
    collection: 'Sanatçı Koleksiyonu',
    compatibility: ['iPhone 15']
  },

  // Exotic Cases
  {
    id: 'limited-edition',
    name: 'Sınırlı Üretim Kılıf',
    price: 900,
    rarity: 'exotic',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=500&fit=crop',
    collection: 'Sınırlı Seri',
    compatibility: ['iPhone 15']
  },
  {
    id: 'diamond-pattern',
    name: 'Elmas Desen Kılıfı',
    price: 1200,
    rarity: 'exotic',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=500&fit=crop',
    collection: 'Luxury Koleksiyon',
    compatibility: ['iPhone 15']
  }
];

// Cycle basic and premium items to increase drop chances
const generateMoreItems = (baseItems: Item[]): Item[] => {
  const result = [...baseItems];
  const basicItems = baseItems.filter(item => item.rarity === 'basic');
  const premiumItems = baseItems.filter(item => item.rarity === 'premium');
  
  // Add more basic items to increase drop chance (70%)
  for (let i = 0; i < 8; i++) {
    basicItems.forEach((item, index) => {
      result.push({
        ...item,
        id: `${item.id}-variant-${i}-${index}`,
        name: `${item.name} - ${i + 2}. Renk`
      });
    });
  }
  
  // Add more premium items (20%)
  for (let i = 0; i < 3; i++) {
    premiumItems.forEach((item, index) => {
      result.push({
        ...item,
        id: `${item.id}-variant-${i}-${index}`,
        name: `${item.name} - ${i + 2}. Varyant`
      });
    });
  }
  
  return result;
};

const allCases = generateMoreItems(phoneCase);

export const singleCase: Case = {
  id: 'shufflecase-mystery',
  name: 'ShuffleCase Sürpriz Kutusu',
  price: 25,
  image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&h=400&fit=crop',
  description: 'Premium telefon kılıfları ile dolu sürpriz kutusu. Hangi kılıfı kazanacaksın?',
  items: allCases
};
