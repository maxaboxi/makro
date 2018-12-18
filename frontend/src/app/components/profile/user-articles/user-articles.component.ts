import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/User';
import { Article } from '../../../models/Article';
import { AuthService } from '../../../services/auth.service';
import { ArticleService } from '../../../services/article.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-user-articles',
  templateUrl: './user-articles.component.html',
  styleUrls: ['./user-articles.component.css']
})
export class UserArticlesComponent implements OnInit {
  user: User;
  articles: Article[] = [];
  deletedArticles = [];
  articlesDeleted = false;

  constructor(
    private auth: AuthService,
    private articleService: ArticleService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (user.username) {
        this.articleService.getArticlesByUser(user.username).subscribe(articles => {
          this.articles = articles;
        });
      }
    });
  }

  deleteArticle(index) {
    this.deletedArticles.push(this.articles[index]._id);
    this.articles.splice(index, 1);
    this.articlesDeleted = true;
  }

  deleteArticlesFromDb() {
    this.articleService.deleteArticles(this.deletedArticles).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show('Muutokset tallennettu.', {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.articleService.getArticlesByUser(this.user.username).subscribe(articles => {
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

  editArticle(index) {
    this.router.navigate(['/articles/addarticle'], {
      queryParams: { _id: this.articles[index]._id }
    });
  }
}