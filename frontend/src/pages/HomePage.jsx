import React, { Suspense, lazy } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { BlogSection } from '@/components/BlogSection';
import { WhatsAppWidget } from '@/components/WhatsAppWidget';
import Footer from '@/components/Footer';

const Benefits = lazy(() => import('@/components/Benefits'));
const HowItWorks = lazy(() => import('@/components/HowItWorks'));
const AboutUs = lazy(() => import('@/components/AboutUs'));
const RealEconomy = lazy(() => import('@/components/RealEconomy'));
const BudgetForm = lazy(() => import('@/components/BudgetForm'));
const FAQMonochrome = lazy(() => import('@/components/ui/faq-monochrome'));
const CallToAction = lazy(() => import('@/components/CallToAction'));
const Testimonials = lazy(() =>
  import('@/components/ui/unique-testimonial').then((module) => ({ default: module.Testimonials }))
);
const TabsDemo = lazy(() =>
  import('@/components/TabsDemo').then((module) => ({ default: module.TabsDemo }))
);

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-deep-navy">
      <HeroSection />
      <main>
        <Suspense fallback={<div className="py-20 text-center">Carregando...</div>}>
          <Benefits />
          <TabsDemo />
          <HowItWorks />
          <AboutUs />
          <RealEconomy />
          <BudgetForm />
          <Testimonials />
          <FAQMonochrome />
          <CallToAction />
          <BlogSection />
        </Suspense>
      </main>
      <WhatsAppWidget />
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default HomePage;
