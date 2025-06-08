import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { SeguridadService } from 'app/services/seguridad.service';

@Component({
    selector: 'app-cambiar-contrasena',
    templateUrl: './cambiar-contrasena.component.html',
    styleUrls: ['./cambiar-contrasena.component.css'],
    })
export class CambiarContrasenaComponent implements OnInit {

    @Input() idUsuario: any;
    @Output() guardado = new EventEmitter();


    constructor(
        private fb: FormBuilder,
        private toast : ToastService,
        private securityService: SeguridadService,
        private dialogRef: MatDialogRef<CambiarContrasenaComponent>
    ) {}
    ngOnInit(): void {
        this.newClientForm.patchValue({
            nuevaContrasena: ''
        });
    }
    newClientForm = this.fb.nonNullable.group({
        nuevaContrasena: ['', [Validators.required]],
        confirmarContrasena: ['', [Validators.required]],
    });

    cambiarContrasena() {
        console.log('Cambiando contraseña');
        if(this.newClientForm.valid) {
            if(this.newClientForm.value.nuevaContrasena === this.newClientForm.value.confirmarContrasena) {
               this.securityService.actualizarContrasena(this.idUsuario, this.newClientForm.value.nuevaContrasena).subscribe({
                     next: (res:any) => {
                          this.toast.showMessage('Contraseña cambiada con éxito', MessageType.SUCCESS);
                          this.guardado.emit(true);
                            this.dialogRef.close();
                     }
                });
            }
            else {
                this.toast.showMessage('Las contraseñas no coinciden', MessageType.ERROR);
            }
        }else{
            console.log('Formulario inválido');
            this.toast.showMessage('Por favor llene todos los campos', MessageType.ERROR);
        }
    }

    cancelar() {
        console.log('Cancelando');
        this.dialogRef.close();
    }
}