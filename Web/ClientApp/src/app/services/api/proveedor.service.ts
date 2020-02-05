import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

}
