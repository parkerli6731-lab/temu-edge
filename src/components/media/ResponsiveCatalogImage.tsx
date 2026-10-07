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
  const version = 'v=20261007';
  const isGallery = baseName.includes('-detail') || baseName.includes('-package');
  const srcSet = isGallery
    ? `/images/catalog/${baseName}-640w.webp?${version} 640w`
    : `
        /images/catalog/${baseName}-384w.webp?${version} 384w,
        /images/catalog/${baseName}-640w.webp?${version} 640w
      `;

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      <img
        src={`/images/catalog/${baseName}-640w.webp?${version}`}
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
