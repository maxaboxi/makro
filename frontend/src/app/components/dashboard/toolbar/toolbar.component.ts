import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Food } from '../../../models/Food';
import { User } from '../../../models/User';
import { FoodService } from '../../../services/food.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { DayService } from '../../../services/day.service';
import { Day } from '../../../models/Day';
import { BehaviorSubject } from 'rxjs';
import { AddedFoodsService } from '../../../services/added-foods.service';
import { AuthService } from '../../../services/auth.service';
import { Meal } from '../../../models/Meal';
import { TranslateService } from '@ngx-translate/core';
import { ConnectionService } from '../../../services/connection.service';
import { UserTargets } from 'src/app/models/UserTargets';

declare var jsPDF: any;

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  showTargets;
  _user = new BehaviorSubject<User>(null);
  day: Day = {
    userId: '',
    name: '',
    allMeals: null
  };
  dayName = '';
  food: Food = {
    name: '',
    energy: null,
    protein: null,
    carbs: null,
    fat: null,
    fiber: null,
    sugar: null,
    servingSize: null,
    packageSize: null,
    username: ''
  };
  shareLink = '';
  online;

  @Input()
  set user(user) {
    this._user.next(user);
  }

  get user() {
    return this._user.getValue();
  }

  @ViewChild('addFoodForm')
  form: any;

  @Output()
  changed = new EventEmitter<any>();

  constructor(
    private modalService: NgbModal,
    private foodService: FoodService,
    private dayService: DayService,
    private flashMessage: FlashMessagesService,
    private addedFoodsService: AddedFoodsService,
    private auth: AuthService,
    private translate: TranslateService,
    private connectionService: ConnectionService
  ) {}

  ngOnInit() {
    this.connectionService.monitor().subscribe(res => (this.online = res));
    this.addedFoodsService._showTargets.subscribe(show => {
      this.showTargets = show;
      if (!this.user) {
        this.auth.user.subscribe(user => {
          if (!user) {
            this._user.next(this.auth.getUserInfo());
          } else {
            this._user.next(user);
          }
        });
      }
    });
  }

  openAddFoodModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          const addedFood: Food = {
            name: this.food.name,
            energy: this.food.energy,
            protein: this.food.protein,
            carbs: this.food.carbs,
            fat: this.food.fat,
            fiber: this.food.fiber ? this.food.fiber : 0,
            sugar: this.food.sugar ? this.food.sugar : 0,
            packageSize: this.food.packageSize ? this.food.packageSize : 0,
            servingSize: this.food.servingSize ? this.food.servingSize : 0,
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
      this.flashMessage.show(this.translate.instant('NO_FOODS_IN_MEALS_ERROR'), {
        cssClass: 'alert-danger',
        timeout: 2000
      });
      return;
    }
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          const newDay: Day = {
            name: this.day.name,
            allMeals: meals,
            userId: this.user.uuid
          };
          this.dayService.saveNewDay(newDay).subscribe(
            success => {
              if (success) {
                this.flashMessage.show(this.translate.instant('DAY_SAVED'), {
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

  openTargetModal(content) {
    const originalExpenditure = this.user.userAddedExpenditure;
    const originalProteinTarget = this.user.userAddedProteinTarget;
    const originalCarbTarget = this.user.userAddedCarbTarget;
    const originalFatTarget = this.user.userAddedFatTarget;
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.updateUserInfo();
        } else if (result === 'reset') {
          this.user.userAddedExpenditure = 0;
          this.user.userAddedProteinTarget = 0;
          this.user.userAddedCarbTarget = 0;
          this.user.userAddedFatTarget = 0;
          this.updateUserInfo();
        } else {
          this.user.userAddedExpenditure = originalExpenditure;
          this.user.userAddedProteinTarget = originalProteinTarget;
          this.user.userAddedCarbTarget = originalCarbTarget;
          this.user.userAddedFatTarget = originalFatTarget;
        }
      },
      dismissed => {
        this.user.userAddedExpenditure = originalExpenditure;
        this.user.userAddedProteinTarget = originalProteinTarget;
        this.user.userAddedCarbTarget = originalCarbTarget;
        this.user.userAddedFatTarget = originalFatTarget;
      }
    );
  }

  updateUserInfo() {
    const targets: UserTargets = {
      userAddedExpenditure: this.user.userAddedExpenditure,
      userAddedFatTarget: this.user.userAddedFatTarget,
      userAddedProteinTarget: this.user.userAddedProteinTarget,
      userAddedCarbTarget: this.user.userAddedCarbTarget
    };

    this.auth.updateUserTargets(targets).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translate.instant('INFORMATION_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.addedFoodsService.setTargets();
        }
      },
      (error: Error) => {
        this.flashMessage.show(error['error'].msg, {
          cssClass: 'alert-danger',
          timeout: 2000
        });
      }
    );
  }

  resetForm() {
    Object.keys(this.food).forEach(param => {
      this.food[param] = null;
    });
  }

  toggleTargets() {
    this.addedFoodsService.setShowTargets();
  }

  generateLink(content) {
    const day: Day = {
      userId: this.user.uuid,
      allMeals: this.addedFoodsService.getMeals()
    };
    this.dayService.shareDay(day).subscribe(
      res => {
        if (res['success']) {
          this.shareLink = `https://makro.diet/?id=${res['message']}`;
          this.openLinkModal(content);
          this.auth.user.unsubscribe();
        }
      },
      (error: Error) => {
        this.flashMessage.show(this.translate.instant('GENERAL_ERROR_MSG'), {
          cssClass: 'alert-danger',
          timeout: 3000
        });
      }
    );
  }

  openLinkModal(content) {
    this.modalService.open(content, { centered: true }).result.then(result => {}, dismissed => {});
  }

  createPdf() {
    const d = new Date();
    const date = `${d.getDay()}.${d.getMonth()}.${d.getFullYear()} - ${d.getHours()}.${d.getMinutes()}.${d.getSeconds()}`;
    const doc = new jsPDF('p', 'pt');
    const totalsTable = document.getElementById('totals');
    const mealElement = document.getElementById('meals');
    const foodTables = mealElement.getElementsByTagName('table');

    const totals = doc.autoTableHtmlToJson(totalsTable);
    totals.columns[0]['innerHTML'] = this.translate.instant('TOTAL');
    if (totals.columns[7]) {
      totals.columns[7]['innerHTML'] = this.translate.instant('AMOUNT');
    } else {
      totals.columns[5]['innerHTML'] = this.translate.instant('AMOUNT');
    }
    doc.autoTable(totals.columns, totals.data, {
      startY: 30,
      columnStyles: {
        0: { columnWidth: 200, overflow: 'linebreak' }
      }
    });

    Array.from(foodTables).forEach(t => {
      const res = doc.autoTableHtmlToJson(t);
      if (res.columns[5]) {
        res.columns[5]['innerHTML'] = this.translate.instant('AMOUNT');
      } else {
        res.columns[2]['innerHTML'] = this.translate.instant('AMOUNT');
      }

      const first = doc.autoTable.previous;
      doc.autoTable(res.columns, res.data, {
        startY: first.finalY + 10,
        pageBreak: 'avoid',
        columnStyles: {
          0: { columnWidth: 200, overflow: 'linebreak' }
        }
      });
    });

    window.open(doc.output('bloburl'), '_blank');
  }
}
