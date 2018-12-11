import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../../../models/Article';
import { User } from '../../../models/User';
import { BehaviorSubject } from 'rxjs';
import { ArticleService } from '../../../services/article.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  private _user = new BehaviorSubject<User>(null);
  private _article = new BehaviorSubject<Article>(null);
  image: Blob;

  @Input()
  set user(user) {
    this._user.next(user);
  }

  get user() {
    return this._user.getValue();
  }

  @Input()
  set article(q) {
    this._article.next(q);
  }

  get article() {
    return this._article.getValue();
  }

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    if (this.article.headerImgId) {
      this.articleService
        .getImageForArticle(this.article.headerImgId)
        .subscribe(res => {
          if (res) {
            this.createImageFromBlob(res);
          }
        });
    }
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.image = reader.result;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
