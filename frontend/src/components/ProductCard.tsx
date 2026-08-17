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
      className="group block bg-white rounded-none border border-stone-200/80 hover:border-stone-400 transition-all duration-300 overflow-hidden"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] bg-[#f5f4f0] overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400">
            <svg className="w-12 h-12 stroke-[1.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-[10px] tracking-widest uppercase mt-2 font-medium">Garment</span>
          </div>
        )}

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isOutOfStock ? (
            <span className="bg-stone-900/90 text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-1 rounded-sm backdrop-blur-xs">
              Sold Out
            </span>
          ) : product.stock_quantity <= 3 ? (
            <span className="bg-stone-100 text-stone-800 text-[10px] font-semibold tracking-wider uppercase px-2 py-1 border border-stone-300 rounded-sm">
              Low Stock ({product.stock_quantity})
            </span>
          ) : null}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 space-y-1 bg-white">
        <p className="text-[11px] font-medium tracking-widest uppercase text-stone-500 truncate">
          {product.categories?.name || 'Collection'}
        </p>
        <h3 className="text-sm font-medium text-stone-900 group-hover:text-stone-600 transition-colors truncate">
          {product.name}
        </h3>
        <div className="pt-1 flex items-baseline justify-between">
          <p className="text-sm font-semibold text-stone-900 tracking-tight">
            Rs. {product.price.toLocaleString()}
          </p>
          <span className="text-xs text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all">
            View &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}


