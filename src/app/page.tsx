"use client";

import { motion } from "framer-motion";
import Banner from "@/components/Home/Banner";
import GenreVibeExplorer from "@/components/Home/GenreVibeExplorer";
import BorrowingSteps from "@/components/Home/BorrowingSteps";
import HomeBooks from "@/components/Home/HomeBooks";
import UpcomingBooksSlider from "@/components/Home/UpcomingBooksSlider";

import CommunityLedger from "@/components/Home/CommunityLedger";

function AnimatedSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="space-y-12 overflow-hidden">
      <AnimatedSection>
        <Banner />
      </AnimatedSection>

      <AnimatedSection>
        <HomeBooks />
      </AnimatedSection>

      <AnimatedSection>
        <GenreVibeExplorer />
      </AnimatedSection>

      <AnimatedSection>
        <BorrowingSteps />
      </AnimatedSection>

      <AnimatedSection>
        <UpcomingBooksSlider />
      </AnimatedSection>

      <AnimatedSection>
        <CommunityLedger />
      </AnimatedSection>
    </div>
  );
}
