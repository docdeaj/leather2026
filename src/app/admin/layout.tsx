
'use client';

import AdminSidebar from '@/components/admin/admin-sidebar';
import AdminHeader from '@/components/admin/admin-header';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { TriangleAlert } from 'lucide-react';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useMemoFirebase } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { User } from '@/lib/types';
import React from 'react';


function AdminAccessDenied() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-muted/30">
            <div className='flex flex-col items-center justify-center p-12 rounded-lg bg-background/50 border-2 border-destructive/50'>
                <TriangleAlert className="h-16 w-16 text-destructive mb-4" />
                <h1 className="text-3xl font-bold text-white mb-2">Permission Denied</h1>
                <p className="text-muted-foreground">You do not have the required permissions to access this page.</p>
            </div>
        </div>
    )
}

function AdminLayoutSkeleton() {
    return (
        <div className="flex min-h-screen bg-muted/30">
             <div className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-border bg-muted/40 md:flex">
                <div className='p-4 space-y-4'>
                    <Skeleton className='h-10 w-40' />
                     <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                        {[...Array(10)].map((_,i) => <Skeleton key={i} className='h-9 w-full' />)}
                    </div>
                </div>
             </div>
            <div className="flex flex-1 flex-col pl-0 md:pl-72">
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:justify-end">
                    <Skeleton className='h-9 w-24' />
                </header>
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <Skeleton className='h-96 w-full' />
                </main>
            </div>
        </div>
    )
}

function AdminContent({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    
    const userDetailsRef = useMemoFirebase(
        () => (user ? doc(firestore, 'users', user.uid) : null),
        [user, firestore]
    );
    const { data: userDetails, isLoading: isUserDetailsLoading } = useDoc<User>(userDetailsRef);
  
    const isLoading = isUserLoading || isUserDetailsLoading;
  
    if (isLoading) {
        return <AdminLayoutSkeleton />;
    }
  
    const authorizedRoles: (User['role'])[] = ['Admin', 'Manager', 'Accountant', 'Cashier'];
  
    if (!userDetails || !authorizedRoles.includes(userDetails.role)) {
      return <AdminAccessDenied />;
    }

    // Pass authorization status to children
    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { isAuthorized: true } as any);
        }
        return child;
    });

    return (
        <div className="flex min-h-screen bg-muted/30">
            <AdminSidebar />
            <div className="flex flex-1 flex-col pl-0 md:pl-72">
                <AdminHeader />
                <main className="flex-1 p-4 sm:p-6 lg:p-8">{childrenWithProps}</main>
            </div>
        </div>
    )
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminContent>{children}</AdminContent>;
}
