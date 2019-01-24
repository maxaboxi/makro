import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { VoteService } from '../../../services/vote.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../../../models/User';
import { Vote } from '../../../models/Vote';
import { TranslateService } from '@ngx-translate/core';

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
  loading = true;

  constructor(
    private auth: AuthService,
    private voteService: VoteService,
    private flashMessage: FlashMessagesService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (user.username) {
        this.voteService.getAllUserVotesWithId(this.user._id).subscribe(votes => {
          this.votes = votes;
          this.loading = false;
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
    this.voteService.removeVotes(this.deletedVotes).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.voteService.getAllUserVotesWithId(this.user._id).subscribe(votes => {
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
