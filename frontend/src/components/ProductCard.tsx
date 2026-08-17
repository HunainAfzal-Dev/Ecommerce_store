import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const colorPalette = [
  { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500', hoverText: 'group-hover:text-blue-600' },
  { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', dot: 'bg-purple-500', hoverText: 'group-hover:text-purple-600' },
  { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500', hoverText: 'group-hover:text-amber-600' },
  { text: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200', dot: 'bg-teal-500', hoverText: 'group-hover:text-teal-600' },
  { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500', hoverText: 'group-hover:text-emerald-600' },
  { text: 'text-[#9c5b3c]', bg: 'bg-[#fcf6f3]', border: 'border-[#eddcd3]', dot: 'bg-[#9c5b3c]', hoverText: 'group-hover:text-[#9c5b3c]' }
];

export const getCategoryTheme = (name?: string, fallbackIndex = 0) => {
  if (!name) return colorPalette[fallbackIndex % colorPalette.length];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorPalette[Math.abs(hash) % colorPalette.length];
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const isOutOfStock = product.stock_quantity <= 0;
  const categoryTheme = getCategoryTheme(product.categories?.name, index);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-white rounded-xl border border-stone-200/90 hover:border-stone-300 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] bg-[#f7f5f1] overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100/70 text-stone-400">
            <svg className="w-10 h-10 stroke-[1.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-[10px] tracking-widest uppercase mt-2 font-medium text-stone-400">Garment</span>
          </div>
        )}

        {/* Status Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 bg-[var(--color-danger-bg)] text-[var(--color-danger)] border border-[var(--color-danger-border)] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md backdrop-blur-xs shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-danger)]"></span>
              Sold Out
            </span>
          ) : product.stock_quantity <= 3 ? (
            <span className="inline-flex items-center gap-1 bg-[var(--color-warning-bg)] text-[var(--color-warning)] border border-[var(--color-warning-border)] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)] animate-pulse"></span>
              Low Stock ({product.stock_quantity})
            </span>
          ) : null}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 space-y-2 bg-white">
        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase ${categoryTheme.text} ${categoryTheme.bg} border ${categoryTheme.border} px-2 py-0.5 rounded-md`}>
            <span className={`w-1.5 h-1.5 rounded-full ${categoryTheme.dot}`}></span>
            <span className="truncate max-w-[140px]">{product.categories?.name || 'Collection'}</span>
          </span>
        </div>

        <h3 className={`text-sm font-semibold text-stone-900 ${categoryTheme.hoverText} transition-colors line-clamp-1`}>
          {product.name}
        </h3>

        <div className="pt-1 flex items-baseline justify-between border-t border-stone-100">
          <p className="text-sm font-extrabold text-stone-950 tracking-tight">
            Rs. {product.price.toLocaleString()}
          </p>
          <span className={`text-xs font-bold text-stone-400 ${categoryTheme.hoverText} group-hover:translate-x-0.5 transition-all`}>
            View &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
