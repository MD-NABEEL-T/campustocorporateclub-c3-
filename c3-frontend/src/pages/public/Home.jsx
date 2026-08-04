import HeroSection from '../../components/hero/HeroSection';
import AboutSection from '../../components/sections/AboutSection';
import DomainsSection from '../../components/sections/DomainsSection';
import TeamSection from '../../components/sections/TeamSection';
import EventsSection from '../../components/sections/EventsSection';
import JoinUsSection from '../../components/sections/JoinUsSection';
import DiscloseImage from '../../components/DiscloseImage';

export const Home = () => {
  return (
    <div className="relative w-full overflow-hidden bg-black">
      <section id="home" className="relative min-h-screen min-h-[100dvh]">
        <DiscloseImage
          src="/assets/c3fullmembers.jpg.jpeg"
          className="absolute inset-0 opacity-[0.78]"
          imgClassName="object-[center_25%]"
        />
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