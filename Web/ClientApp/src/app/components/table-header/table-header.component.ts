import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.css']
})
export class TableHeaderComponent implements OnInit {

  @(Output('onAction')) onAction = new EventEmitter();

  @(Input('pagination')) pagination: { title: string };
  constructor() { }

  ngOnInit() {
  }

  public sendAction(action: { name: string, data: any }) {
    this.onAction.emit(action);
  }

}
