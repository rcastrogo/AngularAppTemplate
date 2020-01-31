import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from "../../models/index";

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html'
})
export class UsersPageComponent {

  public usuarios: Usuario[];

  constructor(http: HttpClient,
              @Inject('BASE_URL') baseUrl: string) {
    http.get<Usuario[]>(baseUrl + 'api/v1/usuarios')
        .subscribe(
          result => {
            this.usuarios = result;
          },
          error => console.error(error)
        );
  }
}

