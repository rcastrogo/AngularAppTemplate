import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Usuario, Proveedor} from "../../models/index";

@Component({
  selector: 'app-proveedores-page',
  templateUrl: './proveedores-page.component.html'
})
export class ProveedoresPageComponent {

  public proveedores: Proveedor[];

  constructor(http: HttpClient,
              @Inject('BASE_URL') baseUrl: string) {
    http.get<Proveedor[]>(baseUrl + 'api/v1/proveedores')
        .subscribe(
          result => {
            this.proveedores = result;
          },
          error => console.error(error)
        );
  }
}
