
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product-card';
import FilterSidebar from '@/components/products/filter-sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { getProductsQuery } from '@/services/products';
import { Skeleton } from '@/components/ui/skeleton';

type SortOption =
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc';

export interface Filters {
    category: string[];
    priceRange: [number, number];
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams.get('q') || '';
  
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [filters, setFilters] = useState<Filters>({
    category: [],
    priceRange: [0, 50000],
  });

  const firestore = useFirestore();
  const productsQuery = useMemoFirebase(() => getProductsQuery(firestore), [firestore]);
  const { data: products, isLoading } = useCollection<Product>(productsQuery);
  
  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);


  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products || [];

    // Apply search query
    if (searchQuery) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Apply category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter(p => filters.category.includes(p.category));
    }

    // Apply price range filter
    filtered = filtered.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    // Apply sorting
    switch (sortOption) {
      case 'price-asc':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'name-asc':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...filtered].sort((a, b) => b.name.localeCompare(a.name));
      case 'newest':
      default:
        // Assuming the default order is by newest, or you could add a date field
        return filtered;
    }
  }, [products, sortOption, filters, searchQuery]);

  return (
    <div className="bg-background pt-20">
      <div className="container mx-auto py-12 px-12 sm:px-24 lg:px-48">
        <h1 className="section-title mb-12 text-center">Our Collection</h1>
        <div className="flex flex-col gap-12 lg:flex-row">
          <FilterSidebar 
            filters={filters} 
            onFilterChange={setFilters} 
            allProducts={products || []}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {isLoading ? 'Loading...' : `Showing ${filteredAndSortedProducts.length} products`}
              </p>
              <Select
                onValueChange={(value: SortOption) => setSortOption(value)}
                defaultValue={sortOption}
              >
                <SelectTrigger className="w-[180px] bg-muted">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
              {isLoading && Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-80 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              ))}
              {!isLoading && filteredAndSortedProducts.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <p>No products found for your search query.</p>
                </div>
              )}
              {!isLoading && filteredAndSortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
