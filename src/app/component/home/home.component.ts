import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  template: `
    <h1>歡迎來到 AI 聊天應用</h1>
    <button *ngIf="!isLoggedIn" (click)="login()">會員登入</button>
    <button *ngIf="isLoggedIn" (click)="logout()">登出</button>
  `
})
export class HomeComponent {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.isLoggedIn$.subscribe(status => this.isLoggedIn = status);
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
  }
}
