import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Vehiculo } from '@app/models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class VehiculoService {

  private _url = '{0}/api/v1/vehiculos';

  constructor(@Inject('BASE_URL') baseUrl: string, public httpClient: HttpClient) {
    this._url = this._url.format(baseUrl);
  }

  public getAll(): Observable<Vehiculo[]> {
    if (environment.production) {
      return this.httpClient.get<Vehiculo[]>("./assets/json/vehiculos.json");
    }
    return this.httpClient.get<Vehiculo[]>(this._url); 
  }

  public delete(id: Number): Observable<any> {
    return this.httpClient.delete('{0}/{1}'.format(this._url, id));
  }

  public post(target: Vehiculo): Observable<Object> {  
    return this.httpClient
               .post(this._url,
                     {
                       Id: target._id,
                       Matricula: target._matricula,
                       Marca: target._marca,
                       Modelo: target._modelo
                     },
                     { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  public put(target: Vehiculo): Observable<Object> {
    return this.httpClient
      .put(this._url,
           {
             Id: target._id,
             Matricula: target._matricula,
             Marca: target._marca,
             Modelo: target._modelo
           },
           { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

}
