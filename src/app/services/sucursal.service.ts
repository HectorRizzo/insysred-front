import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SucursalDto} from '../dto/SucursalDto';
import { environment } from '../../environments/environment';
import { SucursalClienteDto } from '../dto/SucursalClienteDto';
import { AsignarSucursalClienteDto } from '../dto/AsignarSucursalClienteDto';
import { AsignarSucursalUsuarioDTO } from 'app/dto/AsignarSucursalUsuarioDTO';


const apiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  constructor(private http: HttpClient) {
  }

  obtenerSucursales(): Observable<SucursalDto[]>{
    // return this.http.get<SucursalDto[]>(`${this.apiUrl}/sucursal`);
    return this.http.get(`${apiUrl}/sucursal`) as Observable<SucursalDto[]>;
  }

  obtenerSucursalesXUsuario(id_usuario: any): Observable<SucursalDto[]>{
    return this.http.get<SucursalDto[]>(`${apiUrl}/sucursal/usuario/` + id_usuario);
  }

  obtenerAllSucursales(): Observable<SucursalDto[]>{
    return this.http.get<SucursalDto[]>(`${apiUrl}/sucursal/all`);
  }

  crearSucursales(sucursal:SucursalDto):Observable<SucursalDto>{
    return this.http.post<SucursalDto>(`${apiUrl}/sucursal`, sucursal);
  }

  updateSucursal(id: string, sucursal:SucursalDto):Observable<SucursalDto>{
    return this.http.put<SucursalDto>(`${apiUrl}/sucursal/` + id, sucursal);
  }

  obtenerSucuralCliente(id_cliente:string): Observable<SucursalClienteDto[]>{
    return this.http.get<SucursalClienteDto[]>(`${apiUrl}/sucursal_cliente/`+id_cliente);
  }

  asignarSucursalCliente(clienteSucursal: AsignarSucursalClienteDto):Observable<AsignarSucursalClienteDto>{
    return this.http.post<AsignarSucursalClienteDto>(`${apiUrl}/asignar_sucursal`, clienteSucursal);
  }

  asignarSucursalUsuario(clienteSucursal: AsignarSucursalUsuarioDTO):Observable<AsignarSucursalClienteDto>{
    return this.http.post<AsignarSucursalClienteDto>(`${apiUrl}/sucursal/asignar_usuario`, clienteSucursal);
  }

  obtenerSucursalesUsuario(id_usuario:string): Observable<any>{ 
    return this.http.get<SucursalClienteDto[]>(`${apiUrl}/sucursal/`+ id_usuario +`/sucursales`);
  }

}
