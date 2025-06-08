import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { EquipoDto } from 'app/dto/EquipoDto';
import { Observable } from 'rxjs';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})

export class InventarioEquiposService {

    constructor(private http: HttpClient) {}

  getEquipos(page: number, perPage: number, filtros: any): Observable<EquipoDto[]>{
    let httpParams = new HttpParams()
    .set('pagina', page)
    .set('tamanoPagina', perPage);

    if(filtros.factura){
      httpParams = httpParams.set('factura', filtros.factura);
    }

    if(filtros.marca){
      httpParams = httpParams.set('idMarcaEquipo', filtros.marca);
    }

    if(filtros.fechaInicio){
      httpParams = httpParams.set('fechaCompraStart', filtros.fechaInicio);
    }

    if(filtros.fechaFin){
      httpParams = httpParams.set('fechaCompraEnd', filtros.fechaFin);
    }

    if(filtros.estado){
      httpParams = httpParams.set('estado', filtros.estado);
    }
    if(filtros.activo){
      httpParams = httpParams.set('activo', filtros.activo);
    }



    return this.http.get(`${apiUrl}/inventarioEquipos`, {
      params: httpParams
    }) as Observable<EquipoDto[]>;
  }

  getEquipo(equipoId: number): Observable<EquipoDto>{
    return this.http.get(`${apiUrl}/inventarioEquipos/${equipoId}`) as Observable<EquipoDto>;
  }

  createEquipo(equipo: any){
    return this.http.post(`${apiUrl}/inventarioEquipos`, { ...equipo },) as Observable<EquipoDto>;
  }

  updateEquipo(equipo: any){
    return this.http.put(`${apiUrl}/inventarioEquipos/${equipo.id}`, { ...equipo },) as Observable<EquipoDto>;
  }

  getMarcaEquipos(): Observable<any>{
    return this.http.get(`${apiUrl}/marcaEquipos`) as Observable<any>;
  }

  guardarEquipos(equipos : EquipoDto[]){
    return this.http.post(`${apiUrl}/inventarioEquipos `, equipos,) as Observable<EquipoDto>;
  }

  getEstadosEquipo(){
    return this.http.get(`${apiUrl}/inventarioEquipos/estados`) as Observable<any>;
  }

  actualizarEquipo(id: number, equipo: EquipoDto){
    return this.http.put(`${apiUrl}/inventarioEquipos/${id}`, equipo) as Observable<any>;
  }

  getMarcaEquipoPage(page: number, perPage: number, filtros: any): Observable<any>{
  
    let httpParams = new HttpParams()
    .set('pagina', page)
    .set('tamanoPagina', perPage);

    if(filtros){
      httpParams = httpParams.set('filtro', filtros);
    }

    return this.http.get(`${apiUrl}/marcaEquipos/paginacion`, {
      params: httpParams
    }) as Observable<any>;
  }

  guardarMarcaEquipo(marcaEquipo: any){
    return this.http.post(`${apiUrl}/marcaEquipos`, marcaEquipo,) as Observable<any>;
  }

  actualizarMarcaEquipo(id: any, marcaEquipo: any){
    console.log(marcaEquipo);
    return this.http.put(`${apiUrl}/marcaEquipos/${id}`,marcaEquipo,) as Observable<any>;
  }

  obtenerEstadosEquipo(){
    return this.http.get(`${apiUrl}/inventarioEquipos/estados`) as Observable<any>;
  }

}