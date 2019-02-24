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
    const url = `${this.baseUrl}/addnewarticle`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, article, { headers: headers });
  }

  addImageToArticle(image: File) {
    const url = `${this.baseUrl}/addimagetoarticle`;

    const formData = new FormData();
    formData.append('img', image);

    return this.http.post(url, formData, { headers: new HttpHeaders() });
  }

  editArticle(article: Article) {
    const url = `${this.baseUrl}/editarticle`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, article, { headers: headers });
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

  deleteArticleImages(images) {
    const url = `${this.baseUrl}/removearticleimages`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: images
    };

    return this.http.delete(url, options);
  }
}
