import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientsService } from 'app/services/clients.service';
import { UserData } from '../cliente.component';
import { PlanService, Plan } from 'app/services/plans.service';
import { RouterDto } from 'app/dto/RouterDto';
import { ServidoresService } from 'app/services/servidores.service';
import { createMask } from '@ngneat/input-mask';

@Component({
  selector: 'app-modal-crear-contrato',
  templateUrl: './modal-crear-contrato.component.html',
  styleUrls: ['./modal-crear-contrato.component.scss']
})
export class ModalCrearContratoComponent implements OnInit {

  @Input() cliente: UserData;

  createContractForm: FormGroup;

  idSucursal = Number(localStorage.getItem('cod_suc'));

  plans: Plan[] = [];
  servidores: RouterDto[] = [];

  ipAddressMask = createMask({ alias: 'ip' });
  macAddressMask = createMask({ alias: 'mac' });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalCrearContratoComponent>,
    private clientService: ClientsService,
    private plansService: PlanService,
    private servidoresService: ServidoresService
  ) {
    this.getPlans();
  }

  ngOnInit(): void {
      this.buildForm();
  }

  buildForm(){
    this.createContractForm = this.fb.nonNullable.group({
      planId: [null, [Validators.required]],
      servidorId: [null, [Validators.required]],
      ubicacion: ['', [Validators.required]],
      georeferencia: [' ' ],
      ip: ['', [Validators.required]],
      mac: ['', [Validators.required]],
      duracionMeses: [12, [Validators.min(12), Validators.max(1000)]],
      status: [true, [Validators.required]],
    });
  }

  getPlans(){
    this.plansService.getPlans(
      0,
      100,
      this.idSucursal,
      '','t'
    )
      .subscribe((res: any) => {
        const content = res.content || [];
        this.plans = content;
      });

    this.servidoresService.obtenerRoutersBySuc(String(this.idSucursal))
      .subscribe((res: any) => {
        this.servidores = Array.from(res);
      });

  }

  saveContract(){
    const { value } = this.createContractForm;
    const { planId, ubicacion, georeferencia, duracionMeses, status, servidorId, ip, mac } = value;
    this.clientService.createClientContract({
      cliente: this.cliente.id,
      sucursal: this.idSucursal,
      servidor: servidorId,
      plan: planId,
      longitud: ' ',
      referencia: ubicacion,
      georeferencia,
      ip,
      mac,
      duracionMeses,
      isActive: status
    }).subscribe((res) => {
      this.closeModal(res);
    });

  }

  closeModal(res?: any){
    this.dialogRef.close(res);
  }

}
