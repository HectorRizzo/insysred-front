import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreditoDto } from 'app/dto/CreditoDto';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class CreditosService {
  constructor(private http: HttpClient) {}

  getAllCreditos(
    page: number,
    perPage: number,
    filtro: string,
    estado: string,
    fechaInicio: string,
    fechaFin: string
  ): Observable<CreditoDto[]> {
    return this.http.get(`${apiUrl}/credito`, {
      params: { pagina: page, tamanoPagina: perPage, filtro, estado, fechaInicio, fechaFin },
    }) as Observable<CreditoDto[]>;
  }

  getCredito(idCredito: number): Observable<CreditoDto> {
    return this.http.get(`${apiUrl}/credito/${idCredito}`) as Observable<CreditoDto>;
  }
}
