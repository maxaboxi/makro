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
import { DayService } from '../../../services/day.service';
import { Day } from '../../../models/Day';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  user: User;
  day: Day = {
    username: '',
    name: '',
    meals: null
  };
  dayName = '';
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
    private dayService: DayService,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit() {
    this.user = this.auth.getUserInfo();
  }

  openAddFoodModal(content) {
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

  openSaveDayModal(content) {
    const meals = JSON.parse(localStorage.getItem('meals'));
    let foodsAdded = 0;
    meals.forEach(m => {
      foodsAdded += m.foods.length;
    });
    if (foodsAdded === 0) {
      this.flashMessage.show(
        'Vähintään yhden aterian pitää sisältää lisättyjä ruokia, jotta päivän voi tallentaa.',
        {
          cssClass: 'alert-danger',
          timeout: 2000
        }
      );
      return;
    }
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          const newDay: Day = {
            name: this.day.name,
            meals: JSON.parse(localStorage.getItem('meals')),
            username: this.user.username
          };
          this.dayService.saveNewDay(newDay).subscribe(
            success => {
              if (success) {
                this.flashMessage.show('Päivä tallennettu.', {
                  cssClass: 'alert-success',
                  timeout: 2000
                });
                this.day.name = '';
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
          this.day.name = '';
        }
      },
      dismissed => {
        this.day.name = '';
      }
    );
  }

  resetForm() {
    Object.keys(this.food).forEach(param => {
      this.food[param] = null;
    });
  }
}
