import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PetProfileCard from "@/components/PetProfileCard";
import CareInstructions from "@/components/CareInstructions";
import VetEmergencySection from "@/components/VetEmergencySection";
import DailyRoutine from "@/components/DailyRoutine";
import AlertsSection from "@/components/AlertsSection";
import Footer from "@/components/Footer";
import { recordVisit } from "@/lib/analytics";

const Index = () => {
  useEffect(() => {
    recordVisit();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PetProfileCard />
      <CareInstructions />
      <DailyRoutine />
      <VetEmergencySection />
      <AlertsSection />
      <Footer />
    </div>
  );
};

export default Index;
