import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { utils } from '@extensions';
import { Usuario, Proveedor } from "@app/models/index";
import { ProveedorService } from '@app/services/api/';

@Component({
  selector: 'app-proveedores-page',
  templateUrl: './proveedores-page.component.html'
})
export class ProveedoresPageComponent {

  public proveedores: Proveedor[];
  public pagination: { title: string, data: Proveedor[], page: number };

  constructor(public apiService: ProveedorService) {

    this.pagination = { title: 'Proveedores', data: [], page: 1 };

    apiService.getAll().subscribe(response => {
      this._sortBy = '_nombre';
      this.proveedores = response.orderBy(this._sortBy);
      this.pagination.data = this.proveedores;
    });

  }

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
  }

  doAddToFavorites(sender: HTMLButtonElement) {
    console.log('Current -> Id : {_id}, Nif : {_nif}'.merge(this.proveedores[0])); 
    console.log(utils.isNumber(5));
    console.log(this.proveedores.select('_id'));
    console.log('Add to favorites {0}, {1}'.format(1, 2));
  }

  doAction(value: { name: string, data: any }) {

    let __dlg = this.__getDialogWrapper();
    __dlg.title.innerHTML = value.name;
    __dlg.body.innerHTML = value.name;
    __dlg.closeButton.onclick = __dlg.close;
    __dlg.acceptButton.onclick = () => console.log('AcceptButton');

    if (value.name === 'new') {
      __dlg.title.innerHTML = 'Nuevo proveedor';
      __dlg.body.innerHTML = 'Introduzca los datos del nuevo proveedor...';
    }

    if (value.name === 'delete') {
      __dlg.title.innerHTML = 'Borrar proveedor';
      __dlg.body.innerHTML = '¿Está seguro de eliminar el proveedor seleccionado?';
    }

    if (value.name === 'edit' || value.name === 'edit-row') {
      __dlg.title.innerHTML = 'Editar proveedor';
      __dlg.body.innerHTML = 'Modifique los datos del proveedor en cuestión y pulse el botón aceptar';
    }
    if (value.name === 'check-item') {
      console.log('check-item');
      return
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


