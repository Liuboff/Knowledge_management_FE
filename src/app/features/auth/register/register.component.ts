import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { User } from '@shared/models/user.model';
import { AuthService } from '@shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  errorMessage: string = '';
  isUpdate: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.checkFormMode();
  }

  createForm(): void {
    this.form = this.fb.group(
      {
        firstName: ['',
          [
            Validators.required,
            Validators.maxLength(255),
            Validators.minLength(1),
            Validators.pattern(/^[A-Za-z]+$/),
          ],
        ],
        lastName: ['',
          [
            Validators.required,
            Validators.maxLength(255),
            Validators.minLength(1),
            Validators.pattern(/^[A-Za-z]+$/),
          ],
        ],
        email: ['',
          [
            Validators.required,
            Validators.email,
            Validators.maxLength(255),
            Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
          ],
        ],
        phone: ['',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
            Validators.pattern(/^\+\d+(-?\d+)*$/),
          ],
        ],
        country: ['',
          [
            Validators.required,
            Validators.maxLength(255),
            Validators.minLength(1),
            Validators.pattern(/^[A-Za-z]+$/),
          ],
        ],
        city: ['',
          [
            Validators.required,
            Validators.maxLength(255),
            Validators.minLength(1),
            Validators.pattern(/^[A-Za-z]+$/),
          ],
        ],
        isAdmin: false,
        password: ['',
          [
            Validators.required,
            Validators.maxLength(255),
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[&#%!]).+$/),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get firstName(): FormControl {
    return this.form.get('firstName') as FormControl;
  }

  get lastName(): FormControl {
    return this.form.get('lastName') as FormControl;
  }

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get phone(): FormControl {
    return this.form.get('phone') as FormControl;
  }

  get country(): FormControl {
    return this.form.get('country') as FormControl;
  }

  get city(): FormControl {
    return this.form.get('city') as FormControl;
  }

  get isAdmin(): FormControl {
    return this.form.get('isAdmin') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.form.get('confirmPassword') as FormControl;
  }

  getTitle(): string {
    return this.isUpdate ? 'Update profile information' : 'Create new account';
  }

  getButtonText(): string {
    return this.isUpdate ? 'Save' : 'Register';
  }

  passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    formGroup.get('confirmPassword')?.setErrors(null);
    return null;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const userData: User = {
        firstName: this.firstName?.value,
        lastName: this.lastName?.value,
        email: this.email?.value,
        phone: this.phone?.value,
        city: this.city?.value,
        country: this.country?.value,
        isAdmin: this.isAdmin.value,
        password: this.password?.value,
      };

      const request: Observable<User> = this.isUpdate
        ? this.authService.updateUser(userData)
        : this.authService.registerUser(userData);

      request.pipe().subscribe({
          next: () => this.handleSuccess(),
          error: (error) => this.handleError(error),
        });
    }
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private checkFormMode(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.isUpdate = true;
    }
    this.activatedRoute.data
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data['user']) {
          this.isUpdate = true;
          this.form.patchValue(data['user']);
        }
      });
  }

  private handleSuccess(): void {
    this.router.navigateByUrl('auth/login');
  }

  private handleError(error: any): void {
    this.errorMessage = error.message;
    const redirectUrl = this.isUpdate ? '/users/update' : '/users/register';
    this.router.navigateByUrl(redirectUrl);
  }

  onClose() {
    this.form.reset();
    this.router.navigateByUrl('');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
