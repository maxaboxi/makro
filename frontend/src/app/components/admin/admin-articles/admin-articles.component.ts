import { Component, OnInit } from '@angular/core';
import { Article } from '../../../models/Article';
import { ArticleService } from '../../../services/article.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/User';

@Component({
  selector: 'app-admin-articles',
  templateUrl: './admin-articles.component.html',
  styleUrls: ['./admin-articles.component.css']
})
export class AdminArticlesComponent implements OnInit {
  user: User;
  articles: Article[];
  propertiesToShow = [{ name: 'username', date: false }, { name: 'title', date: false }, { name: 'createdAt', date: true }];
  deletedArticles = [];
  articlesDeleted = false;

  constructor(
    private articleService: ArticleService,
    private flashMessage: FlashMessagesService,
    private modalService: NgbModal,
    private translator: TranslateService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => (this.user = user));
    this.articleService.getAllArticles().subscribe(articles => (this.articles = articles));
  }

  deleteArticle(index) {
    this.deletedArticles.push(this.articles[index].uuid);
    this.articles.splice(index, 1);
    this.articlesDeleted = true;
  }

  deleteArticlesFromDb() {
    this.articleService.deleteArticles(this.deletedArticles).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.articleService.getAllArticles().subscribe(articles => {
            this.articles = articles;
          });
          this.articlesDeleted = false;
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
