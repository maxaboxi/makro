import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Food } from '../../../models/Food';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/User';
import { FoodService } from '../../../services/food.service';
import { FlashMessagesService } from 'angular2-flash-messages';

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
    packageSize: null,
    username: ''
  };

  @ViewChild('addFoodForm')
  form: any;

  @Output()
  changed = new EventEmitter<any>();

  constructor(
    private modalService: NgbModal,
    private auth: AuthService,
    private foodService: FoodService,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit() {
    this.user = this.auth.getUserInfo();
  }

  openModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          const addedFood: Food = {
            name: this.food.name,
            energia: this.food.energia,
            proteiini: this.food.proteiini,
            hh: this.food.hh,
            rasva: this.food.rasva,
            kuitu: this.food.kuitu ? this.food.kuitu : 0,
            sokeri: this.food.sokeri ? this.food.sokeri : 0,
            packageSize: this.food.packageSize ? this.food.packageSize : 0,
            username: this.user.username
          };
          this.foodService.saveNewFood(addedFood).subscribe(
            success => {
              if (success) {
                this.flashMessage.show('Ruoka lisätty', {
                  cssClass: 'alert-success',
                  timeout: 2000
                });
                this.resetForm();
                this.changed.emit();
              }
            },
            (error: Error) => {
              this.flashMessage.show(error['error'].msg, {
                cssClass: 'alert-danger',
                timeout: 2000
              });
            }
          );
        } else {
          this.resetForm();
        }
      },
      dismissed => {
        this.resetForm();
      }
    );
  }

  resetForm() {
    Object.keys(this.food).forEach(param => {
      this.food[param] = null;
    });
  }
}
