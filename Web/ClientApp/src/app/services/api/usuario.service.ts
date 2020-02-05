import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '@app/models';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UsuarioService {

  private _url = '{0}/api/v1/usuarios';

  constructor(@Inject('BASE_URL') baseUrl: string, public httpClient: HttpClient) {
    this._url = this._url.format(baseUrl);
  }

  public getAll(): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(this._url); 
  }

}
