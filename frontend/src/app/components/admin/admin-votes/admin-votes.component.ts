import { Component, OnInit } from '@angular/core';
import { Vote } from '../../../models/Vote';
import { AdminService } from '../../../services/admin.service';
import { VoteService } from '../../../services/vote.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-admin-votes',
  templateUrl: './admin-votes.component.html',
  styleUrls: ['./admin-votes.component.css']
})
export class AdminVotesComponent implements OnInit {
  votes: Vote[];
  propertiesToShow = [
    { name: 'username', date: false },
    { name: 'createdAt', date: true },
    { name: 'content', date: false },
    { name: 'vote', date: false }
  ];
  deletedVotes = [];
  votesDeleted = false;

  constructor(
    private adminService: AdminService,
    private voteService: VoteService,
    private flashMessage: FlashMessagesService,
    private modalService: NgbModal,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.adminService.getAllVotes().subscribe(votes => (this.votes = votes));
  }

  deleteVote(index) {
    this.deletedVotes.push({ ...this.votes[index] });
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
          this.adminService.getAllVotes().subscribe(votes => (this.votes = votes));
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
