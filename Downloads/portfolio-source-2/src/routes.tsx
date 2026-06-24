import Portfolio from './pages/Portfolio';
import ProjectsPage from './pages/ProjectsPage';
import ResearchPage from './pages/ResearchPage';
import CertificatesPage from './pages/CertificatesPage';
import type { ReactNode } from 'react';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  /** Accessible without login. Routes without this flag require authentication. Has no effect when RouteGuard is not in use. */
  public?: boolean;
}

export const routes: RouteConfig[] = [
  {
    name: 'Portfolio',
    path: '/',
    element: <Portfolio />,
    public: true,
  },
  {
    name: 'Projects',
    path: '/projects',
    element: <ProjectsPage />,
    public: true,
  },
  {
    name: 'Research',
    path: '/research',
    element: <ResearchPage />,
    public: true,
  },
  {
    name: 'Certificates',
    path: '/certificates',
    element: <CertificatesPage />,
    public: true,
  },
];
