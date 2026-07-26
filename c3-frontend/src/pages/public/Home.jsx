import FloatingLines from '../../components/FloatingLines';
import HeroSection from '../../components/hero/HeroSection';
import AboutSection from '../../components/sections/AboutSection';
import ShapeGrid from '..//../components/ShapeGrid';

export const Home = () => {
  return (
    <div className="relative w-full overflow-hidden bg-black">
      <section id="home" className="relative min-h-screen">
        <div className="absolute inset-0 opacity-20">
          <FloatingLines
            enabledWaves={['top', 'middle', 'bottom']}
            lineCount={8}
            lineDistance={10}
            bendRadius={5}
            bendStrength={-1}
            interactive={false}
            parallax={false}
            animationSpeed={0.4}
            linesGradient={['#3B82F6', '#A1A1AA', '#3B82F6']}
          />
        </div>

        <HeroSection />
      </section>
      <AboutSection />
    </div>
  );
};

export default Home;