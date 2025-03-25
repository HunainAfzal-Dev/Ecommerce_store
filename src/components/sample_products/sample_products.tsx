
import { BestPriceIcon, FastDeliveryIcon } from '../icons/icons';
import { Product } from '../product_card/product_card';
import product1 from '../../assets/product_images/T3PSLS25V317_999_1.jpeg'
import product2 from '../../assets/product_images/T3PSLS25V317_999_1.jpeg'
import product3 from '../../assets/product_images/T3PSLS25V317_999_1.jpeg'
import product4 from '../../assets/product_images/T3PSLS25V317_999_1.jpeg'

export const sampleProducts: Product[] = [
    {
        id: '1',
        name: 'Apple iMac 27", 1TB HDD, Retina 5K Display, M3 Max',
        description: 'High-performance desktop computer with stunning display',
        price: 1699,
        originalPrice: 1999,
        discount: 'Up to 35% off',
        rating: 5.0,
        reviewCount: 455,
        imageLight: product1,
        imageDark: product1,
        features: [
            { icon: <FastDeliveryIcon />, text: 'Fast Delivery' },
            { icon: <BestPriceIcon />, text: 'Best Price' }
        ]
    },
    {
        id: '2',
        name: 'MacBook Pro 16", 1TB SSD, M3 Pro Chip',
        description: 'Powerful laptop for professionals',
        price: 2399,
        originalPrice: 2599,
        discount: '15% off',
        rating: 4.9,
        reviewCount: 322,
        imageLight: product2,
        imageDark: product2,
        features: [
            { icon: <FastDeliveryIcon />, text: 'Fast Delivery' },
            { icon: <BestPriceIcon />, text: 'Best Price' }
        ]
    },
    {
        id: '3',
        name: 'iPad Pro 12.9", 256GB, M2 Chip, 1TB SSD',
        description: 'The ultimate iPad experience with M2 power',
        price: 1099,
        originalPrice: 1299,
        discount: '20% off',
        rating: 4.8,
        reviewCount: 211,
        imageLight: product3,                                    
        imageDark: product3,
        features: [
            { icon: <FastDeliveryIcon />, text: 'Fast Delivery' },
            { icon: <BestPriceIcon />, text: 'Best Price' }
        ]
    },
    {
        id: '4',
        name: 'iPhone 15 Pro Max, 1TB SSD, 512GB',
        description: 'Flagship smartphone with incredible performance',
        price: 1299,
        originalPrice: 1499,
        discount: '13% off',
        rating: 4.9,
        reviewCount: 610,
        imageLight: product4,
        imageDark: product4,
        features: [
            { icon: <FastDeliveryIcon />, text: 'Fast Delivery' },
            { icon: <BestPriceIcon />, text: 'Best Price' }
        ]
    },
    // {
    //     id: '5',
    //     name: 'Samsung Galaxy S24 Ultra, 512GB',
    //     description: 'The best Android flagship with cutting-edge features',
    //     price: 1199,
    //     originalPrice: 1399,
    //     discount: '14% off',
    //     rating: 4.7,
    //     reviewCount: 532,
    //     imageLight: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/samsung.svg',
    //     imageDark: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/samsung-dark.svg',
    //     features: [
    //         { icon: <FastDeliveryIcon />, text: 'Fast Delivery' },
    //         { icon: <BestPriceIcon />, text: 'Best Price' }
    //     ]
    // },
    // {
    //     id: '6',
    //     name: 'Sony WH-1000XM5 Wireless Headphones',
    //     description: 'Industry-leading noise-canceling headphones',
    //     price: 349,
    //     originalPrice: 399,
    //     discount: '12% off',
    //     rating: 4.8,
    //     reviewCount: 987,
    //     imageLight: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/headphones.svg',
    //     imageDark: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/headphones-dark.svg',
    //     features: [
    //         { icon: <FastDeliveryIcon />, text: 'Fast Delivery' },
    //         { icon: <BestPriceIcon />, text: 'Best Price' }
    //     ]
    // },
    // {
    //     id: '7',
    //     name: 'Apple Watch Series 9, 45mm',
    //     description: 'Advanced health-tracking smartwatch',
    //     price: 429,
    //     originalPrice: 499,
    //     discount: '14% off',
    //     rating: 4.7,
    //     reviewCount: 412,
    //     imageLight: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/watch.svg',
    //     imageDark: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/watch-dark.svg',
    //     features: [
    //         { icon: <FastDeliveryIcon />, text: 'Fast Delivery' },
    //         { icon: <BestPriceIcon />, text: 'Best Price' }
    //     ]
    // },
    // {
    //     id: '8',
    //     name: 'Dell XPS 17, 1TB SSD, Intel i9 13th Gen',
    //     description: 'High-performance laptop for creators and professionals',
    //     price: 2499,
    //     originalPrice: 2699,
    //     discount: '7% off',
    //     rating: 4.6,
    //     reviewCount: 189,
    //     imageLight: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/dell.svg',
    //     imageDark: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/dell-dark.svg',
    //     features: [
    //         { icon: <FastDeliveryIcon />, text: 'Fast Delivery' },
    //         { icon: <BestPriceIcon />, text: 'Best Price' }
    //     ]
    // },
    // {
    //     id: '9',
    //     name: 'Google Pixel 8 Pro, 512GB',
    //     description: 'Smart AI-powered Android smartphone',
    //     price: 999,
    //     originalPrice: 1199,
    //     discount: '16% off',
    //     rating: 4.8,
    //     reviewCount: 350,
    //     imageLight: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/pixel.svg',
    //     imageDark: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/pixel-dark.svg',
    //     features: [
    //         { icon: <FastDeliveryIcon />, text: 'Fast Delivery' },
    //         { icon: <BestPriceIcon />, text: 'Best Price' }
    //     ]
    // },
    // {
    //     id: '10',
    //     name: 'Bose SoundLink Revolve+ Bluetooth Speaker',
    //     description: 'Portable 360-degree wireless speaker with deep bass',
    //     price: 249,
    //     originalPrice: 299,
    //     discount: '17% off',
    //     rating: 4.9,
    //     reviewCount: 720,
    //     imageLight: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/speaker.svg',
    //     imageDark: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/speaker-dark.svg',
    //     features: [
    //         { icon: <FastDeliveryIcon />, text: 'Fast Delivery' },
    //         { icon: <BestPriceIcon />, text: 'Best Price' }
    //     ]
    // }
    // Add more products as needed
];