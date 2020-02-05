import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { UsersPageComponent, ProveedoresPageComponent, VehiculosPageComponent } from './pages/index';
import { AboutComponent } from './about/about.component';
import { DatePart } from "./pipes/datePart.pipe";
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { ProveedorService, VehiculoService, UsuarioService } from './services/api';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    CounterComponent,
    UsersPageComponent,
    ProveedoresPageComponent,
    VehiculosPageComponent,
    AboutComponent,
    DatePart,
    TableHeaderComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'about', component: AboutComponent },
      { path: 'usuarios', component: UsersPageComponent },
      { path: 'proveedores', component: ProveedoresPageComponent },
      { path: 'vehiculos', component: VehiculosPageComponent }
    ])
  ],
  providers: [ProveedorService, UsuarioService, VehiculoService],
  bootstrap: [AppComponent]
})
export class AppModule { }



