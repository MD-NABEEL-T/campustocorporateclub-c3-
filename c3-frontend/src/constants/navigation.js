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

export const ADMIN_NAV_LINKS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Announcements', href: '/admin/announcements', icon: Bell },
  { label: 'Member Approvals', href: '/admin/members', icon: Users },
  { label: 'Junior Applications', href: '/admin/applications', icon: Send },
  { label: 'Manage Sessions', href: '/admin/sessions', icon: BookOpen },
  { label: 'Manage Events', href: '/admin/events', icon: Calendar },
  { label: 'Gallery Resources', href: '/admin/resources', icon: FolderOpen },
];