import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RouterDto} from '../dto/RouterDto';
import {RouterNewDto} from '../dto/RouterNewDto';
import {CambioEstadoDto} from '../dto/CambioEstadoDto';
import {AsignaSucursalDto} from '../dto/AsignaSucursalDto';

import { environment } from './../../environments/environment';

const apiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class ServidoresService {

  constructor(private http: HttpClient) {
  }

  obtenerRoutersBySuc(idSucursal: string): Observable<RouterDto[]> {
    return this.http.get<RouterDto[]>(`${apiUrl}/router/sucursal/` + idSucursal);
  }

  obtenerRoutersAll(): Observable<RouterDto[]> {
    return this.http.get<RouterDto[]>(`${apiUrl}/router`);
  }

  crearRouterbySuc(router: RouterDto):Observable<RouterDto>{
    return this.http.post<RouterDto>(`${apiUrl}/router`, router);
  }

  crearServidor(routerDto: RouterNewDto):Observable<RouterDto>{
    return this.http.post<RouterDto>(`${apiUrl}/router`, routerDto);
  }

  cambioEstadoServidor(cambioEstado: CambioEstadoDto):Observable<RouterDto>{
    return this.http.post<RouterDto>(`${apiUrl}/router/cmb_estado`, cambioEstado);
  }

  asignarSucursal(asignaSucursal: AsignaSucursalDto):Observable<RouterDto>{
    return this.http.post<RouterDto>(`${apiUrl}/router/asignar_sucursal`, asignaSucursal);
  }

  editarServidor(routerDto: Partial<RouterDto>, id: number):Observable<RouterDto>{
    return this.http.put<RouterDto>(`${apiUrl}/router/${id}`, routerDto);
  }

  cambiarContrasenia(body: any){
    return this.http.post<RouterDto>(`${apiUrl}/router/up_pass`, body);
  }

}
