import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {ProvinciasDto} from '../dto/provinciasDto';
import {CantonesDto} from '../dto/CantonDto';

import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

  constructor(private http: HttpClient) {
  }


  // Provincias
  obtenerProvincias(): Observable<ProvinciasDto[]> {
    return this.http.get<ProvinciasDto[]>(`${apiUrl}/provincias`);
  }

  //Cantones
  obtenerCantones(idCanton: string | undefined): Observable<CantonesDto[]> {
    return this.http.get<CantonesDto[]>(`${apiUrl}/cantones/provincia/` + idCanton).pipe(
      catchError(err => {
        console.error('Error en el servicio de obtenerCantones', err);
        return throwError(err);
      }));
  }
}
