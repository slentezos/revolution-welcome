import { useState } from "react";
import { Link } from "react-router-dom";
import { Gift } from "lucide-react";
import giftBannerDefault from "@/assets/gift-banner.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import PrivilegeBadge from "@/components/location/PrivilegeBadge";
import PostalCodeInput from "@/components/location/PostalCodeInput";

interface GiftBannerSectionProps {
  image?: string;
}

export default function GiftBannerSection({ image }: GiftBannerSectionProps) {
  const revealRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={revealRef} className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={image || giftBannerDefault} alt="Couple senior s'offrant un cadeau" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div data-reveal className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-[hsl(var(--gold)/0.4)] mb-8">
            <Gift className="w-7 h-7 text-[hsl(var(--gold))]" />
          </div>

          <div data-reveal data-reveal-delay="150" className="divider-gold mx-auto mb-8" />

          {/* Privilege Badge */}
          <div data-reveal data-reveal-delay="200" className="mb-8">
            <PrivilegeBadge variant="dark" />
          </div>

          <h2 data-reveal data-reveal-delay="300" className="font-heading text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-4 leading-tight">
            Une personne de votre entourage mérite
            <br />
            de faire de belles rencontres?
          </h2>

          <p data-reveal data-reveal-delay="450" className="font-heading text-2xl text-[hsl(var(--gold-light))] mb-10 md:text-4xl">
            Invitez-la en lui offrant 3 mois gratuits.
          </p>

          <div data-reveal data-reveal-delay="600">
            <Link
              to="/parrainage"
              className="inline-block bg-[hsl(var(--gold))] px-12 py-5 text-lg font-medium tracking-wide transition-all duration-500 hover:bg-[hsl(var(--gold-light))] hover:shadow-elevated hover:translate-y-[-2px] bg-primary-foreground text-secondary-foreground">
              
              J'invite un proche
            </Link>
          </div>







          
        </div>
      </div>
    </section>);

}