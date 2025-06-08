import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {DateAdapter} from "@angular/material/core";
import {TranslateService} from "@ngx-translate/core";
import {MatDialogRef} from "@angular/material/dialog";
import {Subscription} from "rxjs";
import {RolDto} from "../../../../dto/RolDto";
import {SeguridadService} from "../../../../services/seguridad.service";

@Component({
  selector: 'app-seguridad-roles-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class SeguridadRolesNuevoComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<any>,
    private translate: TranslateService,
    private servicio: SeguridadService,
    private dialogRef: MatDialogRef<SeguridadRolesNuevoComponent>
  ) {
  }

  newRoltForm = this.fb.nonNullable.group({
    nombreRol: ['', [Validators.required]],
    descripcionRol: ['']
  });

  translateSubscription!: Subscription;

  ngOnInit() {
    this.translateSubscription = this.translate.onLangChange.subscribe((res: { lang: any }) => {
      this.dateAdapter.setLocale(res.lang);
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  guardarDialog() {
    const newRol: RolDto = {
      id: 0,
      nombre: this.newRoltForm.get('nombreRol')?.value || '',
      isActive: true,
      descripcion: this.newRoltForm.get('nombreRol')?.value|| '',
    }

    this.servicio.crearRol(newRol).subscribe(
      (datos: RolDto) => {
        this.dialogRef.close();
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      }
    );
  }

}
