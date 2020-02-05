import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { utils } from './extensions/extensions';
import { ProveedorService } from './app/services/api/proveedor.service';


export function getBaseUrl() {
  // return "https://localhost:44332/"; 
  return document.getElementsByTagName('base')[0].href;
}

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
  { provide: 'APP_UTILS', useValue: utils, deps: [] }
];

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic(providers).bootstrapModule(AppModule)
                                 .catch(err => console.log(err));
