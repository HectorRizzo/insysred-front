import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {ProvinciasDto} from '../dto/provinciasDto';
import {CantonesDto} from '../dto/CantonDto';

import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) {
  }

  guardarUsuario(empleado: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/usuarios`, empleado).pipe(
      catchError(err => {
        console.error('Error en el servicio de guardarUsuario', err);
        return throwError(err);
      }));
  }

  obtenerUsuarios(page: number, pageSize: number, filtro: string): Observable<any> {
    const params = new HttpParams()
    .set('page', page.toString())
    .set('size', pageSize.toString())
    .set('filtro', filtro.toString());
    return this.http.get<any>(`${apiUrl}/usuarios`,{params} ).pipe(
      catchError(err => {
        console.error('Error en el servicio de obtenerUsuarios', err);
        return throwError(err);
      }));
  }

  actualizarUsuario(id:any, usuario: any, activo?:boolean): Observable<any> {
    console.log('id', id);
    let httpParams = new HttpParams();
    if(activo != null){
      httpParams = httpParams.set('cambiarEstado', activo);
    }
    //poner param si solo se quiere inactivar
    return this.http.put<any>(`${apiUrl}/usuarios/${id}`, usuario, {params: httpParams}).pipe(
        catchError(err => {
            console.error('Error en el servicio de actualizarUsuario', err);
            return throwError(err);
        }));
  }
}
