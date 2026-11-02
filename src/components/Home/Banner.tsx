"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { BookOpen, ArrowRight, Library, Sparkles, HeartHandshake } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function Banner() {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const slides = [
    {
      id: 1,
      badge: "Welcome to BookNook",
      badgeIcon: Sparkles,
      title: "Discover Your Next Favorite Read",
      subtitle:
        "Step into a cozy digital sanctuary. Browse through hundreds of community-shared books, find forgotten classics, or borrow inspiring new stories.",
      buttonText: "Browse All Books",
      buttonLink: "/books",
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop",
      tag: "Community Library",
    },
    {
      id: 2,
      badge: "Seamless Borrowing",
      badgeIcon: BookOpen,
      title: "Borrow & Share Books Effortlessly",
      subtitle:
        "Simple, fast, and friendly. Reserve books for a few days, manage your active reading queue, and return them effortlessly when you're done.",
      buttonText: "Explore Catalog",
      buttonLink: "/books",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200&auto=format&fit=crop",
      tag: "Easy Checkout",
    },
    {
      id: 3,
      badge: "Grow Our Collection",
      badgeIcon: HeartHandshake,
      title: "Add Your Books & Expand the Nook",
      subtitle:
        "Have a shelf full of beloved books? Contribute to our growing community catalog and let fellow book lovers experience the joy of reading them.",
      buttonText: "Browse Books Now",
      buttonLink: "/books",
      image:
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop",
      tag: "Share Knowledge",
    },
  ];

  // Prevent server/client markup mismatch by returning a clean placeholder until mounted
  if (!isMounted) {
    return (
      <div className="w-full h-[450px] rounded-2xl bg-[#f2ede4] dark:bg-[#201d1a] animate-pulse border border-[#e8e2d9] dark:border-[#2d2924]" />
    );
  }

  return (
    <section className="relative w-full my-4 rounded-2xl overflow-hidden border border-[#e8e2d9] dark:border-[#2d2924] shadow-sm bg-[#f8f4ee] dark:bg-[#1f1c19] transition-colors duration-300">
      <Swiper
        spaceBetween={0}
        effect={"fade"}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="booknook-hero-swiper w-full rounded-2xl"
      >
        {slides.map((slide) => {
          const BadgeIcon = slide.badgeIcon;
          return (
            <SwiperSlide key={slide.id}>
              <div className="relative min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] flex items-center justify-center overflow-hidden px-6 py-12 md:px-16 lg:px-20">
                
                {/* Background Image with Warm Overlay */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="100vw"
                    unoptimized
                    className="object-cover scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#181614]/90 via-[#181614]/75 to-[#181614]/40 dark:from-[#0d0c0b]/95 dark:via-[#181614]/85 dark:to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 max-w-2xl mr-auto text-left space-y-5 text-[#faf8f5]">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#d4a373]/40 bg-[#d4a373]/20 backdrop-blur-md text-[#f0eae1] text-xs font-medium tracking-wide">
                    <BadgeIcon className="h-3.5 w-3.5 text-[#d4a373]" />
                    <span>{slide.badge}</span>
                    <span className="w-1 h-1 rounded-full bg-[#d4a373]" />
                    <span className="text-[#d4a373] text-[11px] uppercase tracking-wider">{slide.tag}</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-serif leading-tight text-[#ffffff]">
                    {slide.title}
                  </h1>

                  <p className="text-sm sm:text-base text-[#d8d3cb] leading-relaxed max-w-xl font-sans">
                    {slide.subtitle}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link
                      href={slide.buttonLink}
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#d4a373] text-[#181614] font-medium text-sm hover:bg-[#e0b284] shadow-md transition-all group font-sans"
                    >
                      <Library className="h-4 w-4" />
                      <span>{slide.buttonText}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <Link
                      href="/books"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#e8e2d9]/30 bg-black/20 hover:bg-black/40 text-[#ffffff] font-medium text-sm backdrop-blur-sm transition font-sans"
                    >
                      View Catalog
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <style jsx global>{`
        .booknook-hero-swiper .swiper-button-next,
        .booknook-hero-swiper .swiper-button-prev {
          color: #faf8f5;
          background: rgba(24, 22, 20, 0.4);
          backdrop-filter: blur(4px);
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 1px solid rgba(232, 226, 217, 0.2);
          transition: all 0.2s ease;
        }
        .booknook-hero-swiper .swiper-button-next:after,
        .booknook-hero-swiper .swiper-button-prev:after {
          font-size: 16px;
          font-weight: bold;
        }
        .booknook-hero-swiper .swiper-button-next:hover,
        .booknook-hero-swiper .swiper-button-prev:hover {
          background: #d4a373;
          color: #181614;
          border-color: #d4a373;
        }
        .booknook-hero-swiper .swiper-pagination-bullet {
          background: #ffffff;
          opacity: 0.5;
        }
        .booknook-hero-swiper .swiper-pagination-bullet-active {
          background: #d4a373 !important;
          opacity: 1;
          width: 22px;
          border-radius: 6px;
        }
        @media (max-width: 640px) {
          .booknook-hero-swiper .swiper-button-next,
          .booknook-hero-swiper .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}