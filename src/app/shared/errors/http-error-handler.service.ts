import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AlertService } from '../alert/alert.service';

export type HandleError = <T> (operation?: string, result?: T) => (error: HttpErrorResponse) => Observable<T>;

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerService {

  constructor(private _alertService: AlertService) { }
 
  public createHandleError = (serviceName = '') => <T>
    (operation = 'operation', result = {} as T) => this.handleError(serviceName, operation, result);
 
  public handleError<T> (serviceName = '', operation = 'operation', result = {} as T) { 
    return (error: HttpErrorResponse): Observable<T> => {
      if(error.error) {
        this._alertService.error((error.error.detail) ? `${error.error.detail}` : "Unable to communicate with the server.");
      }
      return of(result as T);
    };
  }
}
