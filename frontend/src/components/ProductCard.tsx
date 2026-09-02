import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { toggleWishlist, isInWishlist } from './FloatingWidgets';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

// Semantic Category Color Helper
export function getCategoryTheme(categoryName?: string, index: number = 0) {
  const name = categoryName?.toLowerCase() || '';

  if (name.includes('outerwear') || name.includes('jacket') || name.includes('coat')) {
    return {
      bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200',
      dot: 'bg-blue-600', hoverText: 'group-hover:text-blue-700', badge: 'Outerwear Atelier'
    };
  }
  if (name.includes('kurta') || name.includes('tunic') || name.includes('shirt')) {
    return {
      bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200',
      dot: 'bg-purple-600', hoverText: 'group-hover:text-purple-700', badge: 'Atelier Tailored'
    };
  }
  if (name.includes('trouser') || name.includes('pant') || name.includes('denim')) {
    return {
      bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200',
      dot: 'bg-amber-600', hoverText: 'group-hover:text-amber-800', badge: 'Natural Fiber'
    };
  }
  if (name.includes('festive') || name.includes('silk') || name.includes('shawl')) {
    return {
      bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200',
      dot: 'bg-rose-600', hoverText: 'group-hover:text-rose-700', badge: 'Handcrafted Weave'
    };
  }

  const fallbacks = [
    { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', dot: 'bg-teal-600', hoverText: 'group-hover:text-teal-700', badge: 'Pure Cotton' },
    { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-600', hoverText: 'group-hover:text-emerald-700', badge: 'French Flax Linen' }
  ];
  return fallbacks[index % fallbacks.length];
}

const sampleSizes = ['S', 'M', 'L', 'XL'];
const sampleColors = ['#1c1917', '#9c5b3c', '#1e3a8a', '#475569'];

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 3;
  const theme = getCategoryTheme(product.categories?.name, index);
  const [activeColor, setActiveColor] = useState(0);
  const [wishlisted, setWishlisted] = useState(() => isInWishlist(String(product.id)));

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleWishlist({
      id: String(product.id),
      name: product.name,
      image_url: product.image_url || '',
      price: product.price,
    });
    setWishlisted(newState);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="group relative flex flex-col justify-between bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
    >
      {/* Product Image Section */}
      <Link
        to={`/product/${product.id}`}
        className="relative aspect-[4/5] bg-[#f7f5f1] overflow-hidden block"
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-600 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
            <svg className="w-12 h-12 stroke-[1.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-[10px] tracking-wider uppercase mt-1 font-semibold text-stone-400">
              Garments Atelier
            </span>
          </div>
        )}

        {/* Floating Semantic Category Tag */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <motion.span
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: (index % 3) * 0.5 }}
            className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider ${theme.text} ${theme.bg} px-2.5 py-1 rounded-md border ${theme.border} shadow-2xs backdrop-blur-xs`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`}></span>
            {product.categories?.name || 'Garment'}
          </motion.span>
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs ${
            wishlisted
              ? 'bg-rose-500 text-white scale-100'
              : 'bg-white/90 backdrop-blur-md text-stone-500 hover:text-rose-500 opacity-0 group-hover:opacity-100'
          }`}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Floating Craft Quality Badge */}
        <div className="absolute bottom-11 right-2.5 z-10 hidden sm:block">
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur-md text-stone-700 px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs">
            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
            <span>Export Grade</span>
          </span>
        </div>

        {/* Size chips on hover */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-stone-200/90 shadow-xs">
          <span className="text-[9px] uppercase font-bold text-stone-500 pl-1">Sizes:</span>
          <div className="flex items-center space-x-1">
            {sampleSizes.map((s) => (
              <span key={s} className="text-[9px] font-extrabold text-stone-800 bg-stone-100 px-1.5 py-0.5 rounded">
                {s}
              </span>
            ))}
          </div>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          {/* Color swatch dots */}
          <div className="flex items-center space-x-1.5 pb-0.5">
            {sampleColors.map((color, cIdx) => (
              <button
                key={color}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveColor(cIdx);
                }}
                style={{ backgroundColor: color }}
                className={`w-2.5 h-2.5 rounded-full transition-transform ${
                  activeColor === cIdx ? 'ring-2 ring-stone-900 ring-offset-1 scale-110' : 'hover:scale-110'
                }`}
                title="Color option"
              />
            ))}
          </div>

          <Link to={`/product/${product.id}`} className="block">
            <h3 className={`font-bold text-xs sm:text-sm text-stone-900 ${theme.hoverText} transition-colors line-clamp-1 leading-snug`}>
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between gap-1">
          <span className="font-extrabold text-sm sm:text-base text-stone-950 tracking-tight">
            Rs. {product.price.toLocaleString()}
          </span>

          <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
            {isOutOfStock ? (
              <span className="text-[var(--color-danger)]">Sold Out</span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 text-[var(--color-warning)] font-extrabold">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)] animate-pulse"></span>
                Only {product.stock_quantity} Left
              </span>
            ) : (
              <span className="text-[var(--color-success)] font-semibold">In Stock</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
