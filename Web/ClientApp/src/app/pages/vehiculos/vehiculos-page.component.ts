import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { utils, Paginator, DialogHelper } from '@extensions';
import { Vehiculo } from "@app/models/index";
import { VehiculoService } from '@app/services/api/';

const ROWS_PER_PAGE = 5;

@Component({
  selector: 'app-vehiculos-page',
  templateUrl: './vehiculos-page.component.html'
})
export class VehiculosPageComponent {
  
  public vehiculos: Vehiculo[];
  public current: Vehiculo;
  public paginationInfo: PaginationInfo;
    
  // ==========================================================================================
  // Constructor
  // ==========================================================================================
  constructor(public apiService: VehiculoService) {
    this.current = { _id : 0, _matricula : '', _marca : '', _modelo : '', _fechaDeAlta : ''};
    this.vehiculos = [];
    this.paginationInfo = Paginator.paginate(this.vehiculos, 1, ROWS_PER_PAGE, '');
    this.paginationInfo.title = 'Vehículos: Cargando datos...';
    this.loadData();
  }

  // ==========================================================================================
  // Carga de datos
  // ==========================================================================================
  loadData() {
    this.apiService
        .getAll()
        .subscribe(response => {
      this._sortBy = '_matricula';
      this.vehiculos = response.orderBy(this._sortBy);
      this.goToPage('first');
    });
  }

  // ============================================================================================
  // Paginación
  // ============================================================================================
  goToPage(page: string) {
    var __page = ~~page;
    if (page === 'current')  __page = this.paginationInfo.currentPage;
    if (page === 'first')    __page = 1;
    if (page === 'previous') __page = this.paginationInfo.currentPage - 1;
    if (page === 'next')     __page = this.paginationInfo.currentPage + 1;
    if (page === 'last')     __page = this.paginationInfo.totalPages;
    this.paginationInfo = Paginator.paginate(this.vehiculos, __page, ROWS_PER_PAGE, '');
    this.syncTitle();
  }

  syncTitle() {
    let __total      = this.paginationInfo.totalItems
    let __selected   = this.paginationInfo.getChecked().length;
    let __template   = 'Vehículos: {0} elementos'.format(__total);
    let __template_s = ' ({0} seleccionados)'.format(__selected);
    if (__selected) {
      this.paginationInfo.title = __template + __template_s;
    } else {
      this.paginationInfo.title = __template;
    }
  }

  goToPageOf(target: Vehiculo) {
    let __index = this.vehiculos.indexOf(target);
    if (__index > -1) {
      let __page = Math.floor(__index / this.paginationInfo.pageSize);
      this.goToPage((__page + 1).toString());
    }
  }

  // ============================================================================================
  // Ordenación
  // ============================================================================================
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

  // ============================================================================================
  // Borrado de elementos
  // ============================================================================================
  private delete() {

    let __checkedItems = this.paginationInfo.getChecked();

    if(__checkedItems.length == 0) return;

    let __target = <Vehiculo>__checkedItems[0].item;

    let __dlg = new DialogHelper().getDialogWrapper('dialog-container')        
                                  .setTitle('Borrado de vehículos')
                                  .setBody ('¿Está seguro de eliminar el vehículo seleccionado?')
                                  .show((dlg) => {
                                    this.apiService
                                        .delete(__target._id)
                                        .subscribe((result: Vehiculo) => {
                                          this.vehiculos.remove(__target);
                                          this.goToPage('current');
                                        },
                                        error => this.showError(error)
                                    );
                                    dlg.close();
                                  });
  };

  // ============================================================================================
  // Inserción de elementos
  // ============================================================================================
  private _dialog: HTMLElement;
  private insert() {

    this._dialog = this._dialog || <HTMLInputElement>utils.$('vehiculo-edit-dialog');
    this.current = { _id: 0, _matricula: '', _marca: '', _modelo: '', _fechaDeAlta: '' };

    let __dlg = new DialogHelper().getDialogWrapper('dialog-container')
                                  .setTitle('Nuevo vehículo')
                                  .setBody(this._dialog)
                                  .disableClickOutside()
                                  .show((dlg) => {
  
                                    let __payload = {
                                      _id          : 0,
                                      _matricula   : (<HTMLInputElement>utils.$('txt-matricula')).value,
                                      _marca       : (<HTMLInputElement>utils.$('txt-marca')).value,
                                      _modelo      : (<HTMLInputElement>utils.$('txt-modelo')).value,
                                      _fechaDeAlta : ''
                                    };

                                    this.apiService
                                        .post(__payload)
                                        .subscribe((result: Vehiculo) => {
                                          this.current = result;
                                          this.vehiculos.push(result);
                                          this.paginationInfo.visibleItems.push(result)
                                          this._dialog.style.display = 'none';
                                          dlg.close();                                        
                                          this.vehiculos = this.vehiculos.sortBy(this._sortBy, this._desc);
                                          this.goToPageOf(result);
                                        },
                                        error => this.showError(error)
                                        );
                                  });
    
    this._dialog.style.display = 'block';
  }

  // ============================================================================================
  // Edición de elementos
  // ============================================================================================
  private edit(target: Vehiculo) {

    this._dialog = this._dialog || <HTMLInputElement>utils.$('vehiculo-edit-dialog');
    this.current = target;

    let __dlg = new DialogHelper().getDialogWrapper('dialog-container')        
                                  .setTitle('Edición de vehículos')
                                  .setBody(this._dialog)
                                  .disableClickOutside()
                                  .show((dlg) => {
 
                                    let __payload = {
                                      _id          : ~~(<HTMLInputElement>utils.$('txt-id')).value,
                                      _matricula   : (<HTMLInputElement>utils.$('txt-matricula')).value,
                                      _marca       : (<HTMLInputElement>utils.$('txt-marca')).value,
                                      _modelo      : (<HTMLInputElement>utils.$('txt-modelo')).value,
                                      _fechaDeAlta : ''
                                    };

                                    this.apiService
                                        .put(__payload)
                                        .subscribe((result: Vehiculo) => {
                                          this.current._matricula = result._matricula;
                                          this.current._marca = result._marca;
                                          this.current._modelo = result._modelo;
                                          this._dialog.style.display = 'none';
                                          dlg.close();                                          
                                        },
                                          error => this.showError(error)
                                        );
                                  });
    this._dialog.style.display = 'block';

  }

  // ===========================================================
  // Acciones sobre los elementos, paginación, etc...
  // ===========================================================
  doAction(value: { name: string, data: any }) {   
    // =========================================================
    // Paginación
    // =========================================================
    if (value.name === 'page') return this.goToPage(value.data);
    if (value.name === 'first'    ||
        value.name === 'previous' ||
        value.name === 'next'     ||
        value.name === 'last') return this.goToPage(value.name);
    // =========================================================
    // Check/Uncheck
    // =========================================================
    if (value.name === 'check-item') {
      let target = this.paginationInfo.visibleItems[value.data];
      target.__checked = !target.__checked;
      this.syncTitle();
    }
    // =========================================================
    // Borrado
    // =========================================================
    if (value.name === 'delete') return this.delete();
    // =========================================================
    // Nuevo
    // =========================================================
    if (value.name === 'new') return this.insert();
    // =========================================================
    // Edición (Seleccionado)
    // =========================================================
    if (value.name === 'edit'){
      let __checkedItems = this.paginationInfo.getChecked();
      if(__checkedItems.length == 0) return;
      return this.edit(__checkedItems[0].item);
    }
    // =========================================================
    // Edición (link)
    // =========================================================
    if (value.name === 'edit-row'){
      let __id = ~~value.data;
      let __target = this.vehiculos.where({ _id : __id })[0];
      return this.edit(__target);
    }
    // =========================================================
    // Buscar
    // =========================================================
    if (value.name === 'search'){
      if (value.data) {
        this.vehiculos = this.vehiculos.where( v => v._marca
                                                     .toLowerCase()
                                                     .includes(value.data.toLowerCase()));
        return this.goToPage('first');
      }
      return this.loadData();
    }

  }

  showError(error: any) {

    let __dlg = new DialogHelper().getDialogWrapper('dialog-container')        
                                  .setTitle('Error')
                                  .setBody (error.message)
                                  .show();
    console.error(error); 
  }


}

