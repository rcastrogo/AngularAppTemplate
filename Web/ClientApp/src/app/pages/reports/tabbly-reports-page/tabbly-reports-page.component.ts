import { Component, OnInit } from '@angular/core';

import { utils } from '@extensions';
import { TabblyService } from '@app/services/tabbly.service';
import { VehiculoService,
         UsuarioService,
         ProveedorService,
         ResourceService } from '@app/services/api/';

@Component({
  selector: 'app-tabbly-reports-page',
  templateUrl: './tabbly-reports-page.component.html',
  styleUrls: ['./tabbly-reports-page.component.css']
})
export class TabblyReportsPageComponent implements OnInit {

  private _tabblyService: TabblyService;
  constructor(public vehiculosApiService: VehiculoService,
              public usuariosApiService: UsuarioService,
              public proveedoresApiService: ProveedorService,
              public resourceService: ResourceService
  ) { }

  ngOnInit() {
    this._tabblyService = new TabblyService();
    this.listVehiculos();
  }

  public listUsuarios() {

    var __container = <HTMLDivElement>utils.$('table-container');

    this.resourceService
        .getResource('tabbly-reports/usu-0001.txt')
        .subscribe(result => {
          var __rd  = this._tabblyService.parse(result);
          this.usuariosApiService.getAll().subscribe(
            data => {
              this._tabblyService.fromReportDefinition(__rd, data, (html: string) => {       
                __container.innerHTML = html;
              });
            })
        });

  }

  public listProveedores() {

    var __container = <HTMLDivElement>utils.$('table-container');

    this.resourceService
        .getResource('tabbly-reports/pro-0001.txt')
        .subscribe(result => {
          var __rd  = this._tabblyService.parse(result);
          this.proveedoresApiService.getAll().subscribe(
            data => {
              this._tabblyService.fromReportDefinition(__rd, data, (html: string) => {       
                __container.innerHTML = html;
              });
            })
        });

  }

  public listVehiculos() {

    var __container = <HTMLDivElement>utils.$('table-container');

    this.resourceService
        .getResource('tabbly-reports/veh-0001.txt')
        .subscribe(result => {
           var __rd  = this._tabblyService.parse(result);
          this.vehiculosApiService.getAll().subscribe(
            data => {
              this._tabblyService.fromReportDefinition(__rd, data, (html: string) => {       
                __container.innerHTML = html;
              });
            })
        });

  }

}
