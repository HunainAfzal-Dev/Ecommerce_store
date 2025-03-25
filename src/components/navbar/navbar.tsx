import React, { useState, useEffect, useRef } from 'react';
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

// Define types for our component
interface AnnouncementItem {
    id: number;
    text: string;
}
interface menuItem {
    path: string;
    text: string;
}


const Navbar: React.FC = () => {
    const [isSticky, setIsSticky] = useState<boolean>(false);
    const [lastScrollY, setLastScrollY] = useState<number>(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [isNavVisible, setIsNavVisible] = useState<boolean>(true);
    const announcementRef = useRef<HTMLDivElement | null>(null);
    const navbarRef = useRef<HTMLDivElement | null>(null);

    // Announcement messages for carousel
    const announcements: AnnouncementItem[] = [
        { id: 1, text: "Free shipping on orders over $50!" },
        { id: 2, text: "New summer collection available now!" },
        { id: 3, text: "Use code SAVE20 for 20% off your first order" },
        { id: 4, text: "Limited time offer: Buy one, get one 50% off" }
    ];
    const menuItems: menuItem[] = [
        { path: '/', text: "Home" },
        { path: '/shop', text: "Shop" },
        { path: '/sales', text: "Sales" },
    ];

    useEffect(() => {
        const handleScroll = (): void => {
            const currentScrollY: number = window.scrollY;

            // Make navbar sticky when scrolling down past the announcement bar
            if (currentScrollY > 50) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }

            // Hide navbar when scrolling down, show when scrolling up
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsNavVisible(false);
            } else {
                setIsNavVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    useEffect(() => {
        // Set up announcement carousel animation
        const announcementEl = announcementRef.current;
        if (announcementEl) {
            let position: number = 0;
            const speed: number = 0.5;

            const animateAnnouncement = (): void => {
                position -= speed;
                const firstChild = announcementEl.firstChild as HTMLElement;
                const childWidth: number = firstChild?.offsetWidth || 0;

                if (position < -childWidth && firstChild) {
                    // Move the first announcement to the end
                    announcementEl.appendChild(firstChild);
                    position = 0;
                }

                announcementEl.style.transform = `translateX(${position}px)`;
                requestAnimationFrame(animateAnnouncement);
            };

            const animationId: number = requestAnimationFrame(animateAnnouncement);

            return () => {
                cancelAnimationFrame(animationId);
            };
        }
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target as Node) && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = (): void => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <header className="relative" ref={navbarRef}>
                {/* Announcement bar with carousel effect */}
                <div className="bg-[#647A67] text-white overflow-hidden py-2">
                    <div className="announcement-container max-w-screen-lg mx-auto relative">
                        <div className="announcement-ticker flex" ref={announcementRef}>
                            {announcements.map((item) => (
                                <div key={item.id} className="announcement-item text-sm trans whitespace-nowrap px-8">
                                    {item.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main navigation */}
                <nav
                    className={`
                        ${isSticky ? "fixed top-0 z-50" : ""}
                        absolute z-10 border border-gray-400/45 bg-white  container mx-auto w-[95%]
                        transition-all duration-300 ease-in-out transform left-1/2 -translate-x-1/2 
                        ${!isNavVisible && isSticky ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}
                        flex justify-center items-center rounded-b-2xl
                      `}
                >
                    <div className=" flex flex-wrap justify-between items-center  px-4 md:px-6 lg:px-7 py-4 md:py-6 w-full">
                        {/* Logo - centered on mobile, left on desktop */}
                        <a href="#" className="flex md:justify-center items-center w-full lg:w-auto lg:justify-start">
                            <span className="self-center text-xl font-semibold whitespace-nowrap">Store</span>
                        </a>

                        {/* Mobile menu button - positioned absolutely */}
                        <button
                            type="button"
                            className="inline-flex items-center text-sm  rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none transition-colors duration-200 absolute right-4 top-4"
                            onClick={toggleMobileMenu}
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                            </svg>
                        </button>

                        {/* Desktop menu - centered */}
                        <div
                            className={`
                                transition-all duration-300 ease-in-out 
                                ${isMobileMenuOpen ? 'block max-h-96' : 'max-h-0 lg:max-h-96'} 
                                w-full lg:block lg:w-auto overflow-hidden text-center
                            `}
                            id="mobile-menu"
                        >
                            <ul className="flex items-center border-b border-gray-300 lg:border-0 mt-6 font-medium lg:space-x-8 lg:mt-0 justify-between">
                                <div className='flex items-center space-x-8'>
                                    {menuItems.map((item, index) => (
                                        <li>
                                            <a href={item.path} className="block py-3 lg:p-0 transition-colors duration-200">{item.text}</a>
                                        </li>
                                    ))}
                                </div>
                                <div className="flex space-x-4 md:hidden ">
                                    <span className="text-xl cursor-pointer  hover:text-gray-600">
                                        <FaShoppingCart />
                                    </span>
                                    <span className="text-xl cursor-pointer hover:text-gray-600">
                                        <FaUser />
                                    </span>
                                </div>
                            </ul>
                        </div>
                        <div className=" hidden md:block">
                            <div className='flex space-x-4'>

                                <span className=" text-xl cursor-pointer hover:text-gray-600">
                                    <FaShoppingCart />
                                </span>
                                <span className='text-xl cursor-pointer hover:text-gray-600'>
                                    <FaUser />
                                </span>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
};

export default Navbar;