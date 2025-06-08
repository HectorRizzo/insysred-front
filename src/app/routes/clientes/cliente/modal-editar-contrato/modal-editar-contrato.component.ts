import { Component, Input, OnInit } from '@angular/core';
import { ClientsService, Contract } from 'app/services/clients.service';

import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanService, Plan } from 'app/services/plans.service';
import { UserData } from '../cliente.component';
import { RouterDto } from 'app/dto/RouterDto';
import { ServidoresService } from 'app/services/servidores.service';

@Component({
  selector: 'app-modal-editar-contrato',
  templateUrl: './modal-editar-contrato.component.html',
  styleUrls: ['./modal-editar-contrato.component.scss']
})
export class ModalEditarContratoComponent {

  @Input() contract: any;
  @Input() cliente: UserData;
  @Input() watchMode: boolean = false;
  editContractForm: FormGroup;

  plans: Plan[] = [];
  servidores: RouterDto[] = [];

  idSucursal = Number(localStorage.getItem('cod_suc'));

  constructor(
    public dialogRef: MatDialogRef<ModalEditarContratoComponent>,
    private fb: FormBuilder,
    private planService: PlanService,
    private clientService: ClientsService,
    private servidoresService: ServidoresService
  ) {
    this.getPlans();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  getPlans(){
    this.planService.getPlans(0, 1000, this.idSucursal, '', 't')
      .subscribe((res: any) => {
        this.plans = res.content;
      });

      this.servidoresService.obtenerRoutersBySuc(String(this.idSucursal))
      .subscribe((res: any) => {
        this.servidores = Array.from(res);
      });
  }

  buildForm(){
    if (this.watchMode){
      this.editContractForm = this.fb.nonNullable.group({
        planId: [this.contract.plan.id, [Validators.required]],
        servidorId: [this.contract.servidor.id, [Validators.required]],
        ubicacion: [this.contract.referencia, [Validators.required]],
        ip: [this.contract.ip, []],
        mac: [this.contract.mac, []],
        georeferencia: [this.contract.georeferencia || null, [Validators.required]],
        duracionMeses: [this.contract.duracionMeses, [Validators.required, Validators.min(12), Validators.max(1000)]],
        status: [this.contract.isActive, [Validators.required]],
      });
    }
  }

  editContract(){
    const { value } = this.editContractForm;
    const { planId, ubicacion, georeferencia, duracionMeses, status, ip, mac } = value;
    this.clientService.updateClientContract({
      id: this.contract.id,
      clientId: this.contract.clientId,
      planId,
      ubicacion,
      georeferencia,
      duracionMeses,
      ip,
      mac,
      isActive: status
    }).subscribe((res) => {
      console.log(res);
      this.closeModal();
    });

  }


  closeModal(){
    this.dialogRef.close();
  }

}
