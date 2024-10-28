import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue() {
    return this.currentUserSubject.value;
  }
  login(username: string, password: string) {
    return this.http.post<any>(`http://localhost:8000/login`, { username, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
  getProfile() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.currentUserValue.access_token}`
    });
    return this.http.get<any>(`http://localhost:8000/users/me`, { headers });
  }
  updateProfile(profileData: any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.currentUserValue.access_token}`
    });
    return this.http.put<any>(`http://localhost:8000/users/me`, profileData, { headers });
  }
}
