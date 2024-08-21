import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User } from '@shared/models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    const dummyUser: User = { email: 'test@example.com', password: 'password' };
    const mockResponse: User = { id: '1', email: 'test@example.com' };

    service.registerUser(dummyUser).subscribe(user => {
      expect(user).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('http://localhost:3000/api/v1/users/register');
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);
  });

  it('should log in a user', () => {
    const email = 'test@example.com';
    const password = 'password';
    const mockResponse: User = { id: '1', email: 'test@example.com' };

    service.login(email, password).subscribe(user => {
      expect(user).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('http://localhost:3000/api/v1/users/login');
    expect(req.request.method).toEqual('POST');
    req.flush({ user: mockResponse, token: 'mockToken' });
  });

  it('should get user info', () => {
    const userId = '1';
    const mockResponse: User = { id: '1', email: 'test@example.com' };

    service.getUserInfo(userId).subscribe(user => {
      expect(user).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`http://localhost:3000/api/v1/users/${userId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });

});

