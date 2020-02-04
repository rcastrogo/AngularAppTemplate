import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario, Proveedor, Vehiculo } from "../../models/index";
import { ArrayUtilsService } from "../../services/arrayUtils.service";

@Component({
  selector: 'app-vehiculos-page',
  templateUrl: './vehiculos-page.component.html'
})
export class VehiculosPageComponent {

  public vehiculos: Vehiculo[];
  public current: Vehiculo = { _id : 0, _matricula : '', _marca : '', _modelo : '', _fechaDeAlta : ''};
  public dialog: HTMLElement;
  public pagination: { title: string, data: Vehiculo[], page: number  };

  constructor(public http: HttpClient,
              @Inject('BASE_URL') public baseUrl: string) {

    this.pagination = { title: 'Vehículos', data : [], page: 1 };

    http.get<Vehiculo[]>(baseUrl + 'api/v1/vehiculos')
        .subscribe(
          result => {
            this.vehiculos = result;
            this.pagination.data = result;
          },
          error => console.error(error)
        );
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
    this.vehiculos = new ArrayUtilsService<Vehiculo>(this.vehiculos).sortBy(__field, this._desc);
  }

  doAddToFavorites(sender: HTMLButtonElement) {
    console.log('Add to favorites');
  }

  doAction(value: { name: string, data: any }) {

    if (value.name === 'last'     ||
        value.name === 'next'     ||
        value.name === 'previous' ||
        value.name === 'first'    ||
        value.name === 'check-item') return console.log(value.name);

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
        this.http
            .delete(this.baseUrl + 'api/v1/vehiculos/' + __targetId)
            .subscribe(
              result => {
                this.__remove(__target);
                this.pagination.data = this.vehiculos
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
          Matricula: (document.getElementById('txt-matricula') as HTMLInputElement).value,
          Marca: (document.getElementById('txt-marca') as HTMLInputElement).value,
          Modelo: (document.getElementById('txt-modelo') as HTMLInputElement).value
        };

        this.http.post(this.baseUrl + 'api/v1/vehiculos',
                        __payload,
                        { headers : new HttpHeaders({ 'Content-Type': 'application/json' }) }
                 )
                 .subscribe(
                   result => {
                     this.current = result as Vehiculo;
                     this.vehiculos.push(result as Vehiculo);
                     this.pagination.data = this.vehiculos
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
          Id        : (document.getElementById('txt-id') as HTMLInputElement).value,
          Matricula : (document.getElementById('txt-matricula') as HTMLInputElement).value,
          Marca     : (document.getElementById('txt-marca') as HTMLInputElement).value,
          Modelo    : (document.getElementById('txt-modelo') as HTMLInputElement).value
        };

        this.http.put(this.baseUrl + 'api/v1/vehiculos',
                      __payload,
                      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
                  )
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
