import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.css']
})
export class DataListComponent implements OnInit {
  _data = new BehaviorSubject([]);
  _propertiesToShow = new BehaviorSubject([]);

  @Input()
  set data(d) {
    this._data.next(d);
  }

  get data() {
    return this._data.getValue();
  }

  @Input()
  set propertiesToShow(p) {
    this._propertiesToShow.next(p);
  }

  get propertiesToShow() {
    return this._propertiesToShow.getValue();
  }

  @Output()
  open = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  openModal(item) {
    this.open.emit(item);
  }
}
