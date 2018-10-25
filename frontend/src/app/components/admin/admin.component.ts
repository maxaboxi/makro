import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FoodService } from '../../services/food.service';
import { DayService } from '../../services/day.service';
import { FeedbackService } from '../../services/feedback.service';
import { Feedback } from '../../models/Feedback';
import { User } from '../../models/User';
import { Day } from '../../models/Day';
import { Food } from '../../models/Food';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../../services/admin.service';
import { SharedMealsService } from '../../services/shared-meals.service';
import { Meal } from '../../models/Meal';
import { Vote } from '../../models/Vote';
import { QaService } from '../../services/qa.service';
import { Question } from '../../models/Question';
import { Answer } from '../../models/Answer';
import { Comment } from '../../models/Comment';
import { VoteService } from '../../services/vote.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  user: User;
  users: User[];
  days: Day[];
  foods: Food[];
  votes: Vote[];
  questions: Question[];
  answers: Answer[];
  comments: Comment[];
  feedbacks: Feedback[];
  sharedMeals: Meal[];
  searchTerm = '';
  results = [];
  selectedFood: Food;
  selectedFeedback: Feedback;
  selectedUser: User;
  selectedDay: Day;
  selectedSharedMeal: Meal;
  deletedFoods = [];
  foodsDeleted = false;
  deletedDays = [];
  daysDeleted = false;
  deletedUsers = [];
  usersDeleted = false;
  deletedFeedbacks = [];
  feedbacksDeleted = false;
  newUserPassword;
  newUserPasswordAgain;
  deletedSharedMeals = [];
  sharedMealsDeleted = false;
  sharedDays = [];
  deletedSharedDays = [];
  sharedDaysDeleted = false;
  deletedVotes = [];
  votesDeleted = false;
  deletedQuestions = [];
  questionsDeleted = false;
  deletedAnswers = [];
  answersDeleted = false;
  deletedComments = [];
  commentsDeleted = false;

  constructor(
    private auth: AuthService,
    private flashMessage: FlashMessagesService,
    private foodService: FoodService,
    private dayService: DayService,
    private feedbackService: FeedbackService,
    private adminService: AdminService,
    private modalService: NgbModal,
    private sharedMealsService: SharedMealsService,
    private qaService: QaService,
    private voteService: VoteService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => (this.user = user));
    this.foodService.getAllFoods().subscribe(foods => (this.foods = foods));
    this.feedbackService
      .getAllFeedbacks()
      .subscribe(feedbacks => (this.feedbacks = feedbacks));
    this.adminService.getAllUsers().subscribe(users => (this.users = users));
    this.adminService.getAllDays().subscribe(days => (this.days = days));
    this.sharedMealsService
      .getAllMeals()
      .subscribe(meals => (this.sharedMeals = meals));
    this.adminService.getAllSharedDays().subscribe(days => {
      this.sharedDays = JSON.parse(JSON.stringify(days));
    });
    this.qaService
      .getAllQuestions()
      .subscribe(questions => (this.questions = questions));
    this.adminService
      .getAllAnswers()
      .subscribe(answers => (this.answers = answers));
    this.adminService
      .getAllComments()
      .subscribe(comments => (this.comments = comments));
    this.adminService.getAllVotes().subscribe(votes => (this.votes = votes));
  }

  searchFoods() {
    this.results = [];
    const secondaryResults = [];
    const st = this.searchTerm.toLowerCase();
    this.foods.forEach(f => {
      const fLc = f.name.toLowerCase();
      if (fLc === st) {
        this.results.push(f);
      } else if (st === fLc.slice(0, st.length)) {
        this.results.push(f);
      } else {
        const containsWhitespaces = fLc.indexOf(' ') > 1;
        const containsBrackets = fLc.indexOf('(') > 1;
        if (containsWhitespaces && !containsBrackets) {
          for (let i = 0; i < fLc.length; i++) {
            if (
              st.length > 1 &&
              fLc[i] === ' ' &&
              fLc.slice(i + 1, i + 1 + st.length) === st
            ) {
              secondaryResults.push(f);
            }
          }
        }
        if (containsWhitespaces && containsBrackets) {
          for (let i = 0; i < fLc.length; i++) {
            if (
              st.length > 1 &&
              fLc[i] === '(' &&
              fLc.slice(i + 1, i + 1 + st.length) === st
            ) {
              secondaryResults.push(f);
            }
          }
        }
      }
    });

    if (secondaryResults.length > 0) {
      this.results = this.results.concat(secondaryResults);
    }
  }

  openUserModal(content, user) {
    this.selectedUser = user;
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          if (this.newUserPassword && this.newUserPasswordAgain) {
            if (this.newUserPassword !== this.newUserPasswordAgain) {
              this.flashMessage.show(
                'Salasanat eivät täsmänneet. Muutoksia ei tallennettu.',
                {
                  cssClass: 'alert-danger',
                  timeout: 2000
                }
              );
              this.newUserPassword = null;
              this.newUserPasswordAgain = null;
            } else {
              const user = {
                _id: this.selectedUser._id,
                password: this.newUserPassword
              };
              this.adminService.updateUserPassword(user).subscribe(
                res => {
                  if (res['success']) {
                    this.flashMessage.show('Käyttäjän salasana vaihdettu', {
                      cssClass: 'alert-success',
                      timeout: 2000
                    });
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
          } else {
            this.adminService
              .updateUserInformation(this.selectedUser)
              .subscribe(
                res => {
                  if (res['success']) {
                    this.flashMessage.show('Käyttäjän tiedot päivitetty', {
                      cssClass: 'alert-success',
                      timeout: 2000
                    });
                    this.adminService
                      .getAllUsers()
                      .subscribe(users => (this.users = users));
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
        }
        this.selectedUser = null;
      },
      dismissed => {
        this.selectedUser = null;
      }
    );
  }

  openFoodModal(content, food) {
    this.selectedFood = food;
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.foodService.editFood(this.selectedFood).subscribe(
            res => {
              if (res['success']) {
                this.flashMessage.show('Muutokset tallennettu', {
                  cssClass: 'alert-success',
                  timeout: 2000
                });
                this.foodService
                  .getAllFoods()
                  .subscribe(foods => (this.foods = foods));
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
        this.selectedFood = null;
      },
      dismissed => {
        this.selectedFood = null;
      }
    );
  }

  openFeedbackModal(content, feedback) {
    this.selectedFeedback = feedback;
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.selectedFeedback.answerUsername = this.user.username;
          this.adminService.submitAnswer(this.selectedFeedback).subscribe(
            res => {
              if (res['success']) {
                this.flashMessage.show('Muutokset tallennettu.', {
                  cssClass: 'alert-success',
                  timeout: 2000
                });
                this.feedbackService
                  .getAllFeedbacks()
                  .subscribe(feedbacks => (this.feedbacks = feedbacks));
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
        this.selectedFeedback = null;
      },
      dismissed => {
        this.selectedFeedback = null;
      }
    );
  }

  openDayModal(content, day) {
    this.selectedDay = day;
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        this.selectedDay = null;
      },
      dismissed => {
        this.selectedDay = null;
      }
    );
  }

  deleteFood(index) {
    this.deletedFoods.push(this.foods[index]._id);
    this.foods.splice(index, 1);
    this.foodsDeleted = true;
  }

  deleteFoodsFromDb() {
    this.foodService.removeFoods(this.deletedFoods).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show('Muutokset tallennettu', {
            cssClass: 'alert-success',
            timeout: 2000
          });
        }
        this.deletedFoods = [];
        this.foodsDeleted = false;
        this.foodService.getAllFoods().subscribe(foods => (this.foods = foods));
      },
      (error: Error) => {
        this.flashMessage.show(error['error'].msg, {
          cssClass: 'alert-danger',
          timeout: 2000
        });
      }
    );
  }

  deleteDay(index) {
    this.deletedDays.push(this.days[index]._id);
    this.days.splice(index, 1);
    this.daysDeleted = true;
  }

  deleteDaysFromDb() {
    this.dayService.removeDays(this.deletedDays).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show('Muutokset tallennettu.', {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.deletedDays = [];
          this.daysDeleted = false;
          this.adminService.getAllDays().subscribe(days => (this.days = days));
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

  deleteUser(index) {
    this.deletedUsers.push(this.users[index]._id);
    this.users.splice(index, 1);
    this.usersDeleted = true;
  }

  deleteUsersFromDb() {
    this.adminService.removeUsers(this.deletedUsers).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show('Muutokset tallennettu.', {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.deletedUsers = [];
          this.usersDeleted = false;
          this.adminService
            .getAllUsers()
            .subscribe(users => (this.users = users));
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

  deleteFeedback(index) {
    this.deletedFeedbacks.push(this.feedbacks[index]._id);
    this.feedbacks.splice(index, 1);
    this.feedbacksDeleted = true;
  }

  deleteFeedbacksFromDb() {
    this.adminService.removeFeedbacks(this.deletedFeedbacks).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show('Muutokset tallennettu.', {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.deletedFeedbacks = [];
          this.feedbacksDeleted = false;
          this.feedbackService
            .getAllFeedbacks()
            .subscribe(feedbacks => (this.feedbacks = feedbacks));
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

  deleteSharedMeal(index) {
    this.deletedSharedMeals.push(this.sharedMeals[index]._id);
    this.sharedMeals.splice(index, 1);

    this.sharedMealsDeleted = true;
  }

  deleteSharedMealsFromDb() {
    this.sharedMealsService.removeMeals(this.deletedSharedMeals).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show('Muutokset tallennettu.', {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.sharedMealsService
            .getAllMeals()
            .subscribe(meals => (this.sharedMeals = meals));
          this.sharedMealsDeleted = false;
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

  deleteSharedDay(index) {
    this.deletedSharedDays.push(this.sharedDays[index]._id);
    this.sharedDays.splice(index, 1);
    this.sharedDaysDeleted = true;
  }

  deleteSharedDaysFromDb() {
    this.dayService.removeSharedDays(this.deletedDays).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show('Muutokset tallennettu.', {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.adminService.getAllSharedDays().subscribe(days => {
            this.sharedDays = JSON.parse(JSON.stringify(days));
          });
          this.sharedDaysDeleted = false;
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

  deleteQuestion(index) {
    this.deletedQuestions.push(this.questions[index]._id);
    this.questions.splice(index, 1);
    this.questionsDeleted = true;
  }

  deleteQuestionsFromDb() {
    this.qaService.removeQuestions(this.deletedQuestions).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show('Muutokset tallennettu.', {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.qaService
            .getAllQuestions()
            .subscribe(questions => (this.questions = questions));
          this.questionsDeleted = false;
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

  deleteAnswer(index) {
    this.deletedAnswers.push(this.answers[index]._id);
    this.answers.splice(index, 1);
    this.answersDeleted = true;
  }

  deleteAnswersFromDb() {
    this.qaService.removeAnswers(this.deletedAnswers).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show('Muutokset tallennettu.', {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.adminService
            .getAllAnswers()
            .subscribe(answers => (this.answers = answers));
          this.answersDeleted = false;
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

  deleteComment(index) {
    this.deletedComments.push(this.comments[index]._id);
    this.comments.splice(index, 1);
    this.commentsDeleted = true;
  }

  deleteCommentsFromDb() {
    this.qaService.removeComments(this.deletedComments).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show('Muutokset tallennettu.', {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.adminService
            .getAllComments()
            .subscribe(comments => (this.comments = comments));
          this.commentsDeleted = false;
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

  deleteVote(index, vote) {
    this.deletedVotes.push(vote);
    this.votes.splice(index, 1);
    this.votesDeleted = true;
  }

  deleteVotesFromDb() {
    this.voteService.removeVotes(this.deletedVotes).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show('Muutokset tallennettu.', {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.adminService
            .getAllVotes()
            .subscribe(votes => (this.votes = votes));
          this.votesDeleted = false;
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
}
