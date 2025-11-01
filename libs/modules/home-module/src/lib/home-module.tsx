import styled from '@emotion/styled';
import { Carousel } from '@modules/home-module/components';
import { useState, useEffect } from 'react';

/* eslint-disable-next-line */
export interface HomeModuleProps {}

const mockImage =
  'https://images.unsplash.com/photo-1761429528505-e153940c62a1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987';

const heroImages = [
  'https://images.unsplash.com/photo-1761429528505-e153940c62a1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=987',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=987',
];

export const HomeModule = (props: HomeModuleProps) => {
  const images = new Array(3).fill(mockImage);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleSlideChange((currentSlide + 1) % heroImages.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [currentSlide, isPaused]);

  const handleSlideChange = (index: number) => {
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  return (
    <div className="p-4">
      <div className="grid grid-row gap-4">
        <div className="grid grid-cols-4 gap-4">
          <div>SQUARE LOGO</div>
          <Carousel images={images} />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="grid grid-rows-2 gap-4">
            <div className="flex flex-col uppercase justify-center">
              <style>{`
                @keyframes slideBackground {
                  from {
                  background-size: 0% 100%;
                  }
                  to {
                  background-size: 100% 100%;
                  }
                }
                .hover-line {
                  background: linear-gradient(90deg, #000 0%, #000 100%);
                  background-size: 0% 100%;
                  background-position: left;
                  background-repeat: no-repeat;
                  transition: 0.15s ease-out;
                  transition-property: background-size color;
                }
                .hover-line:hover {
                  background-size: 100% 100%;
                }
                `}</style>
              <p className="hover-line px-2 py-2 cursor-pointer hover:text-white">
                Our Services
              </p>
              <p className="hover-line px-2 py-2 cursor-pointer hover:text-white">
                Membership Plans
              </p>
              <p className="hover-line px-2 py-2 cursor-pointer hover:text-white">
                Pricing
              </p>
            </div>

            <div className="flex items-end h-full">
              <h1 className="text-6xl font-bold">STRONGER THAN EVER</h1>
            </div>

            {/* <button className="bg-black text-white py-6 rounded-full h-fit w-full text-2xl font-light">
                JOIN US
              </button> */}
          </div>
          <div
            className="col-span-3 relative overflow-hidden h-[700px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Slider Images */}
            <div className="relative w-full h-full">
              {heroImages.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    index === currentSlide
                      ? 'opacity-100 translate-y-0'
                      : index < currentSlide
                      ? 'opacity-0 -translate-y-full'
                      : 'opacity-0 translate-y-full'
                  }`}
                >
                  <img
                    className="h-full w-full object-cover"
                    alt={`slide ${index + 1}`}
                    src={img}
                  />
                </div>
              ))}
            </div>

            {/* Indicators */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className="relative w-1 h-8 rounded-full overflow-hidden bg-white/50 hover:bg-white/70 transition-colors"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {/* Fill animation for active slide */}
                  <div
                    className={`absolute top-0 left-0 right-0 rounded-full bg-white transition-all ${
                      index === currentSlide ? 'animate-fill-indicator' : 'h-0'
                    }`}
                    style={{
                      animation:
                        index === currentSlide && !isPaused
                          ? 'fillIndicator 10s linear forwards'
                          : 'none',
                      animationPlayState: isPaused ? 'paused' : 'running',
                    }}
                  />
                </button>
              ))}
            </div>
            <style>{`
              @keyframes fillIndicator {
                from {
                  height: 0%;
                }
                to {
                  height: 100%;
                }
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeModule;
