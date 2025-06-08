import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Token, User } from './interface';
import { admin, Menu } from '@core';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { of } from 'rxjs';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(protected http: HttpClient) {
  }

  login(username: string, password: string) {
    //return this.http.post<Token>('localhost:8080/api/v1/auth/signin', { username, password });
    return this.http.post<Token>(`${apiUrl}/v1/auth/signin`, { username, password });
  }

  login_old(username: string, password: string, rememberMe = false) {
    return this.http.post<Token>('/auth/login', { username, password, rememberMe });
  }

  refresh(params: Record<string, any>) {
    return this.http.post<Token>('/auth/refresh', params);
  }

  logout() {
    return this.http.post<any>('/auth/logout', {});
  }

  me() {
    console.log('me');
    admin.username = localStorage.getItem('username') || '';
    admin.name = localStorage.getItem('username') || '';
    admin.id = localStorage.getItem('id_usuario_insysred') || '';
    return of(admin);
  }

  menu() {
    return this.http
      .get<{ menu: Menu[] }>('assets/data/menu.json?_t=' + Date.now())
      .pipe(map(res => res.menu));
  }
}
