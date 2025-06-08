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
export class RubroXContratoService {
  constructor(private http: HttpClient) {}

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
}
