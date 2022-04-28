import { lazy } from 'solid-js';
import type { RouteDefinition } from 'solid-app-router';

import Home from './pages/home/Home';
import AboutData from './pages/about/about.data';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/sqlite',
    component: lazy(() => import('./pages/sqlite-tests/SqlitePage'))
  },
  {
    path: '/noencryption',
    component: lazy(() => import('./pages/no-encryption/NoEncryption'))
  },
  {
    path: '/importexport',
    component: lazy(() => import('./pages/import-export/ImportExportJson'))
  },
  {
    path: '/about',
    component: lazy(() => import('./pages/about/About')),
    data: AboutData,
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];
