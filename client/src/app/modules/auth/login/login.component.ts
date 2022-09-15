import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;


  constructor(private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private toastr: ToastrService) {

    // redirect to home if already logged in
    if (this.auth.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initLoginForm()
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern("\\b[\\w.%-]+@[-.\\w]+\\.[A-Za-z]{2,4}\\b")
      ])],
      password: ['', Validators.required],
    })
  }

  //form validation
  async onSubmit(form: FormGroup) {
    // // stop here if form is invalid
    if (form.invalid) {
      return form.markAllAsTouched()
    }
    try {
      const result = await this.auth.login(form.value)
      localStorage.setItem('currentUser', JSON.stringify(result))
      this.auth.currentUserSubject.next(result);
      this.router.navigate(['listings'])
    } catch (e) {
      console.log(e, 'error')
      // this.toastr.error(e)
    }

  }

  get f() { return this.loginForm.controls; }

}
