import {Component, Input, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SeguridadService} from "../../../../services/seguridad.service";
import {RolDto} from "../../../../dto/RolDto";

@Component({
  selector: 'app-seguridad-roles-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class SeguridadRolesEditarComponent implements OnInit {
  @Input() rol: any;
  @Input() watchMode: boolean = false;
  editRolForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private servicio: SeguridadService,
    private editDialog: MatDialogRef<SeguridadRolesEditarComponent>
  ) {
  }


  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.editRolForm = this.fb.group({
      nombreRol: [this.rol.nombre || '', [Validators.required]],
      descripcionRol: [this.rol.descripcion || ''],
      isActive: [this.rol.isActive],
      status: [this.rol.isActive, [Validators.required]],
    });
  }

  guardarRol() {
    const rolEdit: RolDto = {
      id: this.editRolForm.get('id')?.value,
      nombre: this.editRolForm.get('nombreRol')?.value,
      isActive: this.editRolForm.get('isActive')?.value,
      descripcion: this.editRolForm.get('descripcionRol')?.value
    };

    this.servicio.actualizarRol(this.rol.id, rolEdit).subscribe(
      (datos: RolDto) => {
        this.editDialog.close();
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      }
    );
  }

  closeDialog(): void {
    this.editDialog.close();
  }

}
