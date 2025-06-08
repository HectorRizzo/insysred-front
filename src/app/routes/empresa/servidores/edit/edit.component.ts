import { Component, OnInit, Input } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DateAdapter} from '@angular/material/core';
import {TranslateService} from '@ngx-translate/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ServidoresService} from '../../../../services/servidores.service';
import {Subscription} from 'rxjs';
import {RouterDto} from '../../../../dto/RouterDto';
import { createMask } from '@ngneat/input-mask';

@Component({
  selector: 'app-empresa-servidores-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EmpresaServidoresEditComponent implements OnInit {

  @Input() servidor: RouterDto;

  sucursalId = Number(localStorage.getItem('cod_suc'));
  editServertForm: FormGroup;

  translateSubscription!: Subscription;
  ipAddressMask = createMask({ alias: 'ip' });

  constructor(
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<any>,
    private translate: TranslateService,
    private servicio: ServidoresService,
    private dialogRef: MatDialogRef<EmpresaServidoresEditComponent>
  ) {}

  buildForm(){
    this.editServertForm = this.fb.nonNullable.group({
      nombre: [this.servidor.nombre || '', [Validators.required]],
      usuario: [this.servidor.usuario || '', [Validators.required]],
      ip: [this.servidor.ip || '', [Validators.required]],
      puerto: [this.servidor.puerto || 0, [Validators.required]],
      gateway: [this.servidor.gateway || '', [Validators.required]],
    });
  }

  ngOnInit() {
    this.translateSubscription = this.translate.onLangChange.subscribe((res: { lang: any }) => {
      this.dateAdapter.setLocale(res.lang);
    });
    this.buildForm();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  guardarDialog() {

    const { value } = this.editServertForm;
    const { nombre, usuario, ip, puerto, gateway } = value;

    const editedServer: Partial<RouterDto> = {
      nombre: nombre || '',
      usuario: usuario || '',
      ip: ip || '',
      puerto: puerto || 0,
      gateway: gateway || '',
    };

    this.servicio.editarServidor(editedServer, this.servidor.id).subscribe(
      (datos: RouterDto) => {
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      }
    );
  }

}
