import HeroSection from '../../components/hero/HeroSection';
import AboutSection from '../../components/sections/AboutSection';
import DomainsSection from '../../components/sections/DomainsSection';
import TeamSection from '../../components/sections/TeamSection';
import EventsSection from '../../components/sections/EventsSection';
import JoinUsSection from '../../components/sections/JoinUsSection';

export const Home = () => {
  return (
    <div className="relative w-full overflow-hidden bg-black">
      <section id="home" className="relative min-h-screen min-h-[100dvh]">

        <picture>
          <source media="(max-width: 639px)" srcSet="/assets/c3fullmembers2.jpg" />
          <img
            src="/assets/c3fullmembers.jpg.jpeg"
            alt="C3 Club Members"
            className="absolute inset-0 w-full h-full object-cover object-[center_60%] opacity-[0.78]"
          />
        </picture>
        <div className="absolute inset-0 bg-black/55" />

        <HeroSection />
      </section>

      <AboutSection />
      <DomainsSection />
      <TeamSection />
      <EventsSection />
      <JoinUsSection />
    </div>
  );
};

export default Home;