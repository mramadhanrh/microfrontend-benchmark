interface ImageCarouselProps {
  images: string[];
  disableCarousel?: boolean;
}

const ImageList = ({ images }: Omit<ImageCarouselProps, 'disableCarousel'>) => {
  return (
    <>
      {images.map((src, index) => (
        <div key={index} className="relative h-[100px] cursor-pointer group">
          <img src={src} alt="img" className="h-full w-full object-cover" />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            style={{
              background:
                'radial-gradient(ellipse, transparent 0%, rgba(0, 0, 0, 0.5) 100%)',
            }}
          >
            <span className="text-white text-xl font-bold opacity-0 scale-150 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
              Image {index + 1}
            </span>
          </div>
        </div>
      ))}
    </>
  );
};

export const Carousel = ({
  images,
  disableCarousel = false,
}: ImageCarouselProps) => {
  // Static mode - no carousel
  if (!disableCarousel) return <ImageList images={images} />;

  // Carousel mode
  return (
    <div className="col-span-3 relative h-[100px] overflow-hidden">
      <div
        className="flex h-full gap-4"
        style={{
          animation: 'scroll 15s linear infinite',
          width: 'max-content',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.animationPlayState = 'paused')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.animationPlayState = 'running')
        }
      >
        {[...images, ...images].map((src, index) => (
          <div
            key={index}
            className="relative h-[100px] cursor-pointer group"
            style={{ minWidth: 'calc((100vw - 2rem - 4rem) / 4)' }}
          >
            <img src={src} alt="img" className="h-full w-full object-cover" />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
              style={{
                background:
                  'radial-gradient(ellipse, transparent 0%, rgba(0, 0, 0, 0.5) 100%)',
              }}
            >
              <span className="text-white text-xl font-bold opacity-0 scale-150 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                Image {(index % images.length) + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 0.5rem));
          }
        }
      `}</style>
    </div>
  );
};
