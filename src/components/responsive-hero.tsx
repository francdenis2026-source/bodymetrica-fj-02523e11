import React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveHeroProps {
  imageUrl: string;
  mobileImageUrl?: string;
  overlayOpacity?: number;
  className?: string;
  children?: React.ReactNode;
  height?: string;
}

export function ResponsiveHero({
  imageUrl,
  mobileImageUrl,
  overlayOpacity = 0.4,
  className,
  children,
  height = "h-[50vh] min-h-[400px]",
}: ResponsiveHeroProps) {
  return (
    <div className={cn("relative overflow-hidden w-full flex items-center justify-center", height, className)}>
      {/* Hero Image with Responsive Logic and Placeholders */}
      <picture>
        {mobileImageUrl && (
          <source
            media="(max-width: 640px)"
            srcSet={mobileImageUrl}
          />
        )}
        <img
          src={imageUrl}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
        />
      </picture>
      
      {/* Contrast Overlay for Readability */}
      <div 
        className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[1px]" 
        style={{ opacity: overlayOpacity }} 
      />
      
      {/* Decorative Brand Gradient Overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-background via-background/40 to-transparent" />
      
      {/* Content */}
      <div className="relative z-30 w-full h-full">
        {children}
      </div>
    </div>
  );
}
