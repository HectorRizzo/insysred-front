import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EmpresaDto} from '../dto/EmpresaDto';

import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private http: HttpClient) { }
  obtenerEmpresa(): Observable<EmpresaDto[]> {
    return this.http.get<EmpresaDto[]>(`${apiUrl}/empresa`);
  }
  obtenerOneEmpresa(): Observable<EmpresaDto> {
    return this.http.get<EmpresaDto>(`${apiUrl}/empresa/1`);
  }
}
