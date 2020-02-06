import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  menuItems = [ 
    { route: "/usuarios", name : "Usuarios"} ,
    { route: "/proveedores", name : "proveedores"},
    { route: "/vehiculos", name: "Vehículos" } 
  ];



}
