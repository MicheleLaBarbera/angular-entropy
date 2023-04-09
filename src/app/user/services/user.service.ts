import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, Observable } from 'rxjs';
import { User } from '../models/User';
import { HandleError, HttpErrorHandlerService } from 'src/app/shared/errors/http-error-handler.service';
import { ServerError } from 'src/app/shared/models/ServerError';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _userEndpointUrl: string = environment.apiEndpointUrl + 'users/';

  private _handleError: HandleError;

  constructor(private _http: HttpClient, private _httpErrorHandler: HttpErrorHandlerService) { 
    this._handleError = this._httpErrorHandler.createHandleError('UserService');
  }

  public getCurrentUser(): Observable<User | ServerError> {
    return this._http.get<User>(this._userEndpointUrl + 'me').pipe(
      catchError(this._handleError('getCurrentUser', { error: true }))
    ) as Observable<User | ServerError>;
  }

  public authUser(username: string, password: string, remember_me: number): Observable<any>{
    let authObject = {
      username: username, 
      password: password, 
      remember_me: remember_me
    }
    return this._http.post<any>(this._userEndpointUrl + 'token', authObject)
    .pipe(
      catchError(this._handleError('authUser', { error: true }))
    ) as Observable<User | ServerError>;
  }

}