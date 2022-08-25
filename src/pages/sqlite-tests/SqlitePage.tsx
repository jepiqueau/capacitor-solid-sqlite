import type { Component } from 'solid-js';
import { Link, useRoutes, useLocation } from 'solid-app-router';

import { routes } from '../../route';


import styles from './SqlitePage.module.css';

const SqlitePage: Component = () => {
    const location = useLocation();
    const Route = useRoutes(routes);
    return (
        <div class={styles.SqlitePage}>
            <header class={styles.header}>
                <h2>SQLite Tests</h2>
            </header>
            <div class= {styles.content}>
                <nav>
                    <ul class="items-center">
                        <li class="text-center bg-blue-500 text-gray-100 py-2 px-4 my-2">
                            <Link href="/noencryption" class="no-underline hover:underline">
                                No Encryption
                            </Link>
                        </li>
                        <li class="text-center bg-blue-500 text-gray-100 py-2 px-4 my-2">
                            <Link href="/importexport" class="no-underline hover:underline">
                                Import/Export JSON
                            </Link>
                        </li>
                        <li class="text-center bg-blue-500 text-gray-100 py-2 px-4 my-2">
                            <Link href="/issue271" class="no-underline hover:underline">
                                Issue271
                            </Link>
                        </li>
                        <li class="text-center bg-blue-500 text-gray-100 py-2 px-4 my-2">
                            <Link href="/issue275" class="no-underline hover:underline">
                                Issue275
                            </Link>
                        </li>
                        <li class="text-center bg-blue-500 text-gray-100 py-2 px-4 my-2">
                            <Link href="/issue277" class="no-underline hover:underline">
                                Issue277
                            </Link>
                        </li>
                        <li class="text-center bg-blue-500 text-gray-100 py-2 px-4 my-2">
                            <Link href="/issue285" class="no-underline hover:underline">
                                Issue285
                            </Link>
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
export default SqlitePage;
