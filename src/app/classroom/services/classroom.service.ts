import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable } from 'rxjs';
import { Classroom } from '../models/Classroom';
import { HandleError, HttpErrorHandlerService } from 'src/app/shared/errors/http-error-handler.service';
import { ServerError } from 'src/app/shared/models/ServerError';
import { ClassroomStudent } from '../models/ClassroomStudent';
import { User } from 'src/app/user/models/User';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  private _classroomEndpointUrl:string = environment.apiEndpointUrl + 'classrooms/';

  private _handleError: HandleError;

  public updatedClassrooms$ = new EventEmitter<number>();

  constructor(private _http: HttpClient, private _httpErrorHandler: HttpErrorHandlerService) { 
    this._handleError = this._httpErrorHandler.createHandleError('UserService');
  }

  public getClassrooms(): Observable<Classroom[] | ServerError> {
    return this._http.get<Classroom[]>(this._classroomEndpointUrl).pipe(
      catchError(this._handleError('getClassrooms', { error: true }))
    ) as Observable<Classroom[] | ServerError>;
  }

  public getClassroom(id: string): Observable<Classroom | ServerError> {
    return this._http.get<Classroom>(this._classroomEndpointUrl + id).pipe(
      catchError(this._handleError('getClassroom', { error: true }))
    ) as Observable<Classroom | ServerError>;
  }

  public joinStudentClassroom(invite_token: string): Observable<ClassroomStudent | ServerError> {
    return this._http.get<ClassroomStudent>(this._classroomEndpointUrl + 'invite/' + invite_token).pipe(
      catchError(this._handleError('joinStudentClassroom', { error: true }))
    ) as Observable<ClassroomStudent | ServerError>;
  }

  public createClassroom(classroom: Classroom): Observable<Classroom | ServerError> {
    return this._http.post<string>(this._classroomEndpointUrl, classroom).pipe(
      catchError(this._handleError('createClassroom', { error: true }))
    ) as Observable<Classroom | ServerError>;
  }

  public getClassroomStudents(classroom_id: string): Observable<User[] | ServerError> {
    return this._http.get<User[]>(this._classroomEndpointUrl + classroom_id + '/students').pipe(
      catchError(this._handleError('getClassroomStudents', { error: true }))
    ) as Observable<User[] | ServerError>;
  }
}