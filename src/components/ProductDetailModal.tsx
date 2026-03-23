
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { MenuItem, CartItem } from '../types';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: MenuItem | null;
  cart: CartItem[];
  onAddToCart: (item: MenuItem, size: string, customName?: string) => void;
  onUpdateQuantity: (cartId: string, delta: number) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  onClose, 
  product 
}) => {
  if (!product) return null;

  return (
    <div className="w-full aspect-video relative shadow-2xl rounded-[2.5rem] overflow-hidden group border border-zinc-200/20">

      {/* Image Pleine sans aucune bordure top */}
      <div className="w-full h-full">
        <img 
          key={product.id}
          src={product.image} 
          alt={product.name}
          loading="eager"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800';
          }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay esthétique */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default ProductDetailModal;
