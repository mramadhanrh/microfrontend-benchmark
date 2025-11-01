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
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-center">
            MEMBERSHIP PLANS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {[
              {
                name: 'Basic',
                price: '$29',
                period: '/month',
                features: [
                  'Access to gym equipment',
                  'Locker room access',
                  'Mobile app access',
                ],
                popular: false,
              },
              {
                name: 'Premium',
                price: '$59',
                period: '/month',
                features: [
                  'Everything in Basic',
                  'Unlimited group classes',
                  'Personal training session',
                  'Nutrition consultation',
                ],
                popular: true,
              },
              {
                name: 'Elite',
                price: '$99',
                period: '/month',
                features: [
                  'Everything in Premium',
                  'Unlimited personal training',
                  'Spa & sauna access',
                  'Priority booking',
                ],
                popular: false,
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-xl sm:rounded-2xl p-6 sm:p-8 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                  plan.popular
                    ? 'bg-black text-white shadow-2xl scale-105 md:scale-110'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-xs sm:text-sm font-bold uppercase">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 uppercase">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl sm:text-5xl md:text-6xl font-bold">
                      {plan.price}
                    </span>
                    <span
                      className={`text-base sm:text-lg ml-2 ${
                        plan.popular ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {plan.period}
                    </span>
                  </div>
                </div>
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm sm:text-base"
                    >
                      <svg
                        className="w-5 h-5 mr-3 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base transition-all ${
                    plan.popular
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  Choose Plan
                </button>
              </div>
            ))}
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
