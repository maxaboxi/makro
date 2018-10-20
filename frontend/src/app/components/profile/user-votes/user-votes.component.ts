import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { QaService } from '../../../services/qa.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../../../models/User';
import { Vote } from '../../../models/Vote';

@Component({
  selector: 'app-user-votes',
  templateUrl: './user-votes.component.html',
  styleUrls: ['./user-votes.component.css']
})
export class UserVotesComponent implements OnInit {
  user: User;
  votes: Vote[] = [];
  deletedVotes = [];
  votesDeleted = false;

  constructor(
    private auth: AuthService,
    private qaService: QaService,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (user.username) {
        this.qaService.getAllUserVotesWithId(this.user._id).subscribe(votes => {
          this.votes = votes;
        });
      }
    });
  }

  deleteVote(index, vote) {
    this.deletedVotes.push(vote);
    this.votes.splice(index, 1);
    this.votesDeleted = true;
  }

  deleteVotesFromDb() {
    this.qaService.removeVotes(this.deletedVotes).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show('Muutokset tallennettu.', {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.qaService
            .getAllUserVotesWithId(this.user._id)
            .subscribe(votes => {
              this.votes = votes;
            });
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
