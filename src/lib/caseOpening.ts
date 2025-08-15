import { Item, Rarity, RARITY_CHANCES } from '@/types';

export const getRandomItem = (items: Item[]): Item => {
  // Get a random number between 0 and 1
  const random = Math.random();
  
  // Create cumulative probability ranges
  let cumulativeProbability = 0;
  const rarityRanges: Array<{ min: number; max: number; rarity: Rarity }> = [];
  
  Object.entries(RARITY_CHANCES).forEach(([rarity, chance]) => {
    const min = cumulativeProbability;
    const max = cumulativeProbability + chance;
    rarityRanges.push({ min, max, rarity: rarity as Rarity });
    cumulativeProbability += chance;
  });
  
  // Find which rarity range the random number falls into
  const selectedRarity = rarityRanges.find(range => 
    random >= range.min && random < range.max
  )?.rarity || 'basic';
  
  // Filter items by the selected rarity
  const itemsOfRarity = items.filter(item => item.rarity === selectedRarity);
  
  // If no items of this rarity exist, fallback to basic grade
  if (itemsOfRarity.length === 0) {
    const basicItems = items.filter(item => item.rarity === 'basic');
    return basicItems[Math.floor(Math.random() * basicItems.length)] || items[0];
  }
  
  // Return a random item from the selected rarity
  return itemsOfRarity[Math.floor(Math.random() * itemsOfRarity.length)];
};

export const simulateCaseOpening = (items: Item[]): Promise<Item> => {
  return new Promise((resolve) => {
    // Simulate network delay for more realistic experience
    const delay = 1000 + Math.random() * 2000; // 1-3 seconds
    
    setTimeout(() => {
      const wonItem = getRandomItem(items);
      resolve(wonItem);
    }, delay);
  });
};
