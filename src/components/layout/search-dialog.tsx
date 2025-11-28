'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
      onOpenChange(false);
      setQuery('');
    }
  };
  
  // Focus the input when the dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        document.getElementById('public-search-input')?.focus();
      }, 100);
    }
  }, [open]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-background/80 backdrop-blur-md border-border">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Products
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                id="public-search-input"
                placeholder="e.g., Leather Wallet, Artisan Belt..."
                className="h-12 text-base"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
               <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                 <Search className="h-5 w-5" />
               </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
