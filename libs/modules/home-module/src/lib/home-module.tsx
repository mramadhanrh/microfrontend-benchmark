import styled from '@emotion/styled';
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
  const [isTransitioning, setIsTransitioning] = useState(false);
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
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="grid grid-row gap-2 sm:gap-4">
        {/* Header with Logo and Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <div className="flex items-center justify-center sm:justify-start text-lg sm:text-xl font-bold p-2">
            SQUARE LOGO
          </div>
          <Carousel images={images} />
        </div>

        {/* Main Content - Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Side - Menu and Title */}
          <div className="grid grid-rows-1 lg:grid-rows-2 gap-4 order-2 lg:order-1">
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
              <p className="hover-line px-2 py-2 cursor-pointer hover:text-white text-xs sm:text-sm md:text-base whitespace-nowrap">
                Our Services
              </p>
              <p className="hover-line px-2 py-2 cursor-pointer hover:text-white text-xs sm:text-sm md:text-base whitespace-nowrap">
                Membership Plans
              </p>
              <p className="hover-line px-2 py-2 cursor-pointer hover:text-white text-xs sm:text-sm md:text-base whitespace-nowrap">
                Pricing
              </p>
            </div>

            {/* Title */}
            <div className="hidden lg:flex items-end h-full">
              <h1 className="text-3xl xl:text-6xl font-bold leading-tight">
                STRONGER THAN EVER
              </h1>
            </div>

            {/* <button className="bg-black text-white py-6 rounded-full h-fit w-full text-2xl font-light">
                JOIN US
              </button> */}
          </div>

          {/* Right Side - Hero Image Slider */}
          <div
            className="col-span-1 lg:col-span-3 relative overflow-hidden h-[300px] sm:h-[400px] md:h-[400px] lg:h-[500px] order-1 lg:order-2"
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
            <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 sm:gap-3">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className="relative w-1 sm:w-1.5 h-6 sm:h-8 rounded-full overflow-hidden bg-white/50 hover:bg-white/70 transition-colors"
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

        {/* Mobile Title - visible only on smaller screens */}
        <div className="lg:hidden px-2 sm:px-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight text-center sm:text-left">
            STRONGER THAN EVER
          </h1>
        </div>

        {/* CTA Banner Section */}
        <div className="mt-8 sm:mt-12 ">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
            {/* Split Background Design */}
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] sm:min-h-[450px]">
              {/* Left Side - Black with Content */}
              <div className="bg-black text-white p-6 sm:p-10 md:p-12 flex flex-col justify-center relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24" />

                <div className="relative z-10">
                  <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 sm:mb-6">
                    Limited Time Offer
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                    Transform Your Life
                    <br />
                    <span className="text-gray-400">Start Today</span>
                  </h2>
                  <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                    Join our community of fitness enthusiasts and experience
                    world-class facilities, expert trainers, and personalized
                    programs designed for your success.
                  </p>

                  {/* Multiple CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button className="group bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center">
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
                    <button className="bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-semibold hover:bg-white hover:text-black transition-all transform hover:scale-105">
                      Schedule Tour
                    </button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap gap-4 sm:gap-6 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/20">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs sm:text-sm text-gray-300">
                        No commitment required
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs sm:text-sm text-gray-300">
                        Cancel anytime
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs sm:text-sm text-gray-300">
                        All classes included
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Image/Gradient with Benefits */}
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 p-6 sm:p-10 md:p-12 flex flex-col justify-center">
                {/* Background Image Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=987')`,
                  }}
                />

                <div className="relative z-10">
                  <h3 className="text-2xl sm:text-3xl font-bold text-black mb-6 sm:mb-8">
                    What's Included:
                  </h3>

                  <div className="space-y-4 sm:space-y-5">
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
                        className="flex items-start gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-xl hover:bg-white/80 transition-all cursor-pointer group"
                      >
                        <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                          {benefit.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-base sm:text-lg text-black mb-1">
                            {benefit.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {benefit.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Additional CTA */}
                  <div className="mt-6 sm:mt-8 p-4 bg-black/5 rounded-xl text-center">
                    <p className="text-sm sm:text-base text-gray-700 mb-2">
                      <span className="font-bold">500+</span> members joined
                      this month
                    </p>
                    <button className="text-sm sm:text-base text-black font-semibold underline hover:no-underline">
                      See membership options →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats/Achievements Section */}
        <div ref={statsRef} className="mt-8 sm:mt-12 px-2 sm:px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                className="group relative bg-gray-50 hover:bg-black rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                <div className="relative z-10">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 group-hover:text-white transition-colors">
                    {stat.number}
                    {stat.suffix}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600 group-hover:text-gray-300 transition-colors uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Classes/Programs Section */}
        <div className="mt-8 sm:mt-12 px-2 sm:px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">
            FEATURED CLASSES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                className="group relative h-64 sm:h-72 md:h-80 overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer"
              >
                <img
                  src={classItem.image}
                  alt={classItem.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-6"
                  style={{
                    background:
                      'radial-gradient(ellipse, transparent 0%, rgba(0, 0, 0, 0.8) 100%)',
                  }}
                >
                  <div className="text-white">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                      {classItem.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-200">
                      {classItem.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing/Membership Plans Section */}
        <div className="mt-8 sm:mt-12 px-2 sm:px-4">
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
                box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
              }
              50% {
                box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0);
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
              background: linear-gradient(45deg, #fff, #000, #fff);
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

          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block bg-black text-white px-6 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
              Choose Your Path
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 leading-tight">
              UNLEASH YOUR
              <br />
              <span className="relative inline-block">
                POTENTIAL
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-black"></div>
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
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
                color: 'from-gray-700 to-gray-900',
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
                color: 'from-black to-gray-800',
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
                color: 'from-gray-800 to-black',
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`plan-card glow-border relative group ${
                  plan.popular ? 'md:-mt-4 md:mb-0 z-10' : ''
                }`}
              >
                <div
                  className={`relative h-full bg-gradient-to-br ${plan.color} text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer overflow-hidden`}
                >
                  {/* Animated background elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -translate-y-20 translate-x-20 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full translate-y-16 -translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>

                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      <div className="bg-white text-black px-6 py-2 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg animate-pulse">
                        ⚡ Best Value ⚡
                      </div>
                    </div>
                  )}

                  <div className="relative z-10">
                    {/* Plan header */}
                    <div className="text-center mb-6 sm:mb-8 pt-2">
                      <div className="text-xs sm:text-sm uppercase tracking-widest text-gray-400 mb-2">
                        {plan.subtitle}
                      </div>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-6 uppercase tracking-wider">
                        {plan.name}
                      </h3>

                      {/* Price with animation */}
                      <div className="flex items-end justify-center mb-2">
                        <span className="price-reveal text-5xl sm:text-6xl md:text-7xl font-black leading-none">
                          {plan.price}
                        </span>
                        <span className="text-lg sm:text-xl ml-2 mb-2 text-gray-400">
                          {plan.period}
                        </span>
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-30 my-6"></div>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="feature-item flex items-start text-sm sm:text-base"
                          style={{
                            animationDelay: `${idx * 0.1}s`,
                            opacity: 0,
                          }}
                        >
                          <div className="flex-shrink-0 w-6 h-6 mr-3 mt-0.5 bg-white rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                            <svg
                              className="w-4 h-4 text-black"
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
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      className={`w-full py-4 sm:py-5 rounded-full font-black text-sm sm:text-base uppercase tracking-wider transition-all duration-300 transform hover:scale-105 relative overflow-hidden group/btn ${
                        plan.popular
                          ? 'bg-white text-black'
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
                        <div className="absolute inset-0 bg-white transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300"></div>
                      )}
                    </button>

                    {/* Extra info */}
                    <div className="text-center mt-4 text-xs sm:text-sm text-gray-400">
                      No commitment • Cancel anytime
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12 sm:mt-16">
            <p className="text-base sm:text-lg text-gray-600 mb-4">
              Not sure which plan fits you best?
            </p>
            <button className="inline-flex items-center gap-2 text-black font-bold text-base sm:text-lg hover:gap-4 transition-all duration-300 group">
              Compare all plans in detail
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
        <div className="mt-8 sm:mt-12 px-2 sm:px-4 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-center">
            SUCCESS STORIES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                className="bg-gray-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-700 mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div className="border-t pt-4">
                  <div className="font-bold text-base sm:text-lg">
                    {testimonial.name}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
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
