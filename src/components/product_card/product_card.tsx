import React from 'react';

interface ProductFeature {
    icon: React.ReactNode;
    text: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    discount?: string;
    rating: number;
    reviewCount: number;
    imageLight: string;
    imageDark: string;
    features: ProductFeature[];
}

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
    onQuickView: (product: Product) => void;
    onAddToFavorites: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onAddToCart,
    onQuickView,
    onAddToFavorites
}) => {
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <svg
                key={index}
                className="h-3 w-3 text-yellow-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
            </svg>
        ));
    };

    return (
        <div className="rounded-lg border border-gray-400/45 p-2  md:p-4 shadow-sm">
            <div className="h-56 w-full">
                <a href="#" className=''>
                    <img className="mx-auto h-full dark:hidden " src={product.imageLight} alt={product.name} />
                    <img className="mx-auto hidden h-full dark:block object-fit-contain" src={product.imageDark} alt={product.name} />
                </a>
            </div>
            <div className="pt-2">
                <div className="mb-4 hidden md:flex items-center justify-between gap-4">
                    {product.discount && (
                        <span className="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                            {product.discount}
                        </span>
                    )}
                    <div className="flex items-center justify-end gap-1">
                        <button
                            type="button"
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            onClick={() => onQuickView(product)}
                        >
                            <span className="sr-only">Quick look</span>
                            <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                                <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            onClick={() => onAddToFavorites(product)}
                        >
                            <span className="sr-only">Add to Favorites</span>
                            <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <a href="#" className="text-md font-medium leading-tight text-gray-900 hover:underline ">
                    {product.name}
                </a>

                <div className="hidden mt-1 md:flex items-center gap-2">
                    <div className="flex items-center">
                        {renderStars(product.rating)}
                    </div>
                    <p className="text-[12px] font-medium text-gray-900 ">{product.rating.toFixed(1)}</p>
                    <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400">({product.reviewCount})</p>
                </div>

                <ul className="hidden mt-2 md:flex items-center gap-4">
                    {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                            {feature.icon}
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 ">{feature.text}</p>
                        </li>
                    ))}
                </ul>

                <div className="mt-4 flex items-center justify-between gap-6">
                    <div>
                        <p className="text-sm md:text-xl  leading-tight text-gray-900">
                            ${product.price.toLocaleString()}
                        </p>
                        {product.originalPrice && (
                            <p className="text-[12px] md:text-sm text-gray-500 line-through dark:text-gray-400">
                                ${product.originalPrice.toLocaleString()}
                            </p>
                        )}
                    </div>
                    <div className='flex '>
                        <button
                            type="button"
                            className="hidden md:inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium   hover:text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            onClick={() => onAddToCart(product)}
                        >
                            <svg className="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
                            </svg>
                            Add to cart
                        </button>
                        <div className='md:hidden flex '>
                            <button
                                type="button"
                                className="rounded-lg p-2 text-black hover:bg-gray-100 hover:text-gray-900 dark:hover:text-white"
                                onClick={() => onQuickView(product)}
                            >
                                <span className="sr-only">Quick look</span>
                                <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                                    <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>

                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium  hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                onClick={() => onAddToCart(product)}
                            >
                                <svg className="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;