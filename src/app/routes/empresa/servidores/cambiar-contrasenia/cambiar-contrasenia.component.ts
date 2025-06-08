import { Component, Input, OnInit } from '@angular/core';
import { RouterDto } from 'app/dto/RouterDto';
import {MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { ServidoresService } from 'app/services/servidores.service';

@Component({
  selector: 'app-cambiar-contrasenia',
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.css']
})
export class CambiarContraseniaComponent implements OnInit {

  @Input() servidor: RouterDto;
  cambiarContraseniaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CambiarContraseniaComponent>,
    private toast: ToastService,
    private servicio: ServidoresService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(){
    this.cambiarContraseniaForm = this.fb.nonNullable.group({
      nuevaContrasenia: ['', Validators.required],
      confirmarNuevaContrasenia: ['', Validators.required]
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  guardarDialog(){
    const { value } = this.cambiarContraseniaForm;
    const { nuevaContrasenia, confirmarNuevaContrasenia } = value;
    if (nuevaContrasenia !== confirmarNuevaContrasenia){
      this.toast.showMessage("Las contraseñas no son iguales", MessageType.ERROR);
    } else {
      const body = {
        ip: this.servidor.ip,
        password: nuevaContrasenia
      }
      this.servicio.cambiarContrasenia(body)
        .subscribe(
          (datos: RouterDto) => {
            this.dialogRef.close(true);
          },
          (error) => {
            this.toast.showMessage("Ha ocurrido un error", MessageType.ERROR);
          }
        )
     }
  }

}
