import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, Observable } from 'rxjs';
import { HandleError, HttpErrorHandlerService } from 'src/app/shared/errors/http-error-handler.service';
import { ServerError } from 'src/app/shared/models/ServerError';
import { ClassroomHomework } from '../models/ClassroomHomework';
import { ClassroomHomeworkMap } from '../models/ClassroomHomeworkMap';

@Injectable({
  providedIn: 'root'
})
export class ClassroomHomeworkService {
  private _classroomEndpointUrl:string = environment.apiEndpointUrl + 'classrooms/';

  private _handleError: HandleError;

  public updatedClassroomHomeworks$ = new EventEmitter<number>();

  constructor(private _http: HttpClient, private _httpErrorHandler: HttpErrorHandlerService) { 
    this._handleError = this._httpErrorHandler.createHandleError('UserService');
  }

  public createClassroomHomework(classroomHomework: ClassroomHomework): Observable<ClassroomHomework | ServerError> {
    let id = classroomHomework.classroom_id;

    return this._http.post<string>(this._classroomEndpointUrl + id + '/homeworks/', {
      title: classroomHomework.title,
      body: classroomHomework.body,
      node_min: classroomHomework.node_min,
      node_max: classroomHomework.node_max,
      start_datetime: classroomHomework.start_datetime,
      expire_datetime: classroomHomework.expire_datetime
    }).pipe(
      catchError(this._handleError('createClassroomHomework', { error: true }))
    ) as Observable<ClassroomHomework | ServerError>;
  }

  public getClassroomHomeworks(classroom_id: string): Observable<ClassroomHomework[] | ServerError> {
    return this._http.get<ClassroomHomework[]>(this._classroomEndpointUrl + classroom_id + '/homeworks').pipe(
      catchError(this._handleError('getClassroomHomeworks', { error: true }))
    ) as Observable<ClassroomHomework[] | ServerError>;
  }

  public getClassroomHomework(classroom_id: string, homework_id: string): Observable<ClassroomHomework | ServerError> {
    return this._http.get<ClassroomHomework>(this._classroomEndpointUrl + classroom_id + '/homeworks/' + homework_id).pipe(
      catchError(this._handleError('getClassroomHomework', { error: true }))
    ) as Observable<ClassroomHomework | ServerError>;
  }

  public createClassroomHomeworkMap(classroom_id: string, homework_id: string, classroom_homework_map: ClassroomHomeworkMap): Observable<ClassroomHomeworkMap | ServerError> {
    return this._http.post<string>(this._classroomEndpointUrl + classroom_id + '/homeworks/' + homework_id, classroom_homework_map).pipe(
      catchError(this._handleError('createClassroomHomeworkMap', { error: true }))
    ) as Observable<ClassroomHomeworkMap | ServerError>;
  }
}