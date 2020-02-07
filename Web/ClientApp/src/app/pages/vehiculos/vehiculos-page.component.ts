import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { utils } from '@extensions';
import { Vehiculo } from "@app/models/index";
import { VehiculoService } from '@app/services/api/';

@Component({
  selector: 'app-vehiculos-page',
  templateUrl: './vehiculos-page.component.html'
})
export class VehiculosPageComponent {

  public pInfo: { totalItems   : number,
                  currentPage  : number,
                  pageSize     : number,
                  totalPages   : number,
                  startPage    : number,
                  endPage      : number,
                  startIndex   : number,
                  endIndex     : number,
                  pages        : number[] };

  public vehiculos: Vehiculo[];
  public current: Vehiculo = { _id : 0, _matricula : '', _marca : '', _modelo : '', _fechaDeAlta : ''};
  public dialog: HTMLElement;
  public pagination: { title: string, data: Vehiculo[], page: number };

  constructor(public apiService: VehiculoService) {

    this.pagination = { title: 'Vehículos', data : [], page: 1 };

    apiService.getAll().subscribe(response => {
      this._sortBy = '_matricula';
      this.vehiculos = response.orderBy(this._sortBy);
      this.goToPage(1);
    });

  }

  goToPage(page: string) {

    var p = ~~page;

    if (page === 'first')    p = 1;
    if (page === 'previous') p = this.pInfo.currentPage - 1;
    if (page === 'next')     p = this.pInfo.currentPage + 1;
    if (page === 'last')     p = this.pInfo.totalPages;

    this.pInfo = new Paginator().paginate(this.vehiculos.length, p, 4);
    this.pagination.data = this.vehiculos.slice(this.pInfo.startIndex, this.pInfo.endIndex + 1);
    this.pagination.page = this.pInfo.currentPage;
    this.pagination.title = 'Vehículos: {pInfo.totalItems} elementos'.format(this);
    console.log(this.pInfo.pages);
  }

  private _sortBy = '';
  private _desc = false;
  doSort(mouseEvent) {
    let __field = ['_id',
                   '_matricula',
                   '_marca',
                   '_modelo',
                   '_fechaDeAlta'][mouseEvent.target.cellIndex - 1];
    if (this._sortBy && this._sortBy == __field) {
      this._desc = !this._desc;
    } else {
      this._desc = false;
    }
    this._sortBy = __field;
    this.vehiculos = this.vehiculos.sortBy(__field, this._desc);
    this.goToPage('first');
  }

  doAddToFavorites(sender: HTMLButtonElement) { 
    console.log('Current -> Id : {_id}, Matrícula : {_matricula}'.merge(this.current));
    console.log(utils.isNumber(5));
    console.log(this.vehiculos.select('_id'));
    console.log('Add to favorites {0}, {1}'.format(1, 2));
  }

  doAction(value: { name: string, data: any }) {

    if (value.name === 'first'    ||
        value.name === 'previous' ||
        value.name === 'next'     ||
        value.name === 'last') return this.goToPage(value.name);

    if (value.name === 'check-item') return console.log(value.name);

    this.dialog = this.dialog || document.getElementById('vehiculo-edit-dialog');

    let __dlg = this.__getDialogWrapper();
    __dlg.body.innerHTML       = '';
    __dlg.closeButton.onclick  = __dlg.close;
    __dlg.acceptButton.onclick = __dlg.close;
    __dlg.container.onclick    = function (sender) {
      if (sender.target === __dlg.container) __dlg.close();
    }

    if (value.name === 'delete') {

      let __checked  = document.querySelectorAll('tr input:checked')[0];
      let __targetId = ~~(__checked.parentNode.parentNode as HTMLElement).id.split('-')[1];
      let __target   = this.vehiculos.filter(v => v._id == __targetId)[0];

      __dlg.title.innerHTML = 'Borrar vehículo';
      __dlg.body.innerHTML = '¿Está seguro de eliminar el vehículo seleccionado?';
      __dlg.show();
      __dlg.acceptButton.onclick = () => {
        __dlg.close();

        this.apiService
            .delete(__targetId)
            .subscribe(
              result => {
                this.__remove(__target);
                this.goToPage(this.pInfo.currentPage);
                __dlg.close();
              },
              error => console.error(error)
        );

      };
      return;
    }

    if (value.name === 'new') {
      this.current = { _id: 0, _matricula: '', _marca: '', _modelo: '', _fechaDeAlta: '' };
      this.dialog.style.display = 'block';
      __dlg.title.innerHTML = 'Nuevo vehículo';
      __dlg.body.appendChild(this.dialog);
      __dlg.show();
      
      __dlg.acceptButton.onclick = () => {

        let __payload = {
          _id: 0,
          _matricula: (document.getElementById('txt-matricula') as HTMLInputElement).value,
          _marca: (document.getElementById('txt-marca') as HTMLInputElement).value,
          _modelo: (document.getElementById('txt-modelo') as HTMLInputElement).value,
          _fechaDeAlta : ''
        };

        this.apiService
            .post(__payload)
                  .subscribe(
                    result => {
                      this.current = result as Vehiculo;
                      // TODO: sincronizar paginación
                      this.vehiculos.push(result as Vehiculo);
                      this.pagination.data.push(result as Vehiculo)

                      __dlg.close();
                    },
                    error => console.error(error)
                  );
      };
      return;
    }

    if (value.name === 'edit' || value.name === 'edit-row') {
      this.dialog.style.display = 'block';
      __dlg.title.innerHTML = 'Editar vehículo';
      if (value.name === 'edit-row') {
        let __targetId = ~~value.data.target.parentNode.parentNode.id.split('-')[1];
        this.current = this.vehiculos.filter(v => v._id == __targetId)[0];
      } else {
        let __checked = document.querySelectorAll('tr input:checked')[0];
        var __targetId = ~~(__checked.parentNode.parentNode as HTMLElement).id.split('-')[1];
        this.current = this.vehiculos.filter(v => v._id == __targetId)[0];
      } 
      __dlg.body.appendChild(this.dialog);
      __dlg.show();

      __dlg.acceptButton.onclick = () => {

        let __payload = {
          _id        : ~~(document.getElementById('txt-id') as HTMLInputElement).value,
          _matricula : (document.getElementById('txt-matricula') as HTMLInputElement).value,
          _marca     : (document.getElementById('txt-marca') as HTMLInputElement).value,
          _modelo: (document.getElementById('txt-modelo') as HTMLInputElement).value,
          _fechaDeAlta : ''
        };

        this.apiService
            .put(__payload)
            .subscribe(
              result => {                  
                  this.current._matricula = (result as Vehiculo)._matricula;
                  this.current._marca = (result as Vehiculo)._marca;
                  this.current._modelo = (result as Vehiculo)._modelo;
                  __dlg.close();
              },
              error => console.error(error)
            );
      };
    }

  }

  private __getDialogWrapper() : any {
    let __container = document.getElementById('dialog-container');
    return { container   : __container,
             title       : __container.querySelector('.js-title'),
             body        : __container.querySelector('.js-content'),
             closeButton : __container.querySelector('.js-close-button'),
             acceptButton: __container.querySelector('.js-accept-button'),
             close : function(){ __container.style.display = 'none'; },
             show  : function (){ __container.style.display = 'block'; }
           }
  }

  private __remove(target: Vehiculo) {
    const index = this.vehiculos.indexOf(target);
    if (index != -1) this.vehiculos.splice(index, 1);
  }

}

class Paginator {

  paginate(totalItems: number,
           currentPage: number = 1,
           pageSize: number = 10,
           maxPages: number = 10) {

    let startPage: number, endPage: number;
    let totalPages = Math.ceil(totalItems / pageSize);
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    if (totalPages <= maxPages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
      let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
      if (currentPage <= maxPagesBeforeCurrentPage) {
          startPage = 1;
          endPage = maxPages;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
          startPage = totalPages - maxPages + 1;
          endPage = totalPages;
      } else {
          startPage = currentPage - maxPagesBeforeCurrentPage;
          endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }

    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    return { totalItems   : totalItems,
             currentPage  : currentPage,
             pageSize     : pageSize,
             totalPages   : totalPages,
             startPage    : startPage,
             endPage      : endPage,
             startIndex   : startIndex,
             endIndex     : endIndex,
             pages        : Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i)
           };
  }

}
