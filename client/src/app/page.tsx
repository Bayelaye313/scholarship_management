"use client";

import { useSession } from "next-auth/react";
import TestimonialCarousel from "@/components/home/TestimonialCarousel";
import StatsSection from "@/components/home/StatsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HeroSection from "@/components/home/HeroSection";
import { useStats } from "@/hooks/useStats";
import { testimonials } from "@/data/testimonials";

export default function Home() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.isAdmin;
  const stats = useStats();

  return (
    <main className="min-h-screen">
      <HeroSection
        title="Trouvez la bourse qui vous correspond"
        subtitle="Des opportunités d'études pour tous les étudiants"
        ctaText="Explorer les bourses"
        ctaLink="/bourses"
      />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nos chiffres clés</h2>
          <StatsSection stats={stats} />
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Ce qu'ils en disent</h2>
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      <FeaturesSection />
    </main>
  );
}
