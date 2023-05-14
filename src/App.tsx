import type { Component } from 'solid-js';
import { Link, useRoutes, useLocation } from '@solidjs/router';

import { routes } from './route';

import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import styles from './App.module.css';

export const platform = Capacitor.getPlatform();
export const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite)

const App: Component = () => {
  const location = useLocation();
  const Route = useRoutes(routes);

  return (
    <div class={styles.App}>
      <div class={styles.iosHeader}></div>
      <div class={styles.menu}>
        <nav class="bg-gray-200 text-gray-900 px-4">
          <ul class="flex items-center">
            <li class="py-2 px-4">
              <Link href="/" class="no-underline hover:underline">
                Home
              </Link>
            </li>
            <li class="py-2 px-4">
              <Link href="/sqlite" class="no-underline hover:underline">
                Sqlite
              </Link>
            </li>
            <li class="py-2 px-4">
              <Link href="/about" class="no-underline hover:underline">
                About
              </Link>
            </li>
            <li class="text-sm flex items-center space-x-1 ml-auto">
              <span>URL:</span>
              <input
                class="w-75px p-1 bg-white text-sm rounded-lg"
                type="text"
                readOnly
                value={location.pathname}
              />
            </li>
          </ul>
        </nav>
      </div>
      <main>
        <Route />
      </main>
    </div>
  );
};

export default App;
