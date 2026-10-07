import { useNavigate, useLocation } from 'react-router-dom';
import StaggeredMenu from '../reactbits/StaggeredMenu';
import { PUBLIC_NAV_LINKS } from '../../constants/navigation';
import { useAuth } from '../../context/AuthContext';
import { scrollToTarget } from '../../utils/smoothScroll';
import { EVENT_ENABLED } from '../../event-module/config';

export const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = PUBLIC_NAV_LINKS.map((link) => ({
    label: link.label,
    ariaLabel: link.label,
    link: link.href,
  }));

  const ctaItem = user
    ? { label: 'Portal Dashboard', ariaLabel: 'Go to portal dashboard', link: '/dashboard' }
    : { label: 'Member Login', ariaLabel: 'Go to member login', link: '/login' };

  const items = EVENT_ENABLED
    ? [...navItems, { label: 'Register for Event', ariaLabel: 'Event Registration', link: '/event/register' }, ctaItem]
    : [...navItems, ctaItem];


  const handleItemClick = (item) => {
    if (item.link.startsWith('#')) {
      if (location.pathname === '/' || window.location.pathname === '/') {
        window.history.pushState(null, '', '/' + item.link);
        setTimeout(() => {
          scrollToTarget(item.link);
        }, 50);
      } else {
        navigate('/' + item.link);
      }
    } else {
      navigate(item.link);
    }
  };

  return (
    <div className="lg:hidden">
      <StaggeredMenu
        position="right"
        items={items}
        displaySocials={false}
        displayItemNumbering={false}
        menuButtonColor="#FFFFFF"
        openMenuButtonColor="#FFFFFF"
        changeMenuColorOnOpen={false}
        accentColor="#FFFFFF"
        colors={['#27272A', '#09090B']}
        isFixed
        onItemClick={handleItemClick}
        logoUrl={null}
      />
    </div>
  );
};

export default MobileNav;