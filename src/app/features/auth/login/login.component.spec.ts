import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '@shared/services/auth.service';
import { User } from '@shared/models/user.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(waitForAsync(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'logout']);
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: { navigateByUrl: () => {} } }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['email']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
  });

  it('should have invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should validate email input correctly', () => {
    const emailControl = component.loginForm.controls['email'];
    emailControl.setValue('');
    expect(emailControl.hasError('required')).toBeTruthy();
    emailControl.setValue('invalid-email');
    expect(emailControl.hasError('pattern')).toBeTruthy();
    emailControl.setValue('valid.email@example.com');
    expect(emailControl.valid).toBeTruthy();
  });

  it('should reset the form on close', () => {
    component.loginForm.controls['email'].setValue('valid.email@example.com');
    component.loginForm.controls['password'].setValue('validP@ssword1');
    component.onClose();
    expect(component.loginForm.controls['email'].value).toBeNull();
    expect(component.loginForm.controls['password'].value).toBeNull();
  });

  it('should toggle showPassword flag', () => {
    expect(component.showPassword).toBeFalsy();
    component.toggleShowPassword();
    expect(component.showPassword).toBeTruthy();
    component.toggleShowPassword();
    expect(component.showPassword).toBeFalsy();
  });

  it('should display error messages for invalid email', () => {
    const emailInput = fixture.debugElement.query(By.css('input[name="email"]')).nativeElement;
    emailInput.value = '';
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const errorMessages = fixture.debugElement.queryAll(By.css('.error-message'));
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it('should display error messages for invalid password', () => {
    const passwordInput = fixture.debugElement.query(By.css('input[name="password"]')).nativeElement;
    passwordInput.value = '';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const errorMessages = fixture.debugElement.queryAll(By.css('.error-message'));
    expect(errorMessages.length).toBeGreaterThan(0);
  });

});
