import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FacturaDto } from 'app/dto/FacturaDto';
import { CambioEstadoFacturaDto } from 'app/dto/CambioEstadoFacturaDto';
import { AnularFacturaDto } from 'app/dto/AnularFacturaDto';

import { environment } from '../../environments/environment';
import { AplicarDescuentoFacturaDto } from 'app/dto/AplicarDescuentoFacturaDto';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class FacturasService {
  constructor(private http: HttpClient) {}

  getAllFacturas(
    page: number,
    perPage: number,
    filtro: string,
    estado: string,
    fechaInicio: string,
    fechaFin: string
  ): Observable<FacturaDto[]> {
    return this.http.get(`${apiUrl}/factura`, {
      params: { pagina: page, tamanoPagina: perPage, filtro, estado, fechaInicio, fechaFin },
    }) as Observable<FacturaDto[]>;
  }

  getFactura(idFactura: number): Observable<FacturaDto> {
    return this.http.get(`${apiUrl}/factura/${idFactura}`) as Observable<FacturaDto>;
  }

  postCambiarEstadoFactura(cambioEstadoFactura: CambioEstadoFacturaDto) {
    return this.http.post(`${apiUrl}/factura/cmb_estado`, {
      ...cambioEstadoFactura,
    }) as Observable<FacturaDto>;
  }

  postAnularFactura(anularFacturaDto: AnularFacturaDto) {
    return this.http.post(`${apiUrl}/factura/anular`, {
      ...anularFacturaDto,
    }) as Observable<FacturaDto>;
  }

  postAplicarDescuentoFactura(aplicarDescuentoFacturaDto: AplicarDescuentoFacturaDto) {
    return this.http.post(`${apiUrl}/factura/aplicarDescuento`, {
      ...aplicarDescuentoFacturaDto,
    }) as Observable<AplicarDescuentoFacturaDto>;
  }

  getReporteRecibo(idRecibo: number): Observable<any> {
    return this.http.get(`${apiUrl}/factura/generarRecibo`, {
      params: { idRecibo },
      responseType: 'blob' as 'json',
      observe: 'response',
    }) as Observable<any>;
  }
}
