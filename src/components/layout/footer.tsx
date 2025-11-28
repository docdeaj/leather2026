
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-black py-16">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
                <div className="mb-8 md:mb-0 lg:col-span-2">
                    <Link href="/" className="inline-block">
                       <div className="relative h-20 w-20 hidden md:block">
                          <Image 
                            src="/icon.png" 
                            alt="Majestic Leather Logo" 
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="relative h-16 w-32 md:hidden">
                            <Image 
                                src="/icon-hor.png" 
                                alt="Majestic Leather Logo" 
                                fill
                                className="object-contain"
                            />
                        </div>
                    </Link>
                    <p className="max-w-sm text-gray-500 mt-4">Equipping the world's most passionate leather artisans with tools and materials of uncompromising quality.</p>
                </div>
                <div>
                    <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Shop</h4>
                    <ul className="space-y-3">
                        <li><Link href="/products" className="text-gray-500 transition-colors hover:text-white">All Products</Link></li>
                        <li><Link href="/leathers" className="text-gray-500 transition-colors hover:text-white">Leathers</Link></li>
                        <li><Link href="/applications" className="text-gray-500 transition-colors hover:text-white">Applications</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Support</h4>
                    <ul className="space-y-3">
                        <li><Link href="/contact" className="text-gray-500 transition-colors hover:text-white">Contact Us</Link></li>
                        <li><Link href="/faq" className="text-gray-500 transition-colors hover:text-white">FAQs</Link></li>
                        <li><Link href="/shipping" className="text-gray-500 transition-colors hover:text-white">Shipping & Returns</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Connect</h4>
                    <ul className="space-y-3">
                        <li><Link href="#" className="text-gray-500 transition-colors hover:text-white">Journal</Link></li>
                        <li><Link href="#" className="text-gray-500 transition-colors hover:text-white">Instagram</Link></li>
                        <li><Link href="#" className="text-gray-500 transition-colors hover:text-white">Pinterest</Link></li>
                    </ul>
                </div>
            </div>
            <div className="mt-16 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row">
                <p className="mb-4 text-center text-sm text-gray-600 md:mb-0 md:text-left">&copy; {new Date().getFullYear()} M Leather Hub. All Rights Reserved.</p>
                <div className="flex space-x-4">
                     <p className="text-sm text-gray-600">Terms of Service</p>
                     <p className="text-sm text-gray-600">Privacy Policy</p>
                </div>
            </div>
        </div>
    </footer>
  );
}
