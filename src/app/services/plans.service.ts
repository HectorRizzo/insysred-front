import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

export interface Plan {
  id: number;
  name: string;
  descripcion: string;
  megabytes: number;
  price: number;
  status: boolean;
  sucursales: number;
  envioMicrotick: boolean | null;
}

@Injectable({
  providedIn: 'root',
})
export class PlanService {

  constructor(private http: HttpClient) {}

  getPlans(page: number, perPage: number, idSucursal: number, filtro: string, estado:string): Observable<Plan[]>{
    const headers = new HttpHeaders({ Idsucursal: String(idSucursal), estado: String(estado) });
    return this.http.get(
      `${apiUrl}/planes`,
      {
        headers,
        params: { pagina: page, tamanoPagina: perPage, filtro },
      }
    ) as Observable<Plan[]>;
  }

  createPlan(plan: Partial<Plan>): Observable<any>{
    return this.http.post(`${apiUrl}/planes`, { ...plan } ) as Observable<Plan>;
  }

  updatePlan(plan: Plan): Observable<Plan>{
    return this.http.put(`${apiUrl}/planes/${plan.id}`, { ...plan },) as Observable<Plan>;
  }

  updatePlanStatus(planId: number, status: boolean){
    return this.http.post(`${apiUrl}/planes/cmb_estado`, {
      idComponent: planId,
      estatus: status
    },) as Observable<Plan>;
  }

}
