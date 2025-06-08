import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanService } from 'app/services/plans.service';

@Component({
  selector: 'app-modal-editar-plan',
  templateUrl: './modal-editar-plan.component.html',
  styleUrls: ['./modal-editar-plan.component.scss']
})
export class ModalEditarPlanComponent implements OnInit {

  @Input() plan: any;
  @Input() watchMode: boolean = false;
  editPlanForm!: FormGroup;

  sucursalId = Number(localStorage.getItem('cod_suc'));

  constructor(
    public dialogRef: MatDialogRef<ModalEditarPlanComponent>,
    private fb: FormBuilder,
    private planService: PlanService
  ) {
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(){
      this.editPlanForm = this.fb.nonNullable.group({
        name: [this.plan.name || '', [Validators.required]],
        descripcion: [this.plan.descripcion || '', [Validators.required]],
        megabytes: [this.plan.megabytes || 0, [Validators.required, Validators.min(1), Validators.max(1000)]],
        price: [this.plan.price || 0, [Validators.required, Validators.min(1), Validators.max(500)]],
        status: [{ value: this.plan.status, disabled: this.watchMode }, [Validators.required]],
      });
  }

  toggleEvent(event: any){
    const { checked } = event;
      this.plan.status = checked;
  }

  editPlan(){
    const { value } = this.editPlanForm;
    const { descripcion, megabytes, name, price, status } = value;
    this.planService.updatePlan({
      id: this.plan.id,
      descripcion: String(descripcion || '').toUpperCase(),
      megabytes: megabytes || 1,
      name: String(name || '').toUpperCase(),
      price: price || 1,
      status,
      sucursales: this.sucursalId,
      envioMicrotick: this.plan.envioMicrotick
    }).subscribe((res) => {
      this.closeModal(res);
    });
  }

  closeModal(res?: any){
    this.dialogRef.close(res);
  }

}
