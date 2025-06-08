import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PlanService } from 'app/services/plans.service';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-modal-crear-plan',
  templateUrl: './modal-crear-plan.component.html',
  styleUrls: ['./modal-crear-plan.component.scss'],
})
export class ModalCrearPlanComponent {

  createPlanForm!: FormGroup;

  sucursalId = Number(localStorage.getItem('cod_suc'));

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalCrearPlanComponent>,
    private planService: PlanService,
  ) {
    this.buildForm();
  }

  buildForm() {
    this.createPlanForm = this.fb.nonNullable.group({
      name: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      megabytes: [0, [Validators.required, Validators.min(1), Validators.max(1000)]],
      price: [0, [Validators.required, Validators.min(1), Validators.max(500)]],
      status: [true, [Validators.required]],
    });
  }

  savePlan(){
    const { value } = this.createPlanForm;
    const { descripcion, megabytes, name, price, status } = value;
    this.planService.createPlan({
      descripcion: String(descripcion || '').toUpperCase(),
      megabytes: megabytes || 1,
      name: String(name || '').toUpperCase(),
      price: price || 1,
      status,
      sucursales: this.sucursalId
    }).subscribe((res) => {
      this.closeModal(res);
    });
  }

  closeModal(res?: any) {
    this.dialogRef.close(res);
  }

}
