import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  template: `
    <h2>User Profile</h2>
    <form (ngSubmit)="onSubmit()">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" [(ngModel)]="profile.username" name="username" readonly>
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" [(ngModel)]="profile.email" name="email" required>
      </div>
      <button type="submit">Update Profile</button>
    </form>
  `,
  standalone: true,
  imports: [FormsModule],
})
export class ProfileComponent implements OnInit {
  profile: any = {};

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getProfile().subscribe(
      profile => this.profile = profile,
      error => console.error('Failed to load profile', error)
    );
  }

  onSubmit() {
    this.authService.updateProfile(this.profile).subscribe(
      updatedProfile => {
        this.profile = updatedProfile;
        console.log('Profile updated successfully');
      },
      error => console.error('Failed to update profile', error)
    );
  }
}