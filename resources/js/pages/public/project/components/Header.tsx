import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
    t: any;
    projectName: string;
    onInquire: () => void;
}

export function Header({ projectName, onInquire, t }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: t.overview, href: '#overview' },
        { name: t.amenities, href: '#amenities' },
        { name: t.availableUnits, href: '#units' },
        { name: t.location, href: '#location' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                isScrolled
                    ? 'py-4 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm'
                    : 'py-6 bg-transparent'
            }`}
        >
            <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
                <h1
                    className={`text-xl md:text-2xl font-light tracking-widest transition-colors duration-500 ${
                        isScrolled ? 'text-gray-900' : 'text-white'
                    }`}
                >
                    {projectName.toUpperCase()}
                </h1>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-10">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-light tracking-wider hover:text-amber-600 transition-colors duration-300 ${
                                isScrolled ? 'text-gray-700' : 'text-white/90'
                            }`}
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                <div className="hidden md:block">
                    <button
                        onClick={onInquire}
                        className={`px-6 py-2 border font-light text-sm tracking-wider transition-all duration-300 ${
                            isScrolled
                                ? 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                                : 'border-white text-white hover:bg-white hover:text-gray-900'
                        }`}
                    >
                        {t.inquire}
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`md:hidden p-2 transition-colors duration-300 ${
                        isScrolled ? 'text-gray-900' : 'text-white'
                    }`}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            <div
                className={`md:hidden absolute top-full left-0 w-full bg-white/98 backdrop-blur-lg border-b border-gray-200 transition-all duration-300 overflow-hidden ${
                    isMenuOpen ? 'max-h-96' : 'max-h-0'
                }`}
            >
                <nav className="flex flex-col p-6 space-y-4">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-gray-700 font-light tracking-wide hover:text-amber-600 transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                    <button
                        onClick={() => {
                            onInquire();
                            setIsMenuOpen(false);
                        }}
                        className="w-full border border-gray-900 text-gray-900 py-3 font-light tracking-wider hover:bg-gray-900 hover:text-white transition-all"
                    >
                        {t.inquire}
                    </button>
                </nav>
            </div>
        </header>
    );
}
