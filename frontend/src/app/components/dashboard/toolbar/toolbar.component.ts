import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Food } from '../../../models/Food';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/User';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  user: User;
  food: Food = {
    name: '',
    energia: null,
    proteiini: null,
    hh: null,
    rasva: null,
    kuitu: null,
    sokeri: null,
    username: ''
  };
  constructor(private modalService: NgbModal, private auth: AuthService) {}

  @ViewChild('addFoodForm')
  form: any;

  ngOnInit() {
    this.user = this.auth.getUserInfo();
  }

  openModal(content) {
    this.modalService
      .open(content, { centered: true })
      .result.then(result => {}, dismissed => {});
  }
}
