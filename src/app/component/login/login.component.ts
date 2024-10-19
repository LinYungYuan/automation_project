import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  template: `
    <h2>會員登入</h2>
    <form (ngSubmit)="onSubmit()">
      <input type="text" [(ngModel)]="username" name="username" placeholder="用戶名" required>
      <input type="password" [(ngModel)]="password" name="password" placeholder="密碼" required>
      <button type="submit">登入</button>
    </form>
  `,
  standalone: true,
  imports: [FormsModule],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      success => {
        if (success) {
          this.router.navigate(['/chat']);
        } else {
          alert('登入失敗，請檢查您的用戶名和密碼。');
        }
      }
    );
  }
}
