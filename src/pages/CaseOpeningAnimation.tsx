import { useState, useEffect } from 'react';
import { Item } from '@/types';
import { ItemDisplay } from './ItemDisplay';

interface CaseOpeningAnimationProps {
  items: Item[];
  winningItem: Item | null;
  isOpening: boolean;
  onComplete: () => void;
}

export const CaseOpeningAnimation = ({ 
  items, 
  winningItem, 
  isOpening, 
  onComplete 
}: CaseOpeningAnimationProps) => {
  const [animationItems, setAnimationItems] = useState<Item[]>([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (isOpening && items.length > 0) {
      // Create a sequence of random items for the animation
      const shuffledItems = [...items].sort(() => Math.random() - 0.5);
      const animSequence = [...shuffledItems.slice(0, 15)];
      
      if (winningItem) {
        // Place the winning item at the end of the sequence
        animSequence.push(winningItem);
      }
      
      setAnimationItems(animSequence);
      setShowResult(false);

      // Show result after animation completes
      const timer = setTimeout(() => {
        setShowResult(true);
        onComplete();
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [isOpening, winningItem, items, onComplete]);

  if (!isOpening && !showResult) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {isOpening && !showResult && (
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-lg border border-border/50 bg-secondary/20 backdrop-blur-sm">
            <div className="h-2 bg-gradient-opening animate-pulse" />
            
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Opening Case...</h3>
              <p className="text-muted-foreground">Good luck!</p>
            </div>
            
            {/* Item sliding animation */}
            <div className="relative h-48 overflow-hidden border-t border-border/50">
              <div className="absolute inset-0 flex items-center">
                <div className="flex gap-4 animate-slide-items" style={{
                  width: `${animationItems.length * 200}px`,
                }}>
                  {animationItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="w-44 flex-shrink-0">
                      <ItemDisplay item={item} revealed={true} className="h-full" />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Selection indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-32 bg-primary shadow-glow z-10" />
            </div>
          </div>
        </div>
      )}

      {showResult && winningItem && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-primary">
            Congratulations! 🎉
          </h2>
          <div className="max-w-sm mx-auto">
            <ItemDisplay item={winningItem} revealed={true} />
          </div>
        </div>
      )}
    </div>
  );
};
