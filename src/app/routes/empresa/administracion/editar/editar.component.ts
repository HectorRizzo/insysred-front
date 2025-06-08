import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {EmpresaAdministracionComponent} from "../administracion.component";
import {Validators} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-empresa-administracion-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EmpresaAdministracionEditarComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<EmpresaAdministracionComponent>
  ) { }
  /*editEmpresaForm = this.fb.nonNullable.group({
    tipoidentificacion: ['', [Validators.required]],
    identificacion: ['', [Validators.required]],
    sexo: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    nombres: ['', [Validators.required]],
    telefono: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    direccion: ['']
  });
*/
  translateSubscription!: Subscription;

  ngOnInit() {
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
