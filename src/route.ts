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
    component: lazy(() => import('./tests/no-encryption/NoEncryption'))
  },
  {
    path: '/importexport',
    component: lazy(() => import('./tests/import-export/ImportExportJson'))
  },
  {
    path: '/issue271',
    component: lazy(() => import('./tests/issue271/Issue271'))
  },
  {
    path: '/issue275',
    component: lazy(() => import('./tests/issue275/Issue275'))
  },
  {
    path: '/issue277',
    component: lazy(() => import('./tests/issue277/Issue277'))
  },
  {
    path: '/issue285',
    component: lazy(() => import('./tests/issue285/Issue285'))
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
