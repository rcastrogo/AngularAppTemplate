import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Proveedor } from '@app/models';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProveedorService {

  private _url = '{0}/api/v1/proveedores';
  
  constructor(@Inject('BASE_URL') baseUrl: string, public httpClient: HttpClient) {
    this._url = this._url.format(baseUrl);
  }

  public getAll(): Observable<Proveedor[]> {
    return this.httpClient.get<Proveedor[]>(this._url);  
  }

  public delete(id: Number): Observable<any> {
    return this.httpClient.delete('{0}/{1}'.format(this._url, id));
  }

  public post(target: Proveedor): Observable<Object> {  
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

  public put(target: Proveedor): Observable<Object> {
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
