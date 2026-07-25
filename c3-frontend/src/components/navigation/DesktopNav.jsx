import { useLocation } from 'react-router-dom';
import PillNav from '../PillNav';
import { PUBLIC_NAV_LINKS } from '../../constants/navigation';

export const DesktopNav = () => {
  const location = useLocation();

  // TODO: replace with a real logo asset once one exists in /public
  const items = PUBLIC_NAV_LINKS.map((link) => ({
    label: link.label,
    href: link.href,
  }));

  return (
    <div className="hidden md:block">
      <PillNav
        logo="/favicon.svg"
        logoAlt="Campus to Corporate Club"
        items={items}
        activeHref={location.pathname}
        baseColor="#000000"
        pillColor="#FFFFFF"
        hoveredPillTextColor="#FFFFFF"
        pillTextColor="#000000"
        ease="power3.easeOut"
        initialLoadAnimation={false}
      />
    </div>
  );
};

export default DesktopNav;