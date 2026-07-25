import { useNavigate } from 'react-router-dom';
import StaggeredMenu from '../StaggeredMenu';
import { PUBLIC_NAV_LINKS } from '../../constants/navigation';
import { useAuth } from '../../context/AuthContext';

export const MobileNav = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const navItems = PUBLIC_NAV_LINKS.map((link) => ({
    label: link.label,
    ariaLabel: link.label,
    link: link.href,
  }));

  const ctaItem = user
    ? { label: 'Portal Dashboard', ariaLabel: 'Go to portal dashboard', link: '/dashboard' }
    : { label: 'C3 Member Login', ariaLabel: 'Go to member login', link: '/login' };

  const items = [...navItems, ctaItem];

  const handleItemClick = (item) => {
    navigate(item.link);
  };

  return (
    <div className="md:hidden">
      <StaggeredMenu
        position="right"
        items={items}
        displaySocials={false}
        displayItemNumbering
        menuButtonColor="var(--text-main)"
        openMenuButtonColor="var(--text-main)"
        changeMenuColorOnOpen={false}
        accentColor="var(--primary)"
        colors={['var(--surface-main)', 'var(--bg-main)']}
        isFixed
        onItemClick={handleItemClick}
      />
    </div>
  );
};

export default MobileNav;