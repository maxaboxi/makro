import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ArticleService } from '../../services/article.service';
import { User } from '../../models/User';
import { Article } from '../../models/Article';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  user: User;
  articles: Article[];
  results: Article[] = [];
  searchTerm = '';
  loading = true;
  online;

  constructor(
    private auth: AuthService,
    private articleService: ArticleService,
    private flashMessage: FlashMessagesService,
    private translator: TranslateService,
    private connectionService: ConnectionService
  ) {}

  ngOnInit() {
    this.connectionService.monitor().subscribe(res => (this.online = res));
    this.auth.user.subscribe(user => (this.user = user));
    this.getAllArticles();
  }

  getAllArticles() {
    this.articleService.getAllArticles().subscribe(
      articles => {
        this.articles = articles;
        this.loading = false;
      },
      (error: Error) => {
        this.loading = false;
        this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
          cssClass: 'alert-danger',
          timeout: 2000
        });
      }
    );
  }

  searchArticles() {
    this.results = [];
    const secondaryResults = [];
    const tertiaryResults = [];
    const quaternaryResults = [];
    const st = this.searchTerm.toLowerCase();
    this.articles.forEach(a => {
      const titleLc = a.title.toLowerCase();
      const userLc = a.username.toLowerCase();
      if (titleLc === st) {
        this.results.push(a);
      } else if (st === titleLc.slice(0, st.length)) {
        this.results.push(a);
      } else {
        const containsWhitespaces = titleLc.indexOf(' ') > 1;
        let added = false;
        if (containsWhitespaces) {
          for (let i = 0; i < titleLc.length; i++) {
            if (st.length > 1 && titleLc[i] === ' ' && titleLc.slice(i + 1, i + 1 + st.length) === st) {
              secondaryResults.push(a);
              added = true;
            }
          }
        }

        if (!added && st.length > 1) {
          for (let tag of a.tags) {
            const tagLc = tag.toLowerCase();
            if (tagLc === st) {
              tertiaryResults.push(a);
              added = true;
              break;
            }
          }
        }

        if (!added && titleLc.indexOf(st) !== -1) {
          quaternaryResults.push(a);
          added = true;
        }

        if (!added && userLc.indexOf(st) !== -1) {
          quaternaryResults.push(a);
          added = true;
        }
      }
    });

    if (secondaryResults.length > 0) {
      this.results = this.results.concat(secondaryResults);
    }

    if (tertiaryResults.length > 0) {
      this.results = this.results.concat(tertiaryResults);
    }

    if (quaternaryResults.length > 0) {
      this.results = this.results.concat(quaternaryResults);
    }
  }
}
