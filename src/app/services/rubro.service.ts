import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RubroDto } from 'app/dto/RubroDto';

import { environment } from '../../environments/environment';
import { RubrosXContratoDto } from 'app/dto/RubrosXContratoDto';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class RubroService {
  constructor(private http: HttpClient) {}

  getAllRubros(
    page: number,
    perPage: number,
    filtro: string,
    estado: string
  ): Observable<RubroDto[]> {
    return this.http.get(`${apiUrl}/rubros`, {
      params: { pagina: page, tamanoPagina: perPage, filtro, estado },
    }) as Observable<RubroDto[]>;
  }

  updateRubro(idRubro: number, status: boolean) {
    return this.http.post(`${apiUrl}/rubros/cmb_estado`, {
      idComponent: idRubro,
      estatus: status,
    }) as Observable<RubroDto>;
  }

  postRubro(nombre: string, valor: number, id: number | null = null) {
    return this.http.post(`${apiUrl}/rubros`, {
      nombre,
      valor,
      id,
    }) as Observable<RubroDto>;
  }

  getAllRubrosXContrato(
    idContrato: number,
    page: number,
    perPage: number
  ): Observable<RubrosXContratoDto[]> {
    return this.http.get(`${apiUrl}/rubrosPorContrato/${idContrato}`, {
      params: { pagina: page, tamanoPagina: perPage },
    }) as Observable<RubrosXContratoDto[]>;
  }

  deleteRubrosXContrato(idRubrosXContrato: number) {
    return this.http.delete(`${apiUrl}/rubrosPorContrato/${idRubrosXContrato}`) as Observable<any>;
  }

  postRubroXContrato(idContrato: number, idRubro: number, cantidad: number) {
    return this.http.post(`${apiUrl}/rubrosPorContrato`, {
      idContrato,
      idRubro,
      cantidad,
    }) as Observable<RubroDto>;
  }
}
