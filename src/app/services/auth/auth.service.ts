import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedInSubject.next(true);
    }
  }

  login(username: string, password: string): Observable<boolean> {
    // 這裡應該實現實際的登入邏輯，與後端 API 進行通信
    // 為了示例，我們假設登入總是成功
    localStorage.setItem('token', 'fake-jwt-token');
    this.isLoggedInSubject.next(true);
    return of(true);
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
  }

  getCurrentUser(): Observable<any> {
    // 這裡應該從後端獲取當前用戶信息
    return of({name: '測試用戶', email: 'test@example.com'});
  }

  updateProfile(user: any): Observable<boolean> {
    // 這裡應該向後端發送更新請求
    return of(true);
  }
}
