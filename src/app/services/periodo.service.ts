import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProvinciasDto } from '../dto/provinciasDto';
import { CantonesDto } from '../dto/CantonDto';

import { environment } from '../../environments/environment';
import { PeriodoDto } from 'app/dto/PeriodoDto';
import { ProcesarPeriodoResultadoDto } from 'app/dto/ProcesarPeriodoResultadoDto';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class PeriodoService {

  constructor(private http: HttpClient) {}

  getPeriodosMasivos(): Observable<PeriodoDto[]> {
    return this.http.get<PeriodoDto[]>(`${apiUrl}/periodo`);
  }

  getPeriodosIndividual(): Observable<PeriodoDto[]> {
    return this.http.get<PeriodoDto[]>(`${apiUrl}/periodo/individual`);
  }

  getProcesar(idPeriodo: number, idContratos: number[] | null = null) {
    return this.http.post(`${apiUrl}/periodo/procesar`, {
      idPeriodo,
      idContratos,
    }) as Observable<ProcesarPeriodoResultadoDto>;
  }
}
