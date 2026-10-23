import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  UserCheck,
  Award,
  Bell,
  User,
  Users,
  FileSpreadsheet,
  FolderOpen,
  Send,
  Home,
  Info,
  Images,
  Sparkles,
  LogIn,
  Layers
} from 'lucide-react';

export const PUBLIC_NAV_LINKS = [
  { label: 'Home', href: '#home', icon: Home },
  { label: 'About Us', href: '#about', icon: Info },
  { label: 'Domains', href: '#domains', icon: Layers },
  { label: 'Team', href: '#team', icon: Users },
  { label: 'Events', href: '#events', icon: Calendar },
  { label: 'Join Us', href: '#join', icon: Sparkles },
];

export const MEMBER_NAV_LINKS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Attendance', href: '/attendance', icon: UserCheck },
  { label: 'Peer Sessions', href: '/sessions', icon: BookOpen },
  { label: 'Junior Applications', href: '/applications', icon: Send },
];

export const COORDINATOR_NAV_LINKS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Attendance', href: '/attendance', icon: UserCheck },
  { label: 'Peer Sessions', href: '/sessions', icon: BookOpen },
  { label: 'Manage Sessions', href: '/staff/sessions', icon: BookOpen },
  { label: 'Announcements', href: '/staff/announcements', icon: Bell },
  { label: 'Attendance Matrix', href: '/staff/attendance', icon: FileSpreadsheet },
];

export const ADMIN_NAV_LINKS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'My Attendance', href: '/attendance', icon: UserCheck },
  { label: 'Announcements', href: '/admin/announcements', icon: Bell },
  { label: 'Member Approvals', href: '/admin/members', icon: Users },
  { label: 'Attendance', href: '/admin/attendance', icon: FileSpreadsheet },
  { label: 'Junior Applications', href: '/admin/applications', icon: Send },
  { label: 'Manage Sessions', href: '/admin/sessions', icon: BookOpen },
  { label: 'Manage Events', href: '/admin/events', icon: Calendar },
  { label: 'Gallery Resources', href: '/admin/resources', icon: FolderOpen },
];

export const getPageTitle = (pathname, role = 'member') => {
  const path =
    pathname && pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname || '';

  // Specific routes
  if (path === '/attendance') {
    return 'My Attendance';
  }
  if (/^\/(admin|staff)\/sessions\/[^/]+\/attendance$/.test(path)) {
    return 'Session Attendance';
  }
  if (/^\/(admin|staff)\/sessions\/[^/]+\/edit$/.test(path)) {
    return 'Edit Session';
  }
  if (/^\/(admin|staff)\/sessions\/new$/.test(path)) {
    return 'Create Session';
  }
  if (/^\/sessions\/[^/]+$/.test(path)) {
    return 'Session Details';
  }
  if (path === '/staff/sessions') {
    return 'Manage Sessions';
  }
  if (path === '/staff/announcements') {
    return 'Announcements';
  }
  if (path === '/staff/attendance') {
    return 'Attendance Matrix';
  }

  const links =
    role === 'admin'
      ? [...ADMIN_NAV_LINKS, ...MEMBER_NAV_LINKS]
      : role === 'coordinator'
      ? [...COORDINATOR_NAV_LINKS, ...MEMBER_NAV_LINKS]
      : [...MEMBER_NAV_LINKS, ...ADMIN_NAV_LINKS];

  let bestMatch = null;

  for (const link of links) {
    // Root-level dashboard paths match only exactly so they don't capture nested pages
    if (link.href === '/admin' || link.href === '/dashboard') {
      if (path === link.href) {
        if (!bestMatch || link.href.length > bestMatch.href.length) {
          bestMatch = link;
        }
      }
    } else if (path === link.href || path.startsWith(`${link.href}/`)) {
      if (!bestMatch || link.href.length > bestMatch.href.length) {
        bestMatch = link;
      }
    }
  }

  if (bestMatch) {
    return bestMatch.label;
  }

  return role === 'admin' ? 'Overview' : 'Dashboard';
};