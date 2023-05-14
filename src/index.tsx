//import 'windi.css';
/* @refresh reload */
import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite';


import App from './App';
import {platform, sqlite} from './App';

customElements.define('jeep-sqlite', JeepSqlite);

window.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize jeep-sqlite component for Web platform
        if(platform === 'web') {
            const jeepEl = document.createElement("jeep-sqlite");
            document.body.appendChild(jeepEl);
            await customElements.whenDefined('jeep-sqlite');
            await sqlite.initWebStore();
          }
        render(() => (
            <Router>
                <App />
            </Router>
        ),
        document.getElementById('root') as HTMLElement);
    } catch (err) {
        console.log(`Error: ${err}`);
        throw new Error(`Error: ${err}`)
    }
});
