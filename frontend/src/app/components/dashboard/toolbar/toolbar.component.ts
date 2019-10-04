import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { NgbModal, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Food } from '../../../models/Food';
import { User } from '../../../models/User';
import { FoodService } from '../../../services/food.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { DayService } from '../../../services/day.service';
import { Day } from '../../../models/Day';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AddedFoodsService } from '../../../services/added-foods.service';
import { AuthService } from '../../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ConnectionService } from '../../../services/connection.service';
import { UserTargets } from 'src/app/models/UserTargets';
import { StatisticsService } from 'src/app/services/statistics.service';
import { Meal } from 'src/app/models/Meal';
import { SharedMealsService } from 'src/app/services/shared-meals.service';

declare var jsPDF: any;

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  showTargets: boolean;
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
  online: boolean;
  searchVisible = true;
  date: NgbDateStruct = null;
  savedDays: Day[] = [];
  savedMeals: Meal[] = [];
  selectedMeal: Meal;
  amountToAddPortions = 0;
  amountToAddGrams = 0;
  addToMeal: string;
  amountTotal = 0;
  kcalTotal = 0;
  proteinTotal = 0;
  carbTotal = 0;
  fatTotal = 0;
  allFoods: Food[] = [];
  public showMenu = false;
  public showDayMenu = false;
  public showMealMenu = false;

  private subscriptions = new Subscription();

  @Input()
  set user(user) {
    this._user.next(user);
  }

  get user() {
    return this._user.getValue();
  }

  @Output() hideSearch = new EventEmitter<any>();

  @ViewChild('addFoodForm')
  form: any;

  constructor(
    private modalService: NgbModal,
    private foodService: FoodService,
    private dayService: DayService,
    private flashMessage: FlashMessagesService,
    private addedFoodsService: AddedFoodsService,
    private auth: AuthService,
    private translate: TranslateService,
    private connectionService: ConnectionService,
    private statisticsServcice: StatisticsService,
    private calendar: NgbCalendar,
    private sharedMealsService: SharedMealsService
  ) {}

  ngOnInit() {
    this.subscriptions.add(this.connectionService.monitor().subscribe(res => (this.online = res)));
    this.subscriptions.add(
      this.addedFoodsService._showTargets.subscribe(show => {
        this.showTargets = show;
        if (!this.user) {
          this.subscriptions.add(
            this.auth.user.subscribe(user => {
              if (!user) {
                this._user.next(this.auth.getUserInfo());
              } else {
                this._user.next(user);
              }
            })
          );
        }
      })
    );
    this.subscriptions.add(
      this.dayService.getAllSavedDays().subscribe(days => {
        this.savedDays = days;
      })
    );
    this.subscriptions.add(
      this.foodService.allFoods.subscribe(foods => {
        this.allFoods = foods;
      })
    );
    this.getMeals();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  openAddFoodModal(content) {
    this.toggleMenu();
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
          this.subscriptions.add(
            this.foodService.saveNewFood(addedFood).subscribe(
              success => {
                if (success) {
                  this.flashMessage.show('Ruoka lisätty', {
                    cssClass: 'alert-success',
                    timeout: 2000
                  });
                  this.resetForm();
                  this.foodService.updateFoods();
                }
              },
              (error: Error) => {
                this.flashMessage.show(error['error'].msg, {
                  cssClass: 'alert-danger',
                  timeout: 2000
                });
              }
            )
          );
        } else {
          this.resetForm();
        }
      },
      dismissed => {}
    );
  }

  openSaveDayModal(content) {
    this.toggleMenu();
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
            userId: this.user.uuid,
            date: this.date !== null ? new Date(this.date.year, this.date.month - 1, this.date.day) : null
          };
          this.subscriptions.add(
            this.dayService.saveNewDay(newDay).subscribe(
              success => {
                if (success) {
                  this.flashMessage.show(this.translate.instant('DAY_SAVED'), {
                    cssClass: 'alert-success',
                    timeout: 2000
                  });
                  this.day.name = '';
                  this.toggleMenu();
                }
              },
              (error: Error) => {
                this.flashMessage.show(error['error'].msg, {
                  cssClass: 'alert-danger',
                  timeout: 2000
                });
              }
            )
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

    this.subscriptions.add(
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
      )
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
    this.toggleMenu();
    const day: Day = {
      userId: this.user.uuid,
      allMeals: this.addedFoodsService.getMeals()
    };
    this.subscriptions.add(
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
      )
    );
  }

  openLinkModal(content) {
    this.modalService.open(content, { centered: true }).result.then(result => {}, dismissed => {});
  }

  createPdf() {
    this.toggleMenu();
    const loaded = JSON.parse(localStorage.getItem('loadedDay'));
    this.subscriptions.add(
      this.statisticsServcice.CreatePDF({ user: this.user.uuid, day: loaded.id }).subscribe(() => {
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

        // window.open(doc.output('bloburl'), '_blank');
        doc.save();
      })
    );
  }

  hideSearchBar() {
    this.toggleMenu();
    this.searchVisible = !this.searchVisible;
    this.hideSearch.emit();
  }

  selectToday() {
    this.date = this.calendar.getToday();
  }

  public openSavedDay(uuid: string) {
    this.setPreviousMeals();
    this.subscriptions.add(
      this.dayService.getSavedDay(uuid).subscribe(
        day => {
          const userMeals: Meal[] = JSON.parse(JSON.stringify(this.user.meals));
          userMeals.forEach(m => {
            let found = false;
            for (let i = 0; i < day.allMeals.length; i++) {
              if (day.allMeals[i].name === m.name) {
                found = true;
                break;
              }
            }

            if (!found) {
              day.allMeals.push(m);
            }
          });

          localStorage.setItem('meals', JSON.stringify(day.allMeals));
          localStorage.setItem('loadedDay', JSON.stringify({ id: uuid, name: day.name }));
          this.dayService.loadedDayName.next(day.name);
          this.addedFoodsService._mealsEdited.next(false);
          this.addedFoodsService._openedSavedMeal.next(true);
          this.addedFoodsService.setMealsFromLocalStorage();
          this.modalService.dismissAll();
        },
        (error: Error) => {
          this.flashMessage.show(this.translate.instant('NETWORK_LOADING_ERROR'), {
            cssClass: 'alert-danger',
            timeout: 2000
          });
        }
      )
    );
  }

  private setPreviousMeals() {
    const loadedDay = JSON.parse(localStorage.getItem('loadedDay'));
    const meals: Meal[] = JSON.parse(localStorage.getItem('meals'));
    let foodsAdded = 0;
    meals.forEach(m => {
      foodsAdded += m.foods.length;
    });
    if (foodsAdded > 0) {
      let day = {
        id: '',
        name: '',
        meals: meals
      };

      if (loadedDay !== null) {
        day.id = loadedDay.id;
        day.name = loadedDay.name;
      }

      localStorage.setItem('previousMeals', JSON.stringify(day));
      this.addedFoodsService._previousMealsSavedToLocalStorage.next(true);
    }
  }

  openAddMealModal(content, meal: Meal) {
    this.toggleMenu();
    this.subscriptions.add(
      this.sharedMealsService.getSingleMeal(meal.uuid).subscribe(res => {
        this.selectedMeal = res;
        this.selectedMeal.foods.forEach(f => {
          this.amountTotal += f.amount;
          this.kcalTotal += f.energy;
          this.proteinTotal += f.protein;
          this.carbTotal += f.carbs;
          this.fatTotal += f.fat;
        });
      })
    );
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          const mealsFromLocalStorage: Meal[] = JSON.parse(localStorage.getItem('meals'));

          if (this.amountToAddPortions && this.selectedMeal.portions && !this.amountToAddGrams) {
            this.calculateFoodValuesWithPortions();
          } else if (!this.amountToAddPortions && this.amountToAddGrams) {
            this.calculateFoodValuesWithGrams();
          }

          for (let m of mealsFromLocalStorage) {
            if (m.name === this.addToMeal) {
              m.foods = m.foods.concat(this.selectedMeal.foods);
              break;
            }
          }
          localStorage.setItem('meals', JSON.stringify(mealsFromLocalStorage));
          this.addedFoodsService.setMealsFromLocalStorage();
          this.modalService.dismissAll();
        }
        this.resetAddMealVariables();
      },
      dismissed => {
        this.resetAddMealVariables();
      }
    );
  }

  private getMeals() {
    this.subscriptions.add(
      this.sharedMealsService.getMealsByUser().subscribe(
        meals => {
          meals.forEach(m => {
            if (!m.shared) {
              this.savedMeals.push(m);
            }
          });
        },
        (error: Error) => {
          this.flashMessage.show(this.translate.instant('NETWORK_LOADING_ERROR'), {
            cssClass: 'alert-danger',
            timeout: 2000
          });
        }
      )
    );
  }

  private calculateFoodValuesWithPortions() {
    if (this.amountToAddPortions > this.selectedMeal.portions || this.amountToAddPortions < this.selectedMeal.portions) {
      this.selectedMeal.foods.forEach(f => {
        f.energy = (f.energy / this.selectedMeal.portions) * this.amountToAddPortions;
        f.protein = (f.protein / this.selectedMeal.portions) * this.amountToAddPortions;
        f.carbs = (f.carbs / this.selectedMeal.portions) * this.amountToAddPortions;
        f.fat = (f.fat / this.selectedMeal.portions) * this.amountToAddPortions;
        f.fiber = (f.fiber / this.selectedMeal.portions) * this.amountToAddPortions;
        f.sugar = (f.sugar / this.selectedMeal.portions) * this.amountToAddPortions;
        f.amount = (f.amount / this.selectedMeal.portions) * this.amountToAddPortions;
      });
    }
  }

  private calculateFoodValuesWithGrams() {
    // How many percents is amountToAddInGrams from amountTotal
    const percentsOfTotal = (this.amountToAddGrams * 100) / this.amountTotal / 100;
    this.selectedMeal.foods.forEach(f => {
      const amount = f.amount * percentsOfTotal;
      const origFood = this.returnOriginalFoodValues(f.uuid, f.name);
      f.energy = origFood[0].energy * (amount / 100);
      f.protein = origFood[0].protein * (amount / 100);
      f.carbs = origFood[0].carbs * (amount / 100);
      f.fat = origFood[0].fat * (amount / 100);
      f.fiber = origFood[0].fiber * (amount / 100);
      f.sugar = origFood[0].sugar * (amount / 100);
      f.amount = amount;
    });
  }

  private returnOriginalFoodValues(id: string, name: string) {
    if (id) {
      return this.allFoods.filter(f => {
        if (f.uuid === id) {
          return f;
        }
      });
    } else {
      return this.allFoods.filter(f => {
        if (f.name === name) {
          return f;
        }
      });
    }
  }

  private resetAddMealVariables() {
    this.selectedMeal = undefined;
    this.amountTotal = 0;
    this.kcalTotal = 0;
    this.proteinTotal = 0;
    this.carbTotal = 0;
    this.fatTotal = 0;
    this.amountToAddPortions = 0;
    this.amountToAddGrams = 0;
  }

  public toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  public openGenericModal(content: any) {
    this.modalService.open(content, { centered: true }).result.then(result => {}, dismissed => {});
  }
}
