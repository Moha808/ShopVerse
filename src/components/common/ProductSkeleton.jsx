import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-surface-100 overflow-hidden h-full">
      {/* Image Area */}
      <div className="aspect-square skeleton rounded-none border-b border-surface-100" />
      
      {/* Details Area */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4 gap-2">
        {/* Category badge */}
        <div className="skeleton w-16 h-3 rounded-md mb-1" />
        
        {/* Title */}
        <div className="space-y-1.5 mb-auto">
          <div className="skeleton w-full h-4 rounded-md" />
          <div className="skeleton w-2/3 h-4 rounded-md" />
        </div>
        
        {/* Rating */}
        <div className="skeleton w-24 h-3 rounded-md mt-2" />
        
        {/* Price & Cart Button Area */}
        <div className="flex items-center justify-between gap-2 mt-2.5">
          <div className="space-y-1">
            <div className="skeleton w-16 h-5 rounded-md" />
            <div className="skeleton w-12 h-3 rounded-md" />
          </div>
          <div className="skeleton w-9 h-9 rounded-xl shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
