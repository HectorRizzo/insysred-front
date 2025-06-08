import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ArchivoMovimientoClienteDto } from 'app/dto/ArchivoMovimientoClienteDto';
import { DetalleArchivoMovimientoClienteDto } from 'app/dto/DetalleArchivoMovimientoClienteDto';
import { ConciliarArchivoMovimientoClienteDto } from 'app/dto/ConciliarArchivoMovimientoClienteDto';
import { ExistenciaMovClienteXMovBancoDto } from 'app/dto/ExistenciaMovClienteXMovBancoDto';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class ComprobantesService {
  constructor(private http: HttpClient) {}

  getAllArchivoMovimientoCliente(
    page: number,
    perPage: number,
    filtro: string,
    fechaInicio: string,
    fechaFin: string
  ): Observable<ArchivoMovimientoClienteDto[]> {
    return this.http.get(`${apiUrl}/archivosMovCliente`, {
      params: { pagina: page, tamanoPagina: perPage, filtro, fechaInicio, fechaFin },
    }) as Observable<ArchivoMovimientoClienteDto[]>;
  }

  getArchivoMovimientoClienteId(idArchivo: number): Observable<DetalleArchivoMovimientoClienteDto> {
    return this.http.get(
      `${apiUrl}/archivosMovCliente/${idArchivo}`
    ) as Observable<DetalleArchivoMovimientoClienteDto>;
  }

  getValidarNumeroComprobante(
    numeroComprobante: number
  ): Observable<ExistenciaMovClienteXMovBancoDto> {
    return this.http.get(`${apiUrl}/archivosMovCliente/validar`, {
      params: { numeroComprobante },
    }) as Observable<ExistenciaMovClienteXMovBancoDto>;
  }

  postConciliarComprobante(
    validarArchivoMovimientoClienteDto: ConciliarArchivoMovimientoClienteDto
  ) {
    return this.http.post(`${apiUrl}/archivosMovCliente/conciliar`, {
      ...validarArchivoMovimientoClienteDto,
    }) as Observable<DetalleArchivoMovimientoClienteDto>;
  }
}
