import {Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs';
import {InterfacesDto} from '../dto/microtik/InterfacesDto';

import { environment } from '../../environments/environment';
import { IdParamDto } from '../dto/microtik/IdParamDto';
import { MangleDto } from '../dto/microtik/MangleDto';
import { QueueDto } from '../dto/microtik/QueueDto';
import { FirewallDto } from '../dto/microtik/FirewallDto';
import { ArpDto } from '../dto/microtik/ArpDto';
import { VlanDto } from '../dto/microtik/VlanDto';

const apiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class MicrotikService {


  constructor(private http: HttpClient) {
  }

  obtenerInterfaces(id_router: number | undefined): Observable<InterfacesDto[]> {
    return this.http.get<InterfacesDto[]>(`${apiUrl}/microtik/interface/`+id_router);
  }

  getInterfaceByServer(idServidor: IdParamDto):Observable<InterfacesDto[]> {
    return this.http.post<InterfacesDto[]>(`${apiUrl}/microtik/get_interfaz`, idServidor);
  }

  getMangles(id_router: number | undefined):Observable<MangleDto[]>{
    return this.http.get<MangleDto[]>(`${apiUrl}/microtik/view_mangle/`+id_router);
  }

  getQueue(id_router: number | undefined):Observable<QueueDto[]>{
    return this.http.get<QueueDto[]>(`${apiUrl}/microtik/firewall/view_queue/`+id_router);
  }

  getFirewall(id_router: number | undefined):Observable<FirewallDto[]>{
    return this.http.get<FirewallDto[]>(`${apiUrl}/microtik/firewall/`+id_router);
  }

  getArp(id_router: number | undefined):Observable<ArpDto[]>{
    return this.http.get<ArpDto[]>(`${apiUrl}/microtik/arp/`+id_router);
  }

  addInterface(vlanDto: VlanDto):Observable<VlanDto[]>{
    return this.http.post<VlanDto[]>(`${apiUrl}/microtik/add_vlan`, vlanDto);
  }


}
