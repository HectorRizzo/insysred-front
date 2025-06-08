import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RolDto} from '../dto/RolDto';

import { environment } from '../../environments/environment';
import { AsignarRolesUsuarioDTO } from 'app/dto/AsignarRolesUsuarioDTO';
import { RolesUsuarioDTO } from 'app/dto/RolesUsuarioDTO';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  constructor(private http: HttpClient) {
  }

  obtenerRol(page: number, pageSize: number): Observable<RolDto[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString());
    return this.http.get<RolDto[]>(`${apiUrl}/rol`, { params });
  }

  obtenerTodosRoles(): Observable<any>{
    return this.http.get(`${apiUrl}/rol/all`) as Observable<any>;
  }

  obtenerRolId(idRol: number | undefined): Observable<RolDto> {
    return this.http.get<RolDto>(`${apiUrl}/rol/` + idRol);
  }

  actualizarRol(idRol: number, rol: RolDto):Observable<RolDto>{
    return this.http.put<RolDto>(`${apiUrl}/rol/` + idRol, rol);
  }

  crearRol(rol: RolDto):Observable<RolDto>{
    return this.http.post<RolDto>(`${apiUrl}/rol`, rol);
  }

  asignarRolUsuario(usuarioRol: AsignarRolesUsuarioDTO):Observable<AsignarRolesUsuarioDTO>{
    return this.http.post<AsignarRolesUsuarioDTO>(`${apiUrl}/rol/asignar_usuario`, usuarioRol);
  }

  obtenerRolesUsuario(id_usuario:string, idSucursal:any): Observable<any>{ 
    console.log('rest' + idSucursal);
    const params = new HttpParams()
    .set('idSucursal', idSucursal);

    return this.http.get<RolesUsuarioDTO[]>(`${apiUrl}/rol/`+ id_usuario +`/roles`, {params});
  }

  obtenerModulos(): Observable<any>{
    return this.http.get(`${apiUrl}/permisos/modulos`) as Observable<any>;
  }

  obtenerModulosXUsuario(idUsuario: string, idSucursal: any): Observable<any>{
    const params = new HttpParams()
    .set('idSucursal', idSucursal);
    return this.http.get(`${apiUrl}/permisos/modulos/usuario/${idUsuario}`, {params}) as Observable<any>;
  }

  guardarPermiso(permiso: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/permisos`, permiso);
  }

  obtenerPermisosXRol(page: number, pageSize: number, filtro: string): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString())
      .set('filtro', filtro.toString());
    return this.http.get(`${apiUrl}/permisos`, { params }) as Observable<any>;
  }

  obtenerPermisosExistentesXRol(idRol: string): Observable<any> {
    return this.http.get(`${apiUrl}/permisos/rol/${idRol}`) as Observable<any>;
  }

  actualizarPermisoXRol(idPermiso: number, estado: boolean): Observable<any> {
    return this.http.put(`${apiUrl}/permisos/${idPermiso}`, { estado }) as Observable<any>;
  }

  obtenerPermisosXUsuario(idUsuario: any, idSucursal: any): Observable<any> {
    const params = new HttpParams()
      .set('idUsuario', idUsuario)
      .set('idSucursal', idSucursal);
      if(idSucursal !== null){
        return this.http.get(`${apiUrl}/permisos/modulos_usuario`, { params }) as Observable<any>;
      }else{
        return Observable.create();
      }
  }

  actualizarContrasena(idUsuario: any, password: any): Observable<any> {
    return this.http.put(`${apiUrl}/usuarios/${idUsuario}/actualizar_contrasena`, { password }) as Observable<any>;
  }

  resetearContrasena(idUsuario: any): Observable<any> {
    return this.http.put(`${apiUrl}/usuarios/${idUsuario}/resetear_contrasena`, {}) as Observable<any>;
  }
}
