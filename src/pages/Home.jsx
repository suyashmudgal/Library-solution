import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import ValuePropsSection from '../components/landing/ValuePropsSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import UseCasesSection from '../components/landing/UseCasesSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import WorkflowVisualSection from '../components/landing/WorkflowVisualSection';
import CtaSection from '../components/landing/CtaSection';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col w-full">
      {/* 1. Hero Section with Card Preview Mockup */}
      <HeroSection />

      {/* 2. Value Props / Trust Section */}
      <ValuePropsSection />

      {/* 3. 3-Step How It Works */}
      <HowItWorksSection />

      {/* 4. Use Cases Grid */}
      <UseCasesSection />

      {/* 5. Real Features Grid */}
      <FeaturesSection />

      {/* 6. Product Workflow Visual */}
      <WorkflowVisualSection />

      {/* 7. Final Call to Action */}
      <CtaSection />
    </div>
  );
}
