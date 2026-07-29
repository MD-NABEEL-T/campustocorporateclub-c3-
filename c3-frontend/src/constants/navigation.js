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
  // TODO: swap these to in-page anchors once their sections are built
  { label: 'Team', href: '/team', icon: Users },
  { label: 'Events', href: '/events', icon: Calendar },
  { label: 'Join Us', href: '/apply', icon: Sparkles },
];

export const MEMBER_NAV_LINKS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Attendance', href: '/attendance', icon: UserCheck },
  { label: 'Sessions', href: '/sessions', icon: BookOpen },
  { label: 'Events & Reports', href: '/events', icon: Calendar },
  { label: 'Resources Hub', href: '/resources', icon: FolderOpen },
  { label: 'Announcements', href: '/announcements', icon: Bell },
  { label: 'My Profile', href: '/profile', icon: User },
];

export const ADMIN_NAV_LINKS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Member Roster', href: '/admin/members', icon: Users },
  { label: 'Junior Applications', href: '/admin/applications', icon: Send },
  { label: 'Manage Sessions', href: '/admin/sessions', icon: BookOpen },
  { label: 'Manage Events', href: '/admin/events', icon: Calendar },
  { label: 'Global Attendance', href: '/admin/attendance', icon: FileSpreadsheet },
  { label: 'Resource Uploads', href: '/admin/resources', icon: FolderOpen },
  { label: 'Broadcasts', href: '/admin/announcements', icon: Bell },
];