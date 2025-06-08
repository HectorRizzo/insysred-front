import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { AuthService } from '@core/authentication';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isSubmitting = false;

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private _snackBar: MatSnackBar,
  ) {
  }

  get username() {
    return this.loginForm.get('username')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe')!;
  }

  login() {
    this.isSubmitting = true;
    this.auth
      .login(this.username.value, this.password.value)
      .pipe(filter(authenticated => authenticated))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/auth/escoger_sucursales');
        },
        error: (errorRes: HttpErrorResponse) => {
          if (errorRes.status === 422) {
            const form = this.loginForm;
            const errors = errorRes.error.errors;
            Object.keys(errors).forEach(key => {
              form.get(key === 'email' ? 'username' : key)?.setErrors({
                remote: errors[key][0],
              });
            });
          }
          else if (errorRes.status === 403) {
            this.openSnackBar('Usuario o contraseña incorrectos');
            // this.loginForm.setErrors({
            //   remote: 'Invalid username or password',
            // });
          }
          this.isSubmitting = false;
        },
      });
  }

  openSnackBar(message: string, code: number = 0,
     actions: string | undefined = undefined) {
    this._snackBar.open(message, actions, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: code === 0 ? 'snack-success' : 'snack-error',
    });
  }

  /*
  this.isSubmitting = true;

  this.auth
    .login(this.username.value, this.password.value, this.rememberMe.value)
    .pipe(filter(authenticated => authenticated))
    .subscribe({
      next: () => {
        this.router.navigateByUrl('sucursalLogin/sucursalLogin');
      },
      error: (errorRes: HttpErrorResponse) => {
        if (errorRes.status === 422) {
          const form = this.loginForm;
          const errors = errorRes.error.errors;
          Object.keys(errors).forEach(key => {
            form.get(key === 'email' ? 'username' : key)?.setErrors({
              remote: errors[key][0],
            });
          });
        }
        this.isSubmitting = false;
      },
    });
}*/
}
