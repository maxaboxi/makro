import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ArticleService } from '../../services/article.service';
import { User } from '../../models/User';
import { Article } from '../../models/Article';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  user: User;
  articles: Article[];

  constructor(
    private auth: AuthService,
    private articleService: ArticleService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => (this.user = user));
    this.articleService
      .getAllArticles()
      .subscribe(articles => (this.articles = articles));
  }
}
