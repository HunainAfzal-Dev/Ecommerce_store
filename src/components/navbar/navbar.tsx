import React, { useState, useEffect, useRef } from 'react';

// Define types for our component
interface AnnouncementItem {
    id: number;
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
                <div className="bg-black/90 text-white overflow-hidden py-3">
                    <div className="announcement-container max-w-screen-lg mx-auto relative">
                        <div className="announcement-ticker flex" ref={announcementRef}>
                            {announcements.map((item) => (
                                <div key={item.id} className="announcement-item whitespace-nowrap px-8">
                                    {item.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main navigation */}
                <nav
                    className={`border-gray-200 bg-black/80 w-full rounded-b-2xl mx-auto max-w-screen-lg
                    transition-all duration-300 ease-in-out transform
                    ${isSticky ? 'fixed top-0 left-0 right-0 shadow-md z-50' : ''}
                    ${!isNavVisible && isSticky ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}
                >
                    <div className="bg-white/20 flex flex-wrap justify-between items-center mx-auto max-w-screen-lg px-4 md:px-6 lg:px-7 py-4 md:py-6">
                        <a href="#" className="flex items-center">
                            <span className="self-center text-xl font-semibold whitespace-nowrap text-black">Store</span>
                        </a>

                        {/* Mobile menu button */}
                        <button
                            type="button"
                            className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200"
                            onClick={toggleMobileMenu}
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                            </svg>
                        </button>

                        {/* Desktop menu */}
                        <div
                            className={`
                                transition-all duration-300 ease-in-out 
                                ${isMobileMenuOpen ? 'block max-h-96' : 'max-h-0 lg:max-h-96'} 
                                w-full lg:block lg:w-auto overflow-hidden
                            `}
                            id="mobile-menu"
                        >
                            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                                <li>
                                    <a href="#" className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded lg:bg-transparent lg:text-blue-700 lg:p-0 transition-colors duration-200" aria-current="page">Home</a>
                                </li>
                                <li>
                                    <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700 transition-colors duration-200">Company</a>
                                </li>
                                <li>
                                    <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700 transition-colors duration-200">Marketplace</a>
                                </li>
                                <li>
                                    <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700 transition-colors duration-200">Features</a>
                                </li>
                                <li>
                                    <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700 transition-colors duration-200">Team</a>
                                </li>
                                <li>
                                    <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent transition-colors duration-200">Contact</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
};

export default Navbar;