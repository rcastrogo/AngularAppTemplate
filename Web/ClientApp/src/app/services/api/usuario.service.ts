import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '@app/models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class UsuarioService {

  private _url = '{0}/api/v1/usuarios';

  constructor(@Inject('BASE_URL') baseUrl: string, public httpClient: HttpClient) {
    this._url = this._url.format(baseUrl);
  }

  public getAll(): Observable<Usuario[]> {
    //if (environment.production) {
    //  return this.httpClient.get<Usuario[]>("./assets/json/usuarios.json");
    //}
    return this.httpClient.get<Usuario[]>(this._url); 
  }

  public delete(id: Number): Observable<any> {
    return this.httpClient.delete('{0}/{1}'.format(this._url, id));
  }

  public post(target: Usuario): Observable<Object> {  
    return this.httpClient
               .post(this._url,
                     {
                       Id          : target._id,
                       Nif         : target._nif,
                       Nombre      : target._nombre,
                       Descripcion : target._descripcion
                     },
                     { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  public put(target: Usuario): Observable<Object> {
    return this.httpClient
      .put(this._url,
           {
             Id          : target._id,
             Nif         : target._nif,
             Nombre      : target._nombre,
             Descripcion : target._descripcion
           },
           { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

}
