import FloatingLines from '../../components/FloatingLines';
import HeroSection from '../../components/hero/HeroSection';

export const Home = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 opacity-20">
        <FloatingLines
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={4}
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
    </div>
  );
};

export default Home;