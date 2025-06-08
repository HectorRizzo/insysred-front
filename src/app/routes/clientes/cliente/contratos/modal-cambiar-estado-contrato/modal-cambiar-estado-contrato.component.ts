import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { ClientsService } from 'app/services/clients.service';

@Component({
  selector: 'app-modal-cambiar-estado-contrato',
  templateUrl: './modal-cambiar-estado-contrato.component.html',
  styleUrls: ['./modal-cambiar-estado-contrato.component.scss']
})
export class ModalCambiarEstadoContratoComponent {

  tiposEstado = [{id: 1, nombre : 'Activo'}];
  stateId: number;

  @Input() contract: any;

  constructor(
    public dialogRef: MatDialogRef<ModalCambiarEstadoContratoComponent>,
    private clientService: ClientsService,
    private toast: ToastService,
    private fb: FormBuilder
  ) {

  }

  newForm = this.fb.nonNullable.group({
    estadoId: [0, Validators.required]
  });

  ngOnInit(){
    this.obtenerEstadosContrato();
  }

  cambiarEstado(event: any){
    console.log(event);
    this.stateId = event.value;
  }
  saveState(){
    if(this.newForm.invalid){
      return;
    }
    const estado= this.tiposEstado.find((estado) => estado.id === this.newForm.get('estadoId')?.value);
    const body = {
      idContrato: this.contract.numContrato,
      estado
    };
    this.clientService.updateStateContract(body)
      .subscribe((res) => {
        if (res) {
          this.dialogRef.close(true);
        }
      }, (err) => {
        this.toast.showMessage('Ha ocurrido un error', MessageType.ERROR);
      });
  }

  closeModal(){
    this.dialogRef.close();
  }

  obtenerEstadosContrato(){
    this.clientService.getEstadosContrato()
      .subscribe((res) => {
        this.tiposEstado = res.data;
        if(this.contract.estadoContrato !== null){
          console.log(this.contract.estadoContrato.id);
          this.newForm.get('estadoId')?.setValue(this.contract.estadoContrato.id);
          this.stateId = this.contract.estadoContrato.id;
        }          
      }, (err) => {
        this.toast.showMessage('Ha ocurrido un error', MessageType.ERROR);
      });
  }

}
