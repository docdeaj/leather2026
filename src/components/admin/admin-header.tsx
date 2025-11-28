'use client';

import { Bell, Menu, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AdminSidebar from './admin-sidebar';

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:justify-end">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <AdminSidebar isMobile={true} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Search</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Profile</span>
        </Button>
      </div>
    </header>
  );
}
