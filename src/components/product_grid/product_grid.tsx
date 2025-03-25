import React from 'react';
import ProductCard, { Product } from '../product_card/product_card';

export interface ProductGridProps {
    products: Product[];
    columns?: 1 | 2 | 3 | 4 | 5 | 6;
    onAddToCart: (product: Product) => void;
    onQuickView: (product: Product) => void;
    onAddToFavorites: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    columns = 4,
    onAddToCart,
    onQuickView,
    onAddToFavorites
}) => {
    // Define grid columns based on the prop
    const gridColsClass = {
        1: 'grid-cols-1',
        2: 'sm:grid-cols-2',
        3: 'lg:grid-cols-3',
        4: 'xl:grid-cols-4',
        5: 'xl:grid-cols-5',
        6: 'xl:grid-cols-6'
    };

    return (
        <>
            <h1 className="mb-6 text-2xl font-bold">Featured Products</h1>
            <div className={`mb-4 grid gap-2 md:gap-4 grid-cols-2 sm:grid-cols-2 md:mb-8  ${columns >= 3 ? gridColsClass[3] : ''} ${columns >= 4 ? gridColsClass[4] : ''} ${columns >= 5 ? gridColsClass[5] : ''} ${columns >= 6 ? gridColsClass[6] : ''}`}>
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={onAddToCart}
                        onQuickView={onQuickView}
                        onAddToFavorites={onAddToFavorites}
                    />
                ))}
            </div>
        </>
    );
};

export default ProductGrid;