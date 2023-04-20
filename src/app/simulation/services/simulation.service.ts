import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable } from 'rxjs';
import { Simulation } from '../models/Simulation';
import { HandleError, HttpErrorHandlerService } from 'src/app/shared/errors/http-error-handler.service';
import { ServerError } from 'src/app/shared/models/ServerError';
import { SimulationsCount } from '../models/SimulationsCount';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private _simulationEndpointUrl:string = environment.apiEndpointUrl + 'simulations/';

  private _handleError: HandleError;

  constructor(private _http: HttpClient, private _httpErrorHandler: HttpErrorHandlerService) { 
    this._handleError = this._httpErrorHandler.createHandleError('UserService');
  }

  public getSimulationsCounts(): Observable<SimulationsCount | ServerError> {
    return this._http.get<SimulationsCount>(this._simulationEndpointUrl).pipe(
      catchError(this._handleError('getSimulationsCounts', { error: true }))
    ) as Observable<SimulationsCount | ServerError>;
  }


  public getSimulation(id: string): Observable<Simulation | ServerError> {
    return this._http.get<Simulation>(this._simulationEndpointUrl + id).pipe(
      catchError(this._handleError('getSimulation', { error: true }))
    ) as Observable<Simulation | ServerError>;
  }

  public createSimulation(simulation: Simulation): Observable<string | ServerError> {
    return this._http.post<string>(this._simulationEndpointUrl, simulation).pipe(
      catchError(this._handleError('createSimulation', { error: true }))
    ) as Observable<string | ServerError>;
  }
}