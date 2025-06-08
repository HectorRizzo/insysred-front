import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AtencionOrdenDto } from '../../../../dto/AtencionOrdenDto';
import { ClienteService } from '../../../../services/cliente.service';
import { RespuestaAPIDto } from '../../../../dto/RespuestaAPIDto';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';

@Component({
  selector: 'app-tecnico-ord-trabajo-atenderOrden',
  templateUrl: './atender-orden.component.html',
  styleUrls: ['./atender-orden.component.css'],
})
export class TecnicoOrdTrabajoAtenderOrdenComponent implements OnInit {
  @Input() ordenTrab: any;
  @Input() watchMode: boolean = false;
  atenderOrdenTrabForm!: FormGroup;
  datConexionForm!:FormGroup;
  configWifiForm!: FormGroup;
  detalleVisitaForm!: FormGroup;
  panelOpenState = false;

  constructor(private fb: FormBuilder,
              private servicio: ClienteService,
              private editDialog: MatDialogRef<TecnicoOrdTrabajoAtenderOrdenComponent>,
              private toast: ToastService) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.atenderOrdenTrabForm = this.fb.group({
      detalle: [this.ordenTrab.descripcion || ''],
    });
    this.datConexionForm = this.fb.group({
      direccionIp:[this.ordenTrab.descripcion || ''],
    });
  }


  atender() {
    const atenderOrden: AtencionOrdenDto = {
      ordenTrabajo: this.ordenTrab.id,
      tecnico: this.ordenTrab.tecnico.id,
      estadoOrden: 'COMPLETADA',
      detalle: this.atenderOrdenTrabForm.get('detalle')?.value,
    };
    this.servicio.atenderOrden(atenderOrden).subscribe(
      (datos: RespuestaAPIDto) => {
        this.toast.showMessage(datos.textMensaje, MessageType.SUCCESS);
        this.editDialog.close();
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      },
    );
  }

  closeDialog(): void {
    this.editDialog.close();
  }
}
