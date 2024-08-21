import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule, FormBuilder} from '@angular/forms';
import {RegisterComponent} from './register.component';
import {AuthService} from "@shared/services/auth.service";
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {of} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {RouterTestingModule} from "@angular/router/testing";

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;
  class DummyComponent {}

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['registerUser', 'updateUser']);

    const activatedRouteStub = {
      data: of({
        user: { username: 'John', email: 'email@example.com', phone: '+123456789', password: 'password', confirmPassword: 'password' }
      })
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
        {path: 'users/register', component: DummyComponent},
        {path: 'users/update', component: DummyComponent}
      ]) ],
      providers: [
        FormBuilder,
        {provide: AuthService, useValue: authServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteStub}
      ]
    })
      .compileComponents();
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('email field validity', () => {
    let email = component.form.controls['email'];

    email.setValue("");
    expect(email.valid).toBeFalsy();
    expect(email.hasError('required')).toBeTruthy();
  });

  it('password match validator should add passwordMismatch error if passwords do not match', () => {
    component.form.controls['password'].setValue('12345678');
    component.form.controls['confirmPassword'].setValue('87654321');
    expect(component.form.hasError('passwordMismatch')).toBeTruthy();
  });

  describe('getTitle', () => {
    it('should return "Update profile information" when isUpdate is true', () => {
      component.isUpdate = true;
      expect(component.getTitle()).toEqual('Update profile information');
    });

    it('should return "Create new account" when isUpdate is false', () => {
      component.isUpdate = false;
      expect(component.getTitle()).toEqual('Create new account');
    });
  });

  describe('getButtonText', () => {
    it('should return "Save" when isUpdate is true', () => {
      component.isUpdate = true;
      expect(component.getButtonText()).toEqual('Save');
    });

    it('should return "Register" when isUpdate is false', () => {
      component.isUpdate = false;
      expect(component.getButtonText()).toEqual('Register');
    });
  });
});
