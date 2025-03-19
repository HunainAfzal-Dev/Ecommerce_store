import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner1 from '../../assets/categories/27th-feb-25-rtw-bottoms.jpg'
import banner2 from '../../assets/categories/27th-feb-25-rtw-dupatta.jpg'
import banner3 from '../../assets/categories/27th-feb-25-rtw-shirts.jpg'
import banner4 from '../../assets/categories/6th-march-25-thumbnail-EID-I.jpg'
import banner5 from '../../assets/categories/6th-march-25-thumbnail-matching-separates.jpg'

const categories = [
    { id: 1, name: "Solids", imgSrc: banner1 },
    { id: 2, name: "Embroidered", imgSrc: banner2 },
    { id: 3, name: "Printed", imgSrc: banner3 },
    { id: 4, name: "Style Staples", imgSrc: banner4 },
    { id: 5, name: "Luxury", imgSrc: banner5 },
];

const CategoryCarousel: React.FC = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 6, // Adjust as needed
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 3 },
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 2 },
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 1 },
            },
        ],
    };

    return (
        <div className="mx-auto max-w-screen-lg">
            <div>
                <h1 className="text-4xl font-bold mb-5">Our Categories</h1>
            </div>
            <Slider {...settings}>
                {categories.map((category) => (
                    <div key={category.id} className="p-2">
                        <div className="flex flex-col items-center">
                            <img
                                src={category.imgSrc}
                                alt={category.name}
                                className="rounded-full object-cover w-32 h-32 border-[4px] border-[#647a679f]"
                            />
                            <p className="text-center mt-2 font-semibold">{category.name}</p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default CategoryCarousel;
