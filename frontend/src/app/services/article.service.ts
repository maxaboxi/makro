import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Article } from '../models/Article';
import { of, Observable } from 'rxjs';
import { Comment } from '../models/Comment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private baseUrl = `${environment.baseUrl}/article`;

  constructor(private http: HttpClient) {}

  getAllArticles() {
    const url = `${this.baseUrl}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Article[]>(url, { headers: headers });
  }

  getImageForArticle(imgId) {
    const url = `${this.baseUrl}/articleimage/${imgId}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get(url, { responseType: 'blob', headers: headers });
  }

  getArticlesByUser(user) {
    const url = `${this.baseUrl}/getarticles/${user}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Article[]>(url, { headers: headers });
  }

  getArticleById(id) {
    const url = `${this.baseUrl}/single/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Article>(url, { headers: headers });
  }

  addArticle(article: Article) {
    const url = `${this.baseUrl}/new`;

    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    const formData = new FormData();
    formData.append('headerImage', article.image);
    formData.append('title', article.title);
    formData.append('body', article.body);
    formData.append('tags', article.tags[0]);

    return this.http.post(url, formData, { headers: headers });
  }

  editArticle(article: Article) {
    const url = `${this.baseUrl}/update/${article.uuid}`;

    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    const formData = new FormData();
    formData.append('headerImage', article.image);
    formData.append('title', article.title);
    formData.append('body', article.body);
    formData.append('tags', article.tags[0]);
    formData.append('uuid', article.uuid);

    return this.http.put(url, formData, { headers: headers });
  }

  deleteArticle(id) {
    const url = `${this.baseUrl}/removearticle/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.delete(url, { headers: headers });
  }

  deleteArticles(articles) {
    const url = `${this.baseUrl}/removearticles`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: articles
    };

    return this.http.delete(url, options);
  }
}
