import "reflect-metadata";
import "zone.js/dist/zone";
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';

let platform = platformBrowserDynamic();

// Enable either Hot Module Reloading or production mode
if (module['hot']) {
    module['hot'].accept();
    module['hot'].dispose(() => {
        const rootElemTagName = 'app';

        // Before restarting the app, we create a new root element and dispose the old one
        const oldRootElem = document.querySelector(rootElemTagName);
        const newRootElem = document.createElement(rootElemTagName);

        oldRootElem.parentNode.insertBefore(newRootElem, oldRootElem);

        platform.destroy();
    });
} else {
    enableProdMode();
}

platform.bootstrapModule(AppModule);                  