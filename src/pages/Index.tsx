import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedClubs from "@/components/TrustedClubs";
import ForYou from "@/components/ForYou";
import Federations from "@/components/Federations";
import FeaturedPlayers from "@/components/FeaturedPlayers";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import PartnerClubs from "@/components/PartnerClubs";
import Contact from "@/components/Contact";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

const homeTestimonials = [
  {
    quote: "iHandball completely transformed how we approach player recruitment. We found our star goalkeeper through the platform in just two weeks.",
    name: "Hans Müller",
    role: "Sporting Director, THW Kiel",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face"
  },
  {
    quote: "As a player, getting visibility to top clubs felt impossible. iHandball opened doors I never knew existed.",
    name: "Maria Santos",
    role: "Professional Player, Spain",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face"
  },
  {
    quote: "The platform's analytics and player comparison tools have become essential to our scouting process.",
    name: "Pierre Dubois",
    role: "Head Coach, PSG Handball",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
  }
];

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <TrustedClubs />
      <ForYou />
      <Federations />
      <FeaturedPlayers />
      <HowItWorks />
      <Stats />
      <PartnerClubs />
      <TestimonialsCarousel 
        title="What Our Community Says"
        subtitle="Hear from players and clubs who have transformed their careers with iHandball"
        testimonials={homeTestimonials}
      />
      <Contact />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
