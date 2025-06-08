import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ConciliacionDto } from 'app/dto/ConciliacionDto';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class ConciliacionService {
  constructor(private http: HttpClient) {}

  getAllConciliacion(
    page: number,
    perPage: number,
    filtroBanco: number | string,
    filtroComprobante: string,
    filtroCliente: string,
    estado: string,
    fechaInicio: string,
    fechaFin: string
  ): Observable<ConciliacionDto[]> {
    return this.http.get(`${apiUrl}/conciliacion`, {
      params: {
        pagina: page,
        tamanoPagina: perPage,
        filtroBanco,
        filtroComprobante,
        filtroCliente,
        estado,
        fechaInicio,
        fechaFin,
      },
    }) as Observable<ConciliacionDto[]>;
  }

  postConciliarManual(id: number) {
    return this.http.post(`${apiUrl}/conciliacion/manual/${id}`, null) as Observable<any>;
  }
}
