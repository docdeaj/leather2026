
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, User, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useUser } from '@/firebase';
import { SearchDialog } from './search-dialog';
import { usePathname } from 'next/navigation';

const navLinks = [
    { href: '/products', label: 'Shop' },
    { href: '/leathers', label: 'Leathers' },
    { href: '/applications', label: 'Applications' },
    { href: '/about', label: 'About' },
];

export default function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useUser();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isMounted) {
    return (
        <>
            <header className={'fixed top-0 z-40 w-full transition-all duration-300 ease-in-out bg-transparent'}>
                <div className="container mx-auto flex h-24 items-center justify-end px-6 lg:px-8" />
            </header>
            <div className='fixed top-0 left-0 z-50 p-6' />
        </>
    );
  }

  return (
    <>
      {/* Standalone Sticky Logo */}
      <div className="fixed top-0 left-0 z-50 p-3 sm:p-6 transition-all duration-300 ease-in-out">
          <Link href="/" className="flex-shrink-0">
            {/* Desktop Logo */}
            <div className="relative h-28 w-28 hidden md:block">
              <Image
                src="/icon.png"
                alt="Majestic Leather Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            {/* Mobile Logo */}
            <div className="relative h-20 w-40 md:hidden">
              <Image
                src="/icon-hor.png"
                alt="Majestic Leather Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
      </div>

      {/* Navigation Header */}
      <header
        className={cn(
          'fixed top-0 z-40 w-full transition-all duration-300 ease-in-out',
           isScrolled ? 'bg-gradient-to-b from-black/90 via-black/70 to-transparent/10' : 'bg-transparent'
        )}
      >
        <div className="container mx-auto flex h-24 items-center justify-end px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-4 md:flex mr-2">
                 {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn("nav-link", pathname === link.href && "active")}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5 text-gray-400 hover:text-white" />
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link href={user ? '/account' : '/login'}>
                <User className="h-5 w-5 text-gray-400 hover:text-white" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5 text-gray-400 hover:text-white" />
              </Link>
            </Button>
             <Button asChild variant="ghost" size="icon">
              <Link href="/pos">
                <Monitor className="h-5 w-5 text-gray-400 hover:text-white" />
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
}
