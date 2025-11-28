
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    LineChart,
    Settings,
    Book,
    FileText,
    ClipboardList,
    Factory,
    Receipt,
    Landmark,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/suppliers', icon: Factory, label: 'Suppliers' },
    { href: '/admin/accounts', icon: Book, label: 'Chart of Accounts'},
    { href: '/admin/invoices', icon: FileText, label: 'Invoices' },
    { href: '/admin/purchase-orders', icon: ClipboardList, label: 'Purchase Orders' },
    { href: '/admin/expenses', icon: Receipt, label: 'Expenses' },
    { href: '/admin/cheques', icon: Landmark, label: 'Cheques' },
    { href: '/admin/analytics', icon: LineChart, label: 'Analytics' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminSidebar({ isMobile = false }: { isMobile?: boolean }) {
    const pathname = usePathname();

    const content = (
        <div className="flex h-full flex-col">
            <div className="flex h-36 items-center justify-center border-b border-primary/20 px-6">
                <Link href="/admin">
                    <Image
                        src="/icon.png"
                        alt="Majestic Leather Logo"
                        width={128}
                        height={128}
                        className="h-28 w-auto"
                    />
                </Link>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-6">
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <li key={item.label}>
                            <Link
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary',
                                    (pathname.startsWith(item.href) && item.href !== '/admin') || (pathname === item.href) ? 'bg-primary/10 text-primary' : ''
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
    
    if (isMobile) {
        return <div className="bg-muted/40">{content}</div>;
    }

    return (
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-border bg-muted/40 md:flex">
            {content}
        </aside>
    );
}
