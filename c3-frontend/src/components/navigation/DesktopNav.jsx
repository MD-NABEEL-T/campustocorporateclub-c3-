import { useLocation } from 'react-router-dom';
import PillNav from '../reactbits/PillNav';
import { PUBLIC_NAV_LINKS } from '../../constants/navigation';

export const DesktopNav = () => {
  const location = useLocation();

  const items = PUBLIC_NAV_LINKS.map((link) => ({
    label: link.label,
    href: link.href,
  }));

  return (
<div className="hidden lg:block flex-1">
        <PillNav
        logo="/assets/c3-logo.jpeg"
        logoAlt="Campus to Corporate Club"
        items={items}
        activeHref={location.pathname}
        baseColor="#3B82F6"
        pillColor="rgba(255, 255, 255, 0.05)"
        hoveredPillTextColor="#FFFFFF"
        pillTextColor="rgba(226, 232, 240, 0.78)"
        ease="power3.easeOut"
        initialLoadAnimation={false}
      />
    </div>
  );
};

export default DesktopNav;