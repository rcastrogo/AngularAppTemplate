import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Usuario, Proveedor, Vehiculo} from "../../models/index";

@Component({
  selector: 'app-vehiculos-page',
  templateUrl: './vehiculos-page.component.html'
})
export class VehiculosPageComponent {

  public vehiculos: Vehiculo[];

  constructor(http: HttpClient,
              @Inject('BASE_URL') baseUrl: string) {
    http.get<Vehiculo[]>(baseUrl + 'api/v1/vehiculos')
        .subscribe(
          result => {
            this.vehiculos = result;
          },
          error => console.error(error)
        );
  }
}
