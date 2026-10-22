import Hero from "@/components/sections/Hero";
import TechStack from "@/components/sections/TechStack";
import Background from "@/components/sections/Background";
import Navbar from "@/components/Navbar";
import JsonLd from "@/components/SEO/JsonLd";
import DeferredHomeSection from "@/components/DeferredHomeSection";

export const revalidate = 60;

export default function Home() {
  // Portfolio structured data
  const portfolioData = {
    name: "Kayes",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://kayes-portfolio.vercel.app/",
    image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://kayes-portfolio.vercel.app/"}/og-image.png`,
    jobTitle: "Full Stack Web Developer",
    description: "Kayes's portfolio showcasing web development projects, skills, and professional experience in React, Next.js, and full-stack development.",
    websiteName: "Kayes Portfolio",
    socialProfiles: [
      "https://github.com/Mahmudullah-Kayes",
      "https://www.linkedin.com/in/mahmudullah-kayes/",
      "https://www.facebook.com/MahmudullahKayes914"
    ]
  };

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      {/* Add structured data for SEO */}
      <JsonLd type="Portfolio" data={portfolioData} />

      <Background />

      <div className="relative z-10">
      <noscript>
        <section aria-label="Portfolio summary" className="sr-only">
          <h1>Kayes - Full Stack Web Developer Portfolio</h1>
          <p>
            Portfolio showcasing full-stack web development work, technology stack,
            client projects, process, testimonials, and contact information.
          </p>
          <ul>
            <li>Services: Full stack development, web application architecture, responsive UI implementation</li>
            <li>Core stack: React, Next.js, TypeScript, Node.js, Laravel, MySQL, MongoDB</li>
            <li>Focus: Performance, accessibility, maintainability, and production readiness</li>
          </ul>
        </section>
      </noscript>
      
      <Navbar />
      <Hero />
      <TechStack />
      <DeferredHomeSection
        section="client-projects"
        id="client-projects"
        placeholderClassName="min-h-[32rem]"
      />
      <DeferredHomeSection
        section="about"
        id="about"
        placeholderClassName="min-h-[36rem]"
      />
      <DeferredHomeSection
        section="how-i-work"
        id="how-i-work"
        placeholderClassName="min-h-[36rem]"
      />
      <DeferredHomeSection
        section="works"
        id="works"
        placeholderClassName="min-h-[32rem]"
      />
      <DeferredHomeSection
        section="testimonials"
        id="testimonials"
        placeholderClassName="min-h-[24rem]"
      />
      <DeferredHomeSection
        section="footer"
        id="footer"
        placeholderClassName="min-h-32"
      />
      </div>
    </main>
  );
}
