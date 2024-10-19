import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  template: `
    <h2>個人資料</h2>
    <form (ngSubmit)="updateProfile()" #profileForm="ngForm">
      <input type="text" [(ngModel)]="user.name" name="name" placeholder="姓名" required>
      <input type="email" [(ngModel)]="user.email" name="email" placeholder="電子郵件" required email>
      <button type="submit" [disabled]="!profileForm.form.valid">更新資料</button>
    </form>
  `,
  standalone: true,
  imports: [FormsModule],
})
export class ProfileComponent implements OnInit {
  user: any = {};

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(
      user => this.user = user
    );
  }

  updateProfile() {
    this.authService.updateProfile(this.user).subscribe(
      success => {
        if (success) {
          alert('資料更新成功！');
        } else {
          alert('資料更新失敗，請稍後再試。');
        }
      }
    );
  }
}
