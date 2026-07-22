import {
  Home,
  Video,
  Upload,
  BarChart3,
  HelpCircle,
  Info,
  User,
} from 'lucide-react';
import { NavItem } from '../types';

export const NAVIGATION: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'live-monitoring', label: 'Live Monitoring', icon: Video, path: '/live-monitoring' },
  { id: 'upload-video', label: 'Upload Video', icon: Upload, path: '/upload-video' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
  { id: 'faq', label: 'FAQ', icon: HelpCircle, path: '/faq' },
  { id: 'about', label: 'About', icon: Info, path: '/about' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

export const MOCK_USERS = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', password: 'password', role: 'admin' as const },
  { id: '2', name: 'Teacher User', email: 'teacher@example.com', password: 'password', role: 'teacher' as const },
];

export const APP_VERSION = '1.0.0';
