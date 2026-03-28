// src/pages/Landing/LandingPage.jsx

import LandingLayout from "../../layouts/LandingLayout.jsx";

import HeroSection from "../../components/landing/sections/HeroSection.jsx";
import AboutSection from "../../components/landing/sections/AboutSection.jsx";
import UseCasesSection from "../../components/landing/sections/UseCasesSection.jsx";
import VisionToVictorySection from "../../components/landing/sections/VisionToVictorySection.jsx";
import StudexaLoopSection from "../../components/landing/sections/StudexaLoopSection.jsx";
import TestimonialsSection from "../../components/landing/sections/TestimonialsSection.jsx";
import FaqSection from "../../components/landing/sections/FaqSection.jsx";
import FooterSection from "../../components/landing/sections/FooterSection.jsx";

const LandingPage = () => {
  return (
    <LandingLayout containerClassName="pt-0">
      {/* Landing Sections (order intentionally fixed) */}
      <main className="w-full">
        <HeroSection />
        <AboutSection />
        <UseCasesSection />
        <VisionToVictorySection />
        <StudexaLoopSection />
        <TestimonialsSection />
        <FaqSection />
      </main>

      {/* Footer */}
      <FooterSection />
    </LandingLayout>
  );
};

export default LandingPage;
