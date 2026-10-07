import React from 'react';

interface ResponsiveImageProps {
  baseName: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export const ResponsiveCatalogImage: React.FC<ResponsiveImageProps> = ({
  baseName,
  alt,
  className = '',
  priority = false,
}) => {
  const srcSet = `
    /images/optimized/${baseName}-384w.webp 384w,
    /images/optimized/${baseName}-640w.webp 640w,
    /images/optimized/${baseName}-1024w.webp 1024w
  `;

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      <img
        src={`/images/optimized/${baseName}-640w.webp`}
        srcSet={srcSet}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        // @ts-expect-error fetchpriority is standard in modern HTML
        fetchpriority={priority ? 'high' : 'auto'}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
};
