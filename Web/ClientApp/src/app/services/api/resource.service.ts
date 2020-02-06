import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ResourceService {

  private _url = '{0}/assets/';

  constructor(@Inject('BASE_URL') baseUrl: string, public httpClient: HttpClient) {
    this._url = this._url.format(baseUrl);
  }

  public getResource(resource: string): Observable<string> {
    return this.httpClient.get(this._url + resource, { responseType: "text" } ); 
  }

}
