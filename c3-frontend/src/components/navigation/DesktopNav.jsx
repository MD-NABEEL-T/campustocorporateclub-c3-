import { useNavigate, useLocation } from 'react-router-dom';
import GooeyNav from '../GooeyNav';
import { PUBLIC_NAV_LINKS } from '../../constants/navigation';

export const DesktopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = PUBLIC_NAV_LINKS.filter((link) => !link.isHighlight).map((link) => ({
    label: link.label,
    href: link.href,
  }));

  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.href === location.pathname)
  );

  const handleItemClick = (item) => {
    navigate(item.href);
  };

  return (
    <div className="hidden md:block">
      <GooeyNav
        key={location.pathname}
        items={items}
        initialActiveIndex={activeIndex}
        onItemClick={handleItemClick}
        particleCount={12}
        particleDistances={[70, 8]}
        particleR={80}
        animationTime={500}
        timeVariance={250}
      />
    </div>
  );
};

export default DesktopNav;