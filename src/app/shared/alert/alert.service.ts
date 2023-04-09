import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private _toastr: ToastrService) { }

  public success(message: string, hide: boolean = false): void {
    this._toastr.success(message, 'Alert', {
      extendedTimeOut: 0,
      positionClass: 'toast-bottom-full-width',
      closeButton: true,
      progressBar: true,
      timeOut: (hide) ? 0 : 2500,
    });
  } 

  public error(message: string, hide: boolean = false):void  {
    this._toastr.error(message, 'Error', {
      extendedTimeOut: 0,
      positionClass: 'toast-bottom-full-width',
      closeButton: true,
      progressBar: true,
      timeOut: (hide) ? 0 : 2500,
    });
  }
}