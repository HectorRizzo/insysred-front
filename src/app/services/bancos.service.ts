import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { TipoBancoDto } from 'app/dto/TipoBancoDto';
import { ArchivoBancoDto } from 'app/dto/ArchivoBancoDto';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class BancosService {
  constructor(private http: HttpClient) {}

  getAllTipoBanco(): Observable<TipoBancoDto[]> {
    return this.http.get(`${apiUrl}/tipoBanco`) as Observable<TipoBancoDto[]>;
  }

  getAllConciliacion(
    page: number,
    perPage: number,
    filtro: string,
    fechaInicio: string,
    fechaFin: string
  ): Observable<ArchivoBancoDto[]> {
    return this.http.get(`${apiUrl}/archivosConcilacion`, {
      params: { pagina: page, tamanoPagina: perPage, filtro, fechaInicio, fechaFin },
    }) as Observable<ArchivoBancoDto[]>;
  }

  getConciliacion(idFactura: number): Observable<ArchivoBancoDto> {
    return this.http.get(
      `${apiUrl}/archivosConcilacion/${idFactura}`
    ) as Observable<ArchivoBancoDto>;
  }

  postConciliacion(documento: any, idTipoBanco: number) {
    const form = new FormData();
    form.append('excel', documento);
    form.append('idTipoBanco', idTipoBanco.toString());
    return this.http.post(`${apiUrl}/archivosConcilacion`, form) as Observable<ArchivoBancoDto>;
  }
}
