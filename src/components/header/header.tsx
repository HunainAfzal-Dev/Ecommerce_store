import { useState } from "react";
import banner1 from '../../assets/banners/11244.jpg';
import banner2 from '../../assets/banners/11309.jpg';
import banner3 from '../../assets/banners/11361.jpg';

const images = [
    banner1,
    banner2,
    banner3,
    ];

const HeroCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <section className="relative w-full  overflow-hidden">
            {/* Images */}
            <div className="w-full h-full flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {images.map((src, index) => (
                    <img key={index} src={src} alt={`Slide ${index}`} className="w-full h-full object-cover" />
                ))}
            </div>

            {/* Buttons */}
            <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 text-white"
                onClick={prevSlide}
            >
                ❮
            </button>
            <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 text-white"
                onClick={nextSlide}
            >
                ❯
            </button>

            {/* Dots */}
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-white" : "bg-gray-500"}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroCarousel;
