import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {FormBuilder, Validators} from '@angular/forms';
import {DateAdapter} from '@angular/material/core';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { UsuarioService } from 'app/services/usuario.service';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { ModalInfoComponent } from '@shared/components/modal-info/modal-info.component';
import { UsuarioDto } from 'app/dto/UsuarioDto';
import { Router } from '@angular/router';
import { InventarioEquiposService } from 'app/services/inventarioEquipos';
import { MarcaEquipoDto } from 'app/dto/MarcaEquipoDto';


@Component({
  selector: 'app-editar-marca-equipo',
  templateUrl: './editar-marca-equipo.component.html',
  styleUrls: ['./editar-marca-equipo.component.css']
})
export class EditarMarcaEquipoComponent implements OnInit {
  @Input() marcaEquipo: MarcaEquipoDto;
  @Output() guardado = new EventEmitter();
  

  constructor(
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<any>,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<EditarMarcaEquipoComponent>,
    private toast : ToastService,
    private inventarioEquiposService: InventarioEquiposService,
  ) {
  }

  newClientForm = this.fb.nonNullable.group({
    nombreMarca: ['', [Validators.required]],
    nombreModelo: ['', [Validators.required]],
    });
    @ViewChild('myTextarea') myTextarea: ElementRef;
  translateSubscription!: Subscription;


  ngOnInit() {
    this.translateSubscription = this.translate.onLangChange.subscribe((res: { lang: any }) => {
      this.dateAdapter.setLocale(res.lang);
    });
    this.llenarFormulario();
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

  llenarFormulario(): void {
    this.newClientForm.patchValue({
      nombreMarca: this.marcaEquipo.nombreMarca,
      nombreModelo: this.marcaEquipo.nombreModelo
    });
  }


  saveClient(): void {
    console.log(this.newClientForm.value);
    const marcaEquipo = this.newClientForm.value;
    this.inventarioEquiposService.actualizarMarcaEquipo(this.marcaEquipo.id,marcaEquipo).subscribe({
      next: res => {
        this.toast.showMessage('Marca Equipo creado con éxito', MessageType.SUCCESS);
        this.guardado.emit(true);
        this.closeDialog();
      },
      error: error => {
        console.error('Error:', error);
        this.toast.showMessage('Error al crear Marca Equipo', MessageType.ERROR);
      }
    });
  }

}
