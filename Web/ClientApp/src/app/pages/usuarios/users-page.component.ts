import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { utils, Paginator } from '@extensions';
import { Usuario } from "@app/models/index";
import { UsuarioService } from '@app/services/api';

const ROWS_PER_PAGE = 2;

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html'
})
export class UsersPageComponent {

  public usuarios: Usuario[];
  public current: Usuario;
  public paginationInfo: PaginationInfo;

  // ============================================================================================
  // Constructor
  // ============================================================================================
  constructor(public apiService: UsuarioService, @Inject('APP_UTILS') public appUtils: UtilsConstructor) {
    this.current = { _id : 0, _nif : '', _nombre : '', _descripcion : '', _fechaDeAlta : ''};
    this.usuarios = [];
    this.paginationInfo = Paginator.paginate(this.usuarios, 1, ROWS_PER_PAGE, '');
    this.paginationInfo.title = 'Vehículos: Cargando datos...';
    // ===============================================
    // Carga de datos
    // ===============================================
    apiService.getAll().subscribe(response => {
      this._sortBy = '_nombre';
      this.usuarios = response.orderBy(this._sortBy);
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
    this.paginationInfo = Paginator.paginate(this.usuarios, __page, ROWS_PER_PAGE, '');
    this.paginationInfo.title = 'Usuarios: {0} elementos'.format(this.paginationInfo.totalItems)
  }

  // ============================================================================================
  // Ordenación
  // ============================================================================================
  private _sortBy = '';
  private _desc = false;
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
    this.usuarios.sortBy(__field, this._desc);
    this.goToPage('first');
  }

  doAddToFavorites(sender: HTMLButtonElement) {
    console.log('Current -> Id : {_id}, Nif : {_nif}'.merge(this.usuarios[0]));
    console.log(this.appUtils.isNumber(5));
    console.log(this.usuarios.select('_id'));
    console.log('Add to favorites {0}, {1}'.format(1, 2));
  }

  doAction(value: { name: string, data: any }) {

    // ============================================================================================
    // Paginación
    // ============================================================================================
    if (value.name === 'first'    ||
        value.name === 'previous' ||
        value.name === 'next'     ||
        value.name === 'last') return this.goToPage(value.name);
    // ============================================================================================
    // Check/Uncheck
    // ============================================================================================
    if (value.name === 'check-item') return console.log(value.name);

    let __dlg = this.__getDialogWrapper();
    __dlg.title.innerHTML = value.name;
    __dlg.body.innerHTML = value.name;
    __dlg.closeButton.onclick = __dlg.close;
    __dlg.acceptButton.onclick = () => console.log('AcceptButton');

    if (value.name === 'new') {
      __dlg.title.innerHTML = 'Nuevo usuario';
      __dlg.body.innerHTML = 'Introduzca los datos del nuevo usuario...';
    }

    if (value.name === 'delete') {
      __dlg.title.innerHTML = 'Borrar usuario';
      __dlg.body.innerHTML = '¿Está seguro de eliminar el usuario seleccionado?';
    }

    if (value.name === 'edit' || value.name === 'edit-row') {
      __dlg.title.innerHTML = 'Editar usuario';
      __dlg.body.innerHTML = 'Modifique los datos del usuario en cuestión y pulse el botón aceptar';
    }
    __dlg.show();
  }

  private __getDialogWrapper(): any {
    let __container = document.getElementById('dialog-container');
    return {
      container: __container,
      title: __container.querySelector('.js-title'),
      body: __container.querySelector('.js-content'),
      closeButton: __container.querySelector('.js-close-button'),
      acceptButton: __container.querySelector('.js-accept-button'),
      close: function () { __container.style.display = 'none'; },
      show: function () { __container.style.display = 'block'; }
    }
  }

}

