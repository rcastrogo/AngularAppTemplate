import { Component, OnInit, OnDestroy } from '@angular/core';

import { utils } from '@extensions';
import { TabblyService } from '@app/services/tabbly.service';
import { VehiculoService,
         UsuarioService,
         ProveedorService,
         ResourceService } from '@app/services/api/';
import { environment } from '../../../../environments/environment';
import { StaticInjector } from '@angular/core/src/di/injector';

@Component({
  selector: 'app-tabbly-reports-page',
  templateUrl: './tabbly-reports-page.component.html',
  styleUrls: ['./tabbly-reports-page.component.css']
})
export class TabblyReportsPageComponent implements OnInit, OnDestroy {

  private _tabblyService: TabblyService;
  public reportFile: string;
  public reportData:string;

  constructor(public vehiculosApiService: VehiculoService,
              public usuariosApiService: UsuarioService,
              public proveedoresApiService: ProveedorService,
              public resourceService: ResourceService
  ) { }

  ngOnInit() {
    this._tabblyService = new TabblyService();
    this.listVehiculos();
    this.initWorker();
  }

  ngOnDestroy() {
    if(this._worker) this._worker.terminate();
  }

  public listUsuarios() {

    var __container = <HTMLDivElement>utils.$('table-container');
    var __rowsContainer = <HTMLDivElement>utils.$('rowsContainer');

    this.resourceService
        .getResource('tabbly-reports/usu-0001.txt')
        .subscribe(result => {
          this.reportFile = result;
          var __rd  = this._tabblyService.parse(result);
          this.usuariosApiService.getAll().subscribe(
            data => {
              this.reportData = JSON.stringify(data, undefined, 2);
              this._tabblyService.fromReportDefinition(__rd, data, (html: string) => {       
                __container.innerHTML = html;
                __rowsContainer.innerHTML = ''
              });
            })
        });

  }

  public listProveedores() {

    var __container = <HTMLDivElement>utils.$('table-container');
    var __rowsContainer = <HTMLDivElement>utils.$('rowsContainer');

    this.resourceService
        .getResource('tabbly-reports/pro-0001.txt')
        .subscribe(result => {
          this.reportFile = result;
          var __rd  = this._tabblyService.parse(result);
          this.proveedoresApiService.getAll().subscribe(
            data => {
              this.reportData = JSON.stringify(data, undefined, 2);
              this._tabblyService.fromReportDefinition(__rd, data, (html: string) => {       
                __container.innerHTML     = html;
                __rowsContainer.innerHTML = ''
              });
            })
        });

  }

  public listVehiculos() {

    var __container = <HTMLDivElement>utils.$('table-container');
    var __rowsContainer = <HTMLDivElement>utils.$('rowsContainer');
    

    this.resourceService
        .getResource('tabbly-reports/veh-0001.txt')
        .subscribe(result => {
          this.reportFile = result;
          var __rd  = this._tabblyService.parse(result);
          this.vehiculosApiService.getAll().subscribe(
            data => {
              this.reportData = JSON.stringify(data, undefined, 2);
              this._tabblyService.fromReportDefinition(__rd, data, (html: string) => {       
                __container.innerHTML = html;
                if(__rd.context.onEndfn) __rd.context.onEndfn({ data      : data,
                                                                container : __rowsContainer,
                                                                utils     : utils });  
              });
            })
        });

  }

  private _worker: Worker;
  private initWorker() {
    let __script = './assets/web-worker-reports.worker.js?t{0}'.format(new Date().getTime());
    let __messageHandler = new MessageHandler()
    this._worker = new Worker(__script);
    this._worker.onmessage = ({data}) => {
      let __data = JSON.parse(data);
      if (__data.type && __data.type === 'report.data.ready') {
        this.reportData = JSON.stringify(__data, undefined, 2);
        return;
      }
      __messageHandler.handle(__data);
    };
  }

  public runWebWorker() {
    if (this._worker) {
      var __container = <HTMLDivElement>utils.$('table-container');
      var __rowsContainer = <HTMLDivElement>utils.$('rowsContainer');
      let __message = { action : 'load-report',
                        report : { source  : './web-worker-reports/pro-0001.js',
                                   data    : environment.production ? './json/proveedores.json'
                                                                    : '../api/v1/proveedores',
                                   method  : 'get' } };
      this._worker.postMessage(__message);
      __container.innerHTML = '';
      __rowsContainer.innerHTML = '';
      this.reportData = '';
      this.reportFile = ''
    }
  }

  public openTab(event, tabName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("tab");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" w3-dark-grey", "");
    }
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " w3-dark-grey";
  };

}

class MessageHandler {

  private _container: HTMLElement;
  private _progressBarContainer: HTMLElement;
  private _progressBarMessage: HTMLElement;
  private _progressBar: HTMLElement;

  constructor() {
    this._container            = <HTMLElement>utils.$('table-container');
    this._progressBarContainer = <HTMLElement>utils.$('progress-bar-container');
    this._progressBarMessage   = <HTMLElement>utils.$('progress-bar-message');
    this._progressBar          = <HTMLElement>utils.$('progress-bar');
    this._container.innerHTML  = '';
  }

  private build(e: string, o: string){
    var __e = document.createElement(e);
    if(o) __e.innerHTML = o;
    return __e;
  }

  public handle(message: any) {
    // report.content
    if(message.type === 'report.content'){
      this._container.appendChild(this.build('div', message.content)
                                      .firstChild); 
      return;  
    }
    // report.log.message
    if(message.type === 'report.log.message'){
      this._progressBarMessage.innerHTML = message.text || '';
      return;  
    }
    // report.begin
    if(message.type === 'report.begin'){
      this._container.innerHTML = '';
      this._progressBarContainer.style.display = 'block'
      this._progressBarMessage.innerHTML = '';
      this._progressBar.style.width = '0%';
      return;  
    }     
    // report.render.rows
    if(message.type === 'report.render.rows'){
      this._progressBar.style.width = '0%';
    }
    // report.render.row
    if(message.type === 'report.render.row'){
      this._progressBar.style.width = '{0}%'.format(message.value.toFixed(1));
      this._progressBar.innerHTML = message.text || '';
    }
    // report.sections.group.header
    // report.sections.group.footer
    // report.sections.detail
    // report.sections.total
    // report.sections.header
    // report.sections.group.change
    // report.render.end
    // report.end
    if(message.type === 'report.end'){
      setTimeout( () => { 
        this._progressBar.style.width = '100%';
        this._progressBarMessage.innerHTML = '';
        this._progressBarContainer.style.display = 'none'
      }, 250);
      return;  
    }
     
  }

}
