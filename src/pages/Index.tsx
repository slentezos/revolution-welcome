import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import LifeLoversSection from "@/components/home/LifeLoversSection";
import NoTimeToLoseSection from "@/components/home/NoTimeToLoseSection";
import ApproachSection from "@/components/home/ApproachSection";
import CommitmentsSection from "@/components/home/CommitmentsSection";
import GiftBannerSection from "@/components/home/GiftBannerSection";

export default function Index() {
  return (
    <Layout>
      <HeroSection />
      <LifeLoversSection />
      <NoTimeToLoseSection />
      <ApproachSection />
      <CommitmentsSection />
      <GiftBannerSection />
    </Layout>
  );
}
