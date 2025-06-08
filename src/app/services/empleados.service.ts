import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { DepartamentoDTO } from 'app/dto/DepartamentoDTO';
import { Observable } from 'rxjs';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService{
    constructor(private http: HttpClient) { }


    //empleados
    obtenerEmpleados(page: number=0, size: number=5, filter: string=''): Observable<any> {
        const httpParams = new HttpParams()
            .set('page', page)
            .set('size', size)
            .set('filter', filter);
        return this.http.get(`${apiUrl}/empleados`, { params: httpParams }) as Observable<any>;
    }

    guardarEmpleado(empleado: any): Observable<any> {
        return this.http.post<any>(`${apiUrl}/empleados`, empleado);
    }

    editarEmpleado(empleado: any, id: any): Observable<any> {
        return this.http.put<any>(`${apiUrl}/empleados/${id}`, empleado);
    }

    inactivarEmpleado(id: any): Observable<any> {
        return this.http.put<any>(`${apiUrl}/empleados/${id}/inactivar`, {});
    }

    //cargos
    obtenerCargos(): Observable<any> {
        return this.http.get(`${apiUrl}/cargo`) as Observable<any>;
    }

    guardarCargo(cargo: DepartamentoDTO): Observable<DepartamentoDTO> {
        return this.http.post<DepartamentoDTO>(`${apiUrl}/cargos`, cargo);
    }

    editarCargo(cargo: DepartamentoDTO, id: any): Observable<DepartamentoDTO> {
        return this.http.put<DepartamentoDTO>(`${apiUrl}/cargos/${id}`, cargo);
    }

    obtenerCargoPorDepartamento(id: any): Observable<any> {
        return this.http.get(`${apiUrl}/cargos/departamento/${id}`) as Observable<any>;
    }


    //departamentos
    obtenerDepartamentos(): Observable<any> {
        return this.http.get(`${apiUrl}/departamento`) as Observable<any>;
    }

    guardarDepartamento(departamento: DepartamentoDTO): Observable<DepartamentoDTO> {
        console.log(departamento);
        return this.http.post<DepartamentoDTO>(`${apiUrl}/departamento`, departamento);
    }

    editarDepartamento(departamento: DepartamentoDTO, id: any): Observable<DepartamentoDTO> {
        return this.http.put<DepartamentoDTO>(`${apiUrl}/departamento/${id}`, departamento);
    }

    //asignar 
    asignarDepartamento(asignarDepartamento:any): Observable<any> {
        return this.http.post<any>(`${apiUrl}/empleados/asignar_departamento`, asignarDepartamento);
    }

    asignarCargo(asignarCargo: any): Observable<any> {
        return this.http.post<any>(`${apiUrl}/empleados/asignar_cargo`, asignarCargo);
    }

    asignarJefe(asignarJefe: any): Observable<any> {
        return this.http.post<any>(`${apiUrl}/empleados/asignar_jefe`, asignarJefe);
    }

}