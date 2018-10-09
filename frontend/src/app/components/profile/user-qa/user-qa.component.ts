import { Component, OnInit } from '@angular/core';
import { QaService } from '../../../services/qa.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/User';
import { Answer } from '../../../models/Answer';
import { Question } from '../../../models/Question';
import { Vote } from '../../../models/Vote';
import { Comment } from '../../../models/Comment';

@Component({
  selector: 'app-user-qa',
  templateUrl: './user-qa.component.html',
  styleUrls: ['./user-qa.component.css']
})
export class UserQaComponent implements OnInit {
  user: User;
  answers: Answer[];
  votes: Vote[];
  comments: Comment[];

  constructor(private auth: AuthService, private qaService: QaService) {}

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (user.username) {
        this.qaService
          .getAllUserAnswersWithUsername(this.user.username)
          .subscribe(answers => {
            this.answers = answers;
          });
        this.qaService.getAllUserVotesWithId(this.user._id).subscribe(votes => {
          this.votes = votes;
        });
        this.qaService
          .getAllUserCommentsWithId(this.user._id)
          .subscribe(comments => {
            this.comments = comments;
          });
      }
    });
  }
}
