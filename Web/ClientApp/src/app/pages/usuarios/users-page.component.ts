import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from "../../models/index";
import { ArrayUtilsService } from "../../services/arrayUtils.service";

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html'
})
export class UsersPageComponent {

  public usuarios: Usuario[];
  public pagination: { title: string, data: Usuario[], page: number };

  constructor(http: HttpClient,
              @Inject('BASE_URL') baseUrl: string) {

    this.pagination = { title: 'Usuarios', data: [], page: 1 };

    http.get<Usuario[]>(baseUrl + 'api/v1/usuarios')
        .subscribe(
          result => {
            this.usuarios = result;
            this.pagination.data = result;
          },
          error => console.error(error)
        );
  }

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
    this.usuarios = new ArrayUtilsService<Usuario>(this.usuarios).sortBy(__field, this._desc);
  }

  doAddToFavorites(sender: HTMLButtonElement) {
    console.log('Add to favorites');
  }

  doAction(value: { name: string, data: any }) {

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

