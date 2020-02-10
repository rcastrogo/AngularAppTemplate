import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.css']
})
export class TableHeaderComponent implements OnInit {

  @(Output('onAction')) onAction = new EventEmitter();

  @(Input('pagination')) pagination: { title: string, data: any[], page: number };
  constructor() { }

  ngOnInit() {
  }

  public sendAction(action: { name: string, data: any }) {
    this.onAction.emit(action);
  }

  public goToPage(sender: HTMLInputElement) {
    console.log(sender.value);
    let __page = sender.value;
    this.sendAction( { name : 'page', data : __page});
  }

  public search(sender: HTMLInputElement) {
    this.sendAction( { name : 'search', data : sender.value});  
  }
}
