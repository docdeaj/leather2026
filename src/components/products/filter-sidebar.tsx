
'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Filter, Search } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { useMemo } from 'react';
import type { Product } from '@/lib/types';
import type { Filters } from '@/app/products/page';


interface FilterSidebarProps {
    filters: Filters;
    onFilterChange: (filters: Filters) => void;
    allProducts: Product[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export default function FilterSidebar({ filters, onFilterChange, allProducts, searchQuery, onSearchChange }: FilterSidebarProps) {
  const categories = useMemo(() => {
    if (!allProducts) return [];
    return [...new Set(allProducts.map(p => p.category).filter(Boolean))];
  }, [allProducts]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    onFilterChange({
        ...filters,
        category: checked
            ? [...filters.category, category]
            : filters.category.filter(c => c !== category),
    });
  };
  
  const handlePriceChange = (value: [number, number]) => {
    onFilterChange({ ...filters, priceRange: value });
  };

  const clearFilters = () => {
    onFilterChange({
        category: [],
        priceRange: [0, 50000]
    });
    onSearchChange('');
  };

  const SidebarContent = () => (
    <div className="space-y-6">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
            />
        </div>
      <Accordion type="multiple" defaultValue={['category', 'price']} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="text-base font-semibold uppercase tracking-wider text-foreground">
            Category
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {categories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${category}`}
                    checked={filters.category.includes(category)}
                    onCheckedChange={(checked) => handleCategoryChange(category, !!checked)}
                    className="border-muted-foreground"
                  />
                  <label
                    htmlFor={`cat-${category}`}
                    className="text-sm font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-semibold uppercase tracking-wider text-foreground">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
              <div className="pt-4">
                 <Slider 
                    value={filters.priceRange}
                    onValueChange={handlePriceChange}
                    max={50000} 
                    step={1000} 
                    className="w-full" 
                />
                 <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <span>LKR {filters.priceRange[0]}</span>
                      <span>LKR {filters.priceRange[1]}+</span>
                 </div>
              </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
       <Button className="w-full" variant="outline" onClick={clearFilters}>Clear Filters</Button>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Sheet */}
      <div className="mb-4 flex justify-end lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85%] max-w-sm bg-black/90 p-6 text-white backdrop-blur-sm">
             <h3 className="mb-6 text-lg font-semibold uppercase tracking-wider text-primary">Filter Products</h3>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden w-full max-w-xs flex-col space-y-6 lg:flex">
        <SidebarContent />
      </aside>
    </>
  );
}
