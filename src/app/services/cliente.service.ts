import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ClienteDto} from '../dto/ClienteDto';
import { environment } from '../../environments/environment';
import { ClienteSucursalDto } from '../dto/ClienteSucursalDto';
import { RespuestaAPIDto } from '../dto/RespuestaAPIDto';
import { MotivoVisitaDto } from '../dto/MotivoVisitaDto';
import { HoraVisitaDto } from '../dto/HoraVisitaDto';
import { OrdenTrabajoNewDto } from '../dto/OrdenTrabajoNewDto';
import { AtencionOrdenDto } from '../dto/AtencionOrdenDto';
import { ReferenciaDto } from 'app/dto/ReferenciaDto';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class ClienteService {
  constructor(private http: HttpClient) { }

  guardarCliente(cliente: ClienteDto, idSucursal:any): Observable<ClienteDto[]> {
    return this.http.post<ClienteDto[]>(`${apiUrl}/cliente/${idSucursal}`, cliente);
  }

  actualizarCliente(id : number, cliente: ClienteDto): Observable<ClienteDto[]> {
    return this.http.put<ClienteDto[]>(`${apiUrl}/cliente/${id}`, cliente);
  }
  guardarAsignacion(clienteSucursalDto: ClienteSucursalDto): Observable<RespuestaAPIDto>{
    return this.http.post<RespuestaAPIDto>(`${apiUrl}/cliente/addSucursal`, clienteSucursalDto);
  }

  // Obtiene dados extras como motivo de visita y hora de visita
  obtenerMotivoVisita(): Observable<MotivoVisitaDto[]>{
    return this.http.get<MotivoVisitaDto[]>(`${apiUrl}/motivoVisita`);
  }

  obtenerHorarioVisita(): Observable<HoraVisitaDto[]>{
    return this.http.get<HoraVisitaDto[]>(`${apiUrl}/horarioVisita`);
  }

  guardarOrden(ordenNew: OrdenTrabajoNewDto): Observable<any>{
    return this.http.post(`${apiUrl}/orden_trabajo`, ordenNew);
  }

  editarOrden(id:any,ordenNew: OrdenTrabajoNewDto): Observable<any>{
    return this.http.put(`${apiUrl}/orden_trabajo/${id}`, ordenNew);
  }

  atenderOrden(atencionOrden: AtencionOrdenDto): Observable<any>{
    return this.http.post(`${apiUrl}/orden_trabajo/atender`, atencionOrden);
  }

  obtenerReferencia(idCliente: number): Observable<any>{
    return this.http.get<ReferenciaDto>(`${apiUrl}/referencia/cliente/${idCliente}`);
  }

  inactivarOrden(id: number): Observable<any>{
    return this.http.put(`${apiUrl}/orden_trabajo/inactivar/${id}`, {});
  }

  verificarIdentificacionCliente(identificacion: string): Observable<any>{
    return this.http.get(`${apiUrl}/cliente/verificar/${identificacion}`);
  }

}
