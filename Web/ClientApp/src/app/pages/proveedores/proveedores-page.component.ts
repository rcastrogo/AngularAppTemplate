import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { utils, Paginator, DialogHelper } from '@extensions';
import { Proveedor } from "@app/models/index";
import { ProveedorService } from '@app/services/api/';

const ROWS_PER_PAGE = 2;

@Component({
  selector: 'app-proveedores-page',
  templateUrl: './proveedores-page.component.html'
})
export class ProveedoresPageComponent {

  public proveedores: Proveedor[];
  public current: Proveedor;
  public paginationInfo: PaginationInfo;

  // ============================================================================================
  // Constructor
  // ============================================================================================
  constructor(public apiService: ProveedorService) {
    this.current = { _id : 0, _nif : '', _nombre : '', _descripcion : '', _fechaDeAlta : ''};
    this.proveedores = [];
    this.paginationInfo = Paginator.paginate(this.proveedores, 1, ROWS_PER_PAGE, '');
    this.paginationInfo.title = 'Proveedores: Cargando datos...';
    this.loadData();
  }

  // ============================================================================================
  // Carga de datos
  // ============================================================================================
  loadData() {
    this.apiService
        .getAll()
        .subscribe(response => {
      this._sortBy = '_nombre';
      this.proveedores = response.orderBy(this._sortBy);
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
    this.paginationInfo = Paginator.paginate(this.proveedores, __page, ROWS_PER_PAGE, '');
    this.syncTitle();
  }

  syncTitle() {
    let __total      = this.paginationInfo.totalItems
    let __selected   = this.paginationInfo.getChecked().length;
    let __template   = 'Proveedores: {0} elementos'.format(__total);
    let __template_s = ' ({0} seleccionados)'.format(__selected);
    if (__selected) {
      this.paginationInfo.title = __template + __template_s;
    } else {
      this.paginationInfo.title = __template;
    }
  }

  goToPageOf(target: Proveedor) {
    let __index = this.proveedores.indexOf(target);
    if (__index > -1) {
      let __page = Math.floor(__index / this.paginationInfo.pageSize);
      this.goToPage((__page + 1).toString());
    }
  }

  // ============================================================================================
  // Ordenación
  // ============================================================================================
  private _sortBy = '';
  private _desc   = false;
  doSort(mouseEvent) {
    let __field = ['_id',
                   '_nif',
                   '_nombre',
                   '_descripcion',
                   '_fechaDeAlta'][mouseEvent.target.cellIndex - 1];
    if (this._sortBy && this._sortBy == __field) {
      this._desc = !this._desc;
    } else {
      this._desc = false;
    }
    this._sortBy = __field;
    this.proveedores = this.proveedores.sortBy(__field, this._desc);
    this.goToPage('first');
  }

  doAddToFavorites(sender: HTMLButtonElement) {
    console.log('Current -> Id : {_id}, Nif : {_nif}'.merge(this.proveedores[0])); 
    console.log(utils.isNumber(5));
    console.log(this.proveedores.select('_id'));
    console.log('Add to favorites {0}, {1}'.format(1, 2));
  }

  // ============================================================================================
  // Borrado de elementos
  // ============================================================================================
  private delete() {

    let __checkedItems = this.paginationInfo.getChecked();

    if(__checkedItems.length == 0) return;

    let __target = <Proveedor>__checkedItems[0].item;

    let __dlg = new DialogHelper().getDialogWrapper('dialog-container')        
                                  .setTitle('Borrar proveedores')
                                  .setBody ('¿Está seguro de eliminar el proveedor seleccionado?')
                                  .show((dlg) => {
                                    this.apiService
                                        .delete(__target._id)
                                        .subscribe((result: Proveedor) => {
                                          this.proveedores.remove(__target);
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

    this._dialog = this._dialog || <HTMLInputElement>utils.$('proveedor-edit-dialog');
    this.current = { _id: 0, _nif: '', _nombre: '', _descripcion: '', _fechaDeAlta: '' };

    let __dlg = new DialogHelper().getDialogWrapper('dialog-container')
                                  .setTitle('Nuevo vehículo')
                                  .setBody(this._dialog)
                                  .disableClickOutside()
                                  .show((dlg) => {
  
                                    let __payload = {
                                      _id          : 0,
                                      _nif         : (<HTMLInputElement>utils.$('txt-nif')).value,
                                      _nombre      : (<HTMLInputElement>utils.$('txt-nombre')).value,
                                      _descripcion : (<HTMLInputElement>utils.$('txt-descripcion')).value,
                                      _fechaDeAlta : ''
                                    };

                                    this.apiService
                                        .post(__payload)
                                        .subscribe((result: Proveedor) => {
                                          this.current = result;
                                          this.proveedores.push(result);
                                          this.paginationInfo.visibleItems.push(result)
                                          this._dialog.style.display = 'none';
                                          dlg.close();                                        
                                          this.proveedores = this.proveedores.sortBy(this._sortBy, this._desc);
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
  private edit(target: Proveedor) {

    this._dialog = this._dialog || <HTMLInputElement>utils.$('proveedor-edit-dialog');
    this.current = target;

    let __dlg = new DialogHelper().getDialogWrapper('dialog-container')        
                                  .setTitle('Edición de proveedores')
                                  .setBody(this._dialog)
                                  .disableClickOutside()
                                  .show((dlg) => {
 
                                    let __payload = {
                                      _id          : ~~(<HTMLInputElement>utils.$('txt-id')).value,
                                      _nif         : (<HTMLInputElement>utils.$('txt-nif')).value,
                                      _nombre      : (<HTMLInputElement>utils.$('txt-nombre')).value,
                                      _descripcion : (<HTMLInputElement>utils.$('txt-descripcion')).value,
                                      _fechaDeAlta : ''
                                    };

                                    this.apiService
                                        .put(__payload)
                                        .subscribe((result: Proveedor) => {
                                          this.current._nif = result._nif;
                                          this.current._nombre = result._nombre;
                                          this.current._descripcion = result._descripcion;
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
      let __target = this.proveedores.where({ _id : __id })[0];
      return this.edit(__target);
    }
    // =========================================================
    // Buscar
    // =========================================================
    if (value.name === 'search'){
      if (value.data) {
        this.proveedores = this.proveedores.where( p => p._nombre
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


