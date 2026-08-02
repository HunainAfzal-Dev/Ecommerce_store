import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
    >
      {/* Image */}
      <div className="aspect-square bg-gray-200 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-4xl">👕</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 truncate mt-1">
          {product.categories?.name || 'Clothing'}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-indigo-600">
            Rs. {product.price.toLocaleString()}
          </span>
          {product.stock_quantity <= 0 ? (
            <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
              Out of Stock
            </span>
          ) : (
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
              In Stock
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

