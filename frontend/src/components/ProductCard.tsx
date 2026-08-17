import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-white rounded-xl border border-stone-200/90 hover:border-stone-300/90 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
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
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)]"></span>
              Low Stock ({product.stock_quantity})
            </span>
          ) : null}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 space-y-1.5 bg-white">
        <p className="text-[11px] font-bold tracking-wider uppercase text-[var(--color-accent)] truncate">
          {product.categories?.name || 'Garments Collection'}
        </p>
        <h3 className="text-sm font-semibold text-stone-900 group-hover:text-[var(--color-accent)] transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="pt-1 flex items-baseline justify-between">
          <p className="text-sm font-extrabold text-stone-950 tracking-tight">
            Rs. {product.price.toLocaleString()}
          </p>
          <span className="text-xs font-bold text-stone-400 group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 transition-all">
            View &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
