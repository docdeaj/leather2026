import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { ShoppingCart, Heart, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price).replace('LKR', 'LKR ');
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="group product-card">
      <Link href={`/products/${product.id}`}>
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="product-label label-sale">Sale</div>
        )}
        {isOutOfStock && (
          <div className="product-label label-out-of-stock">Out of Stock</div>
        )}
        
        <Image
          src={product.image || 'https://picsum.photos/seed/default/600/600'}
          alt={product.name}
          width={600}
          height={600}
          className={cn(
            'product-image', 
            isOutOfStock && 'filter grayscale'
          )}
        />
        
        <div className="product-actions">
          <button className="action-btn">
            <Heart />
            <span className="tooltip">Like</span>
          </button>
          <button className="action-btn">
            <ShoppingCart />
            <span className="tooltip">Add to Cart</span>
          </button>
          <button className="action-btn">
            <ArrowRight />
            <span className="tooltip">View Details</span>
          </button>
        </div>

        <div className="product-card-overlay">
          <h3 className="font-serif text-lg text-white product-title">{product.name}</h3>
          <p className="text-white">
            <span className="price-tag">
              {product.originalPrice && (
                <span className="text-gray-400 line-through mr-2">{formatPrice(product.originalPrice)}</span>
              )}
              {formatPrice(product.price)}
            </span>
          </p>
        </div>
      </Link>
    </div>
  );
}
