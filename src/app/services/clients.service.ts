import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

interface Client {
  id: number,
  identificacion: string,
  nombres: string,
  email: string,
  estado: boolean,
}

export interface Contract {
  id:            number;
  clientId:      number;
  planId:        number;
  status:        string;
  ubicacion:     string;
  georeferencia: string;
  duracionMeses: number;
}

@Injectable({
  providedIn: 'root',
})
export class ClientsService {

  constructor(private http: HttpClient) {}

  getClients(page: number, perPage: number, filtro = '', idSucursal:any =0): Observable<Client[]>{
    return this.http.get(`${apiUrl}/cliente`, {
      params: {
        pagina: page,
        tamanoPagina: perPage,
        filtro,
        idSucursal
      }
    }) as Observable<Client[]>;
  }

  getClient(clientId: number): Observable<Client>{
    return this.http.get(`${apiUrl}/cliente/${clientId}`) as Observable<Client>;
  }

  getContracts(){
    return this.http.get(`${apiUrl}/contratos`) as Observable<Contract[]>;
  }

  createClientContract(contract: any){
    return this.http.post(`${apiUrl}/contratos`, { ...contract },) as Observable<Contract>;
  }

  updateClientContract(contract: any){
    return this.http.put(`${apiUrl}/contratos/${contract.id}`, { ...contract },) as Observable<Contract>;
  }

  updateStateContract(body: any){
    return this.http.post(`${apiUrl}/contratos/cmb_estado`, { ...body }) as Observable<Contract>;
  }

  getContractosCliente(page: number, perPage: number, filtro: string) {
    return this.http.get(`${apiUrl}/contratos/clientes`, {
      params: { pagina: page, tamanoPagina: perPage, filtro },
    }) as Observable<any>;
  }

  getEstadosContrato(){
    return this.http.get(`${apiUrl}/contratos/estados`) as Observable<any>;
  }

}
