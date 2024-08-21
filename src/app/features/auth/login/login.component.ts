import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '@shared/services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.loginForm = this.fb.group({
      email: ['',
        [
          Validators.required,
          Validators.pattern(/^([^\s@]+@[^\s@]+\.[^\s@]+)$/),
        ],
      ],
      password: ['',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[&#%!]).+$/),
        ],
      ],
    });
  }

  get email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  onLogin(): void {
    if (this.loginForm.valid) {

      this.authService.login(this.email?.value, this.password?.value).subscribe({
        next: () => {
          this.onClose();
          alert('You logined successfully.');
          this.router.navigateByUrl('projects');
        },
        error: (error) => {
          this.errorMessage = error.message;
          setTimeout(() => {
            this.onClose();
          }, 2000);
          alert('You couldn\'t login.');
          this.router.navigateByUrl('auth/register');
        },
      });
    }
  }

  onClose() {
    this.loginForm.reset();
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
}
