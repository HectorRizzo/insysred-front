import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdenTrabajoDto } from '../dto/OrdenTrabajoDto';
import { UsuarioDto } from '../dto/UsuarioDto';
import {environment} from '@env/environment';
import { EmpleadosDTO } from 'app/dto/EmpleadosDTO';
const apiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class TecnicoService {

  constructor(private http: HttpClient) { }

  obtenerOrdenesTrabajo(page: number, pageSize: number, filter:string = ''):Observable<OrdenTrabajoDto[]>{
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString())
      .set('filter', filter);
    return this.http.get<OrdenTrabajoDto[]>(`${apiUrl}/orden_trabajo`, {params});
  }
  obtenerOrdenesTrabajoTecnico(page: number, pageSize: number, filter:string = '',
     idTecnico: number):Observable<OrdenTrabajoDto[]>{
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString())
      .set('filter', filter);
    return this.http.get<OrdenTrabajoDto[]>(`${apiUrl}/orden_trabajo/tecnico/`+idTecnico, {params});
  }

  obtenerTecnicos(): Observable<any[]>{
    const params = new HttpParams()
      .set('cargo', 'Tecnico');
    return this.http.get(`${apiUrl}/empleados/cargo`, {params}) as Observable<any[]>;
  }
}
