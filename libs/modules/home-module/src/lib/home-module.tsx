import { Carousel } from '@modules/home-module/components';
import { useState, useEffect, useRef } from 'react';

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
  const [isPaused, setIsPaused] = useState(false);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [statsCounts, setStatsCounts] = useState({
    members: 0,
    classes: 0,
    years: 0,
    trainers: 0,
  });
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleSlideChange((currentSlide + 1) % heroImages.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [currentSlide, isPaused]);

  useEffect(() => {
    // Set up Intersection Observer to trigger animation when stats section is visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated) {
            // Start animation when stats section becomes visible
            const targets = {
              members: 500,
              classes: 50,
              years: 10,
              trainers: 15,
            };

            const duration = 2000; // 2 seconds
            const steps = 60;
            const stepDuration = duration / steps;

            let currentStep = 0;

            const interval = setInterval(() => {
              currentStep++;
              const progress = currentStep / steps;

              setStatsCounts({
                members: Math.floor(targets.members * progress),
                classes: Math.floor(targets.classes * progress),
                years: Math.floor(targets.years * progress),
                trainers: Math.floor(targets.trainers * progress),
              });

              if (currentStep >= steps) {
                setStatsCounts(targets);
                setStatsAnimated(true);
                clearInterval(interval);
              }
            }, stepDuration);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: '0px',
      }
    );

    const currentRef = statsRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [statsAnimated]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-black">
      <div className="grid grid-row gap-4 sm:gap-6">
        {/* Header with Logo and Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center justify-center sm:justify-start text-xl sm:text-2xl font-bold p-3 text-white tracking-wide">
            MASTERCLASS
          </div>
          <Carousel images={images} />
        </div>

        {/* Main Content - Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Side - Menu and Title */}
          <div className="grid grid-rows-1 lg:grid-rows-2 gap-6 order-2 lg:order-1">
            {/* Menu Items */}
            <div className="flex flex-row lg:flex-col uppercase justify-center lg:justify-center gap-2 lg:gap-0">
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
                  background: linear-gradient(90deg, #E8232C 0%, #E8232C 100%);
                  background-size: 0% 100%;
                  background-position: left;
                  background-repeat: no-repeat;
                  transition: 0.2s ease-in-out;
                  transition-property: background-size color;
                  color: #B3B3B3;
                }
                .hover-line:hover {
                  background-size: 100% 100%;
                  color: #FFFFFF;
                }
                `}</style>
              <p className="hover-line px-4 py-3 cursor-pointer text-sm sm:text-base md:text-lg font-medium whitespace-nowrap tracking-wide">
                Our Services
              </p>
              <p className="hover-line px-4 py-3 cursor-pointer text-sm sm:text-base md:text-lg font-medium whitespace-nowrap tracking-wide">
                Membership Plans
              </p>
              <p className="hover-line px-4 py-3 cursor-pointer text-sm sm:text-base md:text-lg font-medium whitespace-nowrap tracking-wide">
                Pricing
              </p>
            </div>

            {/* Title */}
            <div className="hidden lg:flex items-end h-full">
              <h1 className="text-4xl xl:text-7xl font-bold leading-tight text-white tracking-tight">
                STRONGER THAN EVER
              </h1>
            </div>

            {/* <button className="bg-black text-white py-6 rounded-full h-fit w-full text-2xl font-light">
                JOIN US
              </button> */}
          </div>

          {/* Right Side - Hero Image Slider */}
          <div
            className="col-span-1 lg:col-span-3 relative overflow-hidden rounded-xl h-[300px] sm:h-[400px] md:h-[400px] lg:h-[500px] order-1 lg:order-2"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Slider Images */}
            <div className="relative w-full h-full">
              {heroImages.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
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
            <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 sm:gap-4">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className="relative w-1.5 sm:w-2 h-8 sm:h-10 rounded-full overflow-hidden bg-white/30 hover:bg-white/50 transition-all duration-200"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {/* Fill animation for active slide */}
                  <div
                    className={`absolute top-0 left-0 right-0 rounded-full bg-[#E8232C] transition-all ${
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

        {/* Mobile Title - visible only on smaller screens */}
        <div className="lg:hidden px-4 sm:px-6">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight text-center sm:text-left text-white tracking-tight">
            STRONGER THAN EVER
          </h1>
        </div>

        {/* CTA Banner Section */}
        <div className="mt-12 sm:mt-16">
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl">
            {/* Split Background Design */}
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] sm:min-h-[450px]">
              {/* Left Side - Black with Content */}
              <div className="bg-[#0F0F0F] text-white p-8 sm:p-12 md:p-16 flex flex-col justify-center relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8232C] opacity-5 rounded-full -translate-y-32 translate-x-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#E8232C] opacity-5 rounded-full translate-y-24 -translate-x-24" />

                <div className="relative z-10">
                  <div className="inline-block bg-[#E8232C]/20 backdrop-blur-sm px-6 py-3 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-widest mb-6 sm:mb-8 text-[#E8232C]">
                    Limited Time Offer
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight tracking-tight">
                    Transform Your Life
                    <br />
                    <span className="text-[#B3B3B3]">Start Today</span>
                  </h2>
                  <p className="text-lg sm:text-xl text-[#B3B3B3] mb-8 sm:mb-10 leading-relaxed max-w-xl">
                    Join our community of fitness enthusiasts and experience
                    world-class facilities, expert trainers, and personalized
                    programs designed for your success.
                  </p>

                  {/* Multiple CTAs */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <button className="group bg-[#E8232C] text-white px-8 sm:px-10 py-4 sm:py-5 rounded-lg text-base sm:text-lg font-bold hover:bg-[#C41E26] active:bg-[#A01A20] transition-all duration-200 transform hover:scale-105 flex items-center justify-center shadow-lg">
                      Get 7 Days Free
                      <svg
                        className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </button>
                    <button className="bg-transparent border-2 border-white text-white px-8 sm:px-10 py-4 sm:py-5 rounded-lg text-base sm:text-lg font-bold hover:bg-white/10 transition-all duration-200 transform hover:scale-105">
                      Schedule Tour
                    </button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap gap-6 sm:gap-8 mt-8 sm:mt-10 pt-8 sm:pt-10 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-6 h-6 text-[#43A047]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm sm:text-base text-[#B3B3B3] font-medium">
                        No commitment required
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-6 h-6 text-[#43A047]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm sm:text-base text-[#B3B3B3] font-medium">
                        Cancel anytime
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-6 h-6 text-[#43A047]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm sm:text-base text-[#B3B3B3] font-medium">
                        All classes included
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Image/Gradient with Benefits */}
              <div className="relative bg-gradient-to-br from-[#2D2D2D] to-[#1A1A1A] p-8 sm:p-12 md:p-16 flex flex-col justify-center">
                {/* Background Image Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-10"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=987')`,
                  }}
                />

                <div className="relative z-10">
                  <h3 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-10 tracking-tight">
                    What's Included:
                  </h3>

                  <div className="space-y-5 sm:space-y-6">
                    {[
                      {
                        icon: '💪',
                        title: 'Full Gym Access',
                        desc: 'State-of-the-art equipment and facilities',
                      },
                      {
                        icon: '🎯',
                        title: 'Personal Training',
                        desc: 'One free session with certified trainers',
                      },
                      {
                        icon: '📱',
                        title: 'Mobile App',
                        desc: 'Track progress and book classes instantly',
                      },
                      {
                        icon: '👥',
                        title: 'Group Classes',
                        desc: 'Unlimited access to 50+ weekly classes',
                      },
                    ].map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-5 bg-[#404040]/30 backdrop-blur-sm p-5 rounded-lg hover:bg-[#404040]/50 transition-all duration-200 cursor-pointer group border border-[#5C5C5C]/30"
                      >
                        <div
                          className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform"
                          role="img"
                          aria-label={benefit.title}
                        >
                          {benefit.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg sm:text-xl text-white mb-2">
                            {benefit.title}
                          </h4>
                          <p className="text-sm sm:text-base text-[#B3B3B3]">
                            {benefit.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Additional CTA */}
                  <div className="mt-8 sm:mt-10 p-6 bg-[#E8232C]/10 backdrop-blur-sm rounded-lg text-center border border-[#E8232C]/20">
                    <p className="text-base sm:text-lg text-white mb-3">
                      <span className="font-bold text-[#E8232C]">500+</span>{' '}
                      members joined this month
                    </p>
                    <button className="text-base sm:text-lg text-[#E8232C] font-bold hover:text-[#FF4D56] transition-colors duration-200">
                      See membership options →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats/Achievements Section */}
        <div ref={statsRef} className="mt-12 sm:mt-16 px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                key: 'members',
                number: statsCounts.members,
                suffix: '+',
                label: 'Active Members',
              },
              {
                key: 'classes',
                number: statsCounts.classes,
                suffix: '+',
                label: 'Fitness Classes',
              },
              {
                key: 'years',
                number: statsCounts.years,
                suffix: '',
                label: 'Years Experience',
              },
              {
                key: 'trainers',
                number: statsCounts.trainers,
                suffix: '',
                label: 'Expert Trainers',
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="group relative bg-[#2D2D2D] hover:bg-[#E8232C] rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 text-center transition-all duration-300 cursor-pointer transform hover:scale-105 border border-[#404040] hover:border-[#E8232C] shadow-lg hover:shadow-2xl"
              >
                <div className="relative z-10">
                  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 text-white transition-colors tracking-tight">
                    {stat.number}
                    {stat.suffix}
                  </div>
                  <div className="text-sm sm:text-base md:text-lg text-[#B3B3B3] group-hover:text-white transition-colors uppercase tracking-widest font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Classes/Programs Section */}
        <div className="mt-12 sm:mt-16 px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 sm:mb-12 text-white tracking-tight">
            FEATURED CLASSES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: 'HIIT Training',
                description:
                  'High intensity interval training for maximum results',
                image:
                  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=987',
              },
              {
                title: 'Yoga & Mindfulness',
                description:
                  'Find balance and flexibility with expert instructors',
                image:
                  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=987',
              },
              {
                title: 'Strength Training',
                description:
                  'Build muscle and increase power with guided workouts',
                image:
                  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=987',
              },
            ].map((classItem, index) => (
              <div
                key={index}
                className="group relative h-72 sm:h-80 md:h-96 overflow-hidden rounded-xl border border-[#404040] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={classItem.image}
                  alt={classItem.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 brightness-75 group-hover:brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                  <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-white tracking-tight">
                      {classItem.title}
                    </h3>
                    <p className="text-base sm:text-lg text-[#B3B3B3] mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {classItem.description}
                    </p>
                    <button className="bg-[#E8232C] text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#C41E26] transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 delay-150">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing/Membership Plans Section */}
        <div className="mt-12 sm:mt-16 px-4 sm:px-6">
          <style>{`
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes pulseGlow {
              0%, 100% {
                box-shadow: 0 0 0 0 rgba(232, 35, 44, 0.7);
              }
              50% {
                box-shadow: 0 0 20px 10px rgba(232, 35, 44, 0);
              }
            }
            @keyframes slideInFromLeft {
              from {
                opacity: 0;
                transform: translateX(-20px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            .plan-card {
              animation: slideUp 0.6s ease-out forwards;
            }
            .plan-card:nth-child(1) {
              animation-delay: 0.1s;
              opacity: 0;
            }
            .plan-card:nth-child(2) {
              animation-delay: 0.2s;
              opacity: 0;
            }
            .plan-card:nth-child(3) {
              animation-delay: 0.3s;
              opacity: 0;
            }
            .feature-item {
              animation: slideInFromLeft 0.4s ease-out forwards;
            }
            .glow-border {
              position: relative;
              overflow: hidden;
            }
            .glow-border::before {
              content: '';
              position: absolute;
              top: -2px;
              left: -2px;
              right: -2px;
              bottom: -2px;
              background: linear-gradient(45deg, #E8232C, #FF4D56, #E8232C);
              background-size: 200% 200%;
              border-radius: inherit;
              z-index: -1;
              animation: gradientShift 3s ease infinite;
              opacity: 0;
              transition: opacity 0.3s;
            }
            .glow-border:hover::before {
              opacity: 1;
            }
            @keyframes gradientShift {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }
            .price-reveal {
              display: inline-block;
              animation: priceReveal 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
            }
            @keyframes priceReveal {
              from {
                transform: scale(0) rotate(-180deg);
                opacity: 0;
              }
              to {
                transform: scale(1) rotate(0deg);
                opacity: 1;
              }
            }
          `}</style>

          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-block bg-[#E8232C] text-white px-8 py-3 rounded-lg text-sm sm:text-base font-bold uppercase tracking-widest mb-6">
              Choose Your Path
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight text-white">
              UNLEASH YOUR
              <br />
              <span className="relative inline-block">
                POTENTIAL
                <div className="absolute -bottom-3 left-0 right-0 h-2 bg-[#E8232C]"></div>
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-[#B3B3B3] max-w-2xl mx-auto">
              Select the perfect plan that matches your fitness goals and
              lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {[
              {
                name: 'STARTER',
                subtitle: 'Begin Your Journey',
                price: '$29',
                period: '/mo',
                features: [
                  'Full gym equipment access',
                  'Locker room facilities',
                  'Mobile app tracking',
                  'Basic workout plans',
                ],
                popular: false,
                color: 'from-[#2D2D2D] to-[#1A1A1A]',
              },
              {
                name: 'CHAMPION',
                subtitle: 'Most Popular Choice',
                price: '$59',
                period: '/mo',
                features: [
                  'Everything in Starter',
                  'Unlimited group classes',
                  '2 Personal training sessions',
                  'Nutrition consultation',
                  'Recovery zone access',
                ],
                popular: true,
                color: 'from-[#0F0F0F] to-[#1A1A1A]',
              },
              {
                name: 'LEGEND',
                subtitle: 'Ultimate Experience',
                price: '$99',
                period: '/mo',
                features: [
                  'Everything in Champion',
                  'Unlimited personal training',
                  'Spa & wellness access',
                  'Priority class booking',
                  'Exclusive events',
                ],
                popular: false,
                color: 'from-[#1A1A1A] to-[#0F0F0F]',
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`plan-card glow-border relative group ${
                  plan.popular ? 'md:-mt-4 md:mb-0 z-10' : ''
                }`}
              >
                <div
                  className={`relative h-full bg-gradient-to-br ${
                    plan.color
                  } text-white rounded-xl sm:rounded-2xl p-8 sm:p-10 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer overflow-hidden border ${
                    plan.popular ? 'border-[#E8232C]' : 'border-[#404040]'
                  }`}
                >
                  {/* Animated background elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#E8232C] opacity-5 rounded-full -translate-y-20 translate-x-20 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#E8232C] opacity-5 rounded-full translate-y-16 -translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>

                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      <div className="bg-[#E8232C] text-white px-8 py-3 rounded-lg text-xs sm:text-sm font-black uppercase tracking-widest shadow-2xl">
                        <span role="img" aria-label="lightning">
                          ⚡
                        </span>{' '}
                        Best Value{' '}
                        <span role="img" aria-label="lightning">
                          ⚡
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="relative z-10">
                    {/* Plan header */}
                    <div className="text-center mb-8 sm:mb-10 pt-2">
                      <div className="text-sm sm:text-base uppercase tracking-widest text-[#858585] mb-3 font-medium">
                        {plan.subtitle}
                      </div>
                      <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 uppercase tracking-wider text-white">
                        {plan.name}
                      </h3>

                      {/* Price with animation */}
                      <div className="flex items-end justify-center mb-3">
                        <span className="price-reveal text-6xl sm:text-7xl md:text-8xl font-black leading-none text-white">
                          {plan.price}
                        </span>
                        <span className="text-xl sm:text-2xl ml-3 mb-3 text-[#858585] font-medium">
                          {plan.period}
                        </span>
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-[#E8232C] to-transparent opacity-50 my-8"></div>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-5 mb-10">
                      {plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="feature-item flex items-start text-base sm:text-lg"
                          style={{
                            animationDelay: `${idx * 0.1}s`,
                            opacity: 0,
                          }}
                        >
                          <div className="flex-shrink-0 w-7 h-7 mr-4 mt-0.5 bg-[#E8232C] rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth="3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="leading-relaxed text-[#B3B3B3] font-medium">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      className={`w-full py-5 sm:py-6 rounded-lg font-black text-base sm:text-lg uppercase tracking-widest transition-all duration-200 transform hover:scale-105 relative overflow-hidden group/btn ${
                        plan.popular
                          ? 'bg-[#E8232C] text-white hover:bg-[#C41E26] active:bg-[#A01A20] shadow-lg'
                          : 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-black'
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        Start Now
                        <svg
                          className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                      {!plan.popular && (
                        <div className="absolute inset-0 bg-white transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-200"></div>
                      )}
                    </button>

                    {/* Extra info */}
                    <div className="text-center mt-5 text-sm sm:text-base text-[#858585] font-medium">
                      No commitment • Cancel anytime
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16 sm:mt-20">
            <p className="text-lg sm:text-xl text-[#B3B3B3] mb-6">
              Not sure which plan fits you best?
            </p>
            <button className="inline-flex items-center gap-3 text-[#E8232C] font-bold text-lg sm:text-xl hover:gap-5 transition-all duration-200 group hover:text-[#FF4D56]">
              Compare all plans in detail
              <svg
                className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Testimonials/Success Stories Section */}
        <div className="mt-12 sm:mt-16 px-4 sm:px-6 mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 sm:mb-12 text-center text-white tracking-tight">
            SUCCESS STORIES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: 'Sarah Johnson',
                achievement: 'Lost 30lbs in 3 months',
                quote:
                  'The trainers here are amazing! They helped me achieve goals I never thought possible.',
                rating: 5,
              },
              {
                name: 'Mike Chen',
                achievement: 'Gained 15lbs muscle',
                quote:
                  "Best gym investment I've ever made. The community and facilities are top-notch.",
                rating: 5,
              },
              {
                name: 'Emma Davis',
                achievement: 'Completed first marathon',
                quote:
                  'From couch to marathon runner! The support and training programs are incredible.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#2D2D2D] rounded-xl sm:rounded-2xl p-8 sm:p-10 hover:bg-[#404040] transition-all duration-300 transform hover:scale-105 cursor-pointer border border-[#404040] shadow-lg hover:shadow-2xl"
              >
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-6 h-6 text-[#FB8C00]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-base sm:text-lg text-[#B3B3B3] mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-[#404040] pt-5">
                  <div className="font-bold text-lg sm:text-xl text-white mb-2">
                    {testimonial.name}
                  </div>
                  <div className="text-sm sm:text-base text-[#858585] font-medium">
                    {testimonial.achievement}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeModule;
