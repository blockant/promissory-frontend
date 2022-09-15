import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   currentUserSubject!: BehaviorSubject<any>;
  public currentUser!: Observable<any>;
  constructor(private router: Router,
    private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')!));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(user: object) {
    return this.http.post(environment.API_URL + 'users/login', user).toPromise()
  }


  createUser(user: Object) {
    return this.http.post(environment.API_URL + 'users', user).toPromise()
  }

  getUsers() {
    return this.http.get(environment.API_URL + 'users').toPromise()
  }

  getUserByRole(role: string) {
    return this.http.get(environment.API_URL + `users?role=${role}`).toPromise()
  }

  logout() {
    localStorage.removeItem('currentUser');
        this.router.navigate(['/auth/login'])
    this.currentUserSubject.next(null);
  }

  getCurrentUser() {
    let currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      return JSON.parse(currentUser)
    } else {
      return false
    }
  }
}
