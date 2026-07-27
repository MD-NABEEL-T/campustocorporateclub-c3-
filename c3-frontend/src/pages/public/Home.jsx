import HeroSection from '../../components/hero/HeroSection';
import AboutSection from '../../components/sections/AboutSection';

export const Home = () => {
  return (
    <div className="relative w-full overflow-hidden bg-black">
      <section id="home" className="relative min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/assets/c3fullmembers.jpg.jpeg')" }}
        />
        <div className="absolute inset-0 bg-black/60" />

        <HeroSection />
      </section>

      <AboutSection />
    </div>
  );
};

export default Home;