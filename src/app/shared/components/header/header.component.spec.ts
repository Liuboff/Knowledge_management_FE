import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { HeaderComponent } from './header.component';
import { AuthService } from '@shared/services/auth.service';
import { User } from '@shared/models/user.model';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockRouter: any;
  let mockAuthService: any;
  let mockUser: User;

  beforeEach(waitForAsync(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);
    mockUser = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', token: 'dummyToken' };

    mockAuthService.getCurrentUser.and.returnValue(of(mockUser));

    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user initials when logged in', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const initialsElement = fixture.debugElement.query(By.css('.avatar__initials')).nativeElement;
    expect(initialsElement.textContent).toBe('JD');
  });

  it('should call AuthService.logout on logout', () => {
    component.onLogout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should display login link when not logged in', () => {
    mockAuthService.getCurrentUser.and.returnValue(of(null));
    component.ngOnInit();
    fixture.detectChanges();

    const loginLink = fixture.debugElement.query(By.css('.header__login'));
    expect(loginLink.nativeElement.textContent).toBe('Login');
  });

  it('should display logout link when logged in', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const logoutLink = fixture.debugElement.query(By.css('.header__login'));
    expect(logoutLink.nativeElement.textContent).toBe('Logout');
  });

});
