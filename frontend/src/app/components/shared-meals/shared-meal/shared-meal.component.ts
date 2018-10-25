import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Meal } from '../../../models/Meal';
import { User } from '../../../models/User';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddedFoodsService } from '../../../services/added-foods.service';
import { Router } from '@angular/router';
import { Vote } from '../../../models/Vote';
import { QaService } from '../../../services/qa.service';

@Component({
  selector: 'app-shared-meal',
  templateUrl: './shared-meal.component.html',
  styleUrls: ['./shared-meal.component.css']
})
export class SharedMealComponent implements OnInit {
  private _meal = new BehaviorSubject<Meal>(null);
  private _user = new BehaviorSubject<User>(null);
  amountTotal = 0;
  kcalTotal = 0;
  proteinTotal = 0;
  carbTotal = 0;
  fatTotal = 0;
  selectedMeal: Meal;
  addToMeal = '';
  showRecipe = false;
  userVote;
  pointsTotal;

  @Input()
  set meal(meal) {
    this._meal.next(meal);
  }

  get meal() {
    return this._meal.getValue();
  }

  @Input()
  set user(user) {
    this._user.next(user);
  }

  get user() {
    return this._user.getValue();
  }

  constructor(
    private modalService: NgbModal,
    private addedFoodsService: AddedFoodsService,
    private qaService: QaService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.user && this.user._id) {
      this.fetchVotes();
    } else {
      // Wait a bit to get user.
      setTimeout(() => {
        this.fetchVotes();
      }, 500);
    }

    this.meal.foods.forEach(f => {
      this.amountTotal += f.amount;
      this.kcalTotal += f.energia;
      this.proteinTotal += f.proteiini;
      this.carbTotal += f.hh;
      this.fatTotal += f.rasva;
    });
    if (this.meal.pointsTotal) {
      this.pointsTotal = this.meal.pointsTotal;
    } else {
      this.pointsTotal = 0;
    }
  }

  fetchVotes() {
    this.qaService
      .getUserVoteWithId(this.user._id, this.meal._id)
      .subscribe(vote => {
        if (vote[0]) {
          if (vote[0].vote > 0) {
            this.userVote = 'up';
          } else {
            this.userVote = 'down';
          }
        }
      });
  }

  openAddMealModal(content, meal) {
    this.selectedMeal = meal;
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          const mealsFromLocalStorage: Meal[] = JSON.parse(
            localStorage.getItem('meals')
          );

          for (let m of mealsFromLocalStorage) {
            if (m.name === this.addToMeal) {
              m.foods = this.selectedMeal.foods;
              break;
            }
          }
          localStorage.setItem('meals', JSON.stringify(mealsFromLocalStorage));
          this.addedFoodsService.setMealsFromLocalStorage();
          this.router.navigate(['/']);
        }
        this.addToMeal = '';
        this.selectedMeal = undefined;
      },
      dismissed => {
        this.addToMeal = '';
        this.selectedMeal = undefined;
      }
    );
  }

  toggleShowRecipe() {
    this.showRecipe = !this.showRecipe;
  }

  vote(c) {
    let vote: Vote = {
      userId: this.user._id,
      username: this.user.username,
      postId: this.meal._id,
      category: 'SharedMeal',
      content: this.meal.name,
      vote: 0
    };
    if (!this.userVote) {
      if (c === '+') {
        vote.vote = 1;
        this.userVote = 'up';
        this.qaService.votePost(vote).subscribe(res => {
          if (res['success']) {
            this.pointsTotal += vote.vote;
          }
        });
      }

      if (c === '-') {
        vote.vote = -1;
        this.userVote = 'down';
        this.qaService.votePost(vote).subscribe(res => {
          if (res['success']) {
            this.pointsTotal += vote.vote;
          }
        });
      }
    } else {
      if (c === '+') {
        vote.vote = 2;
        this.userVote = 'up';
        this.qaService.replacePreviousVote(vote).subscribe(res => {
          if (res['success']) {
            this.pointsTotal += vote.vote;
          }
        });
      }

      if (c === '-') {
        vote.vote = -2;
        this.userVote = 'down';
        this.qaService.replacePreviousVote(vote).subscribe(res => {
          if (res['success']) {
            this.pointsTotal += vote.vote;
          }
        });
      }
    }
  }
}
