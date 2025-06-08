import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {DateAdapter} from '@angular/material/core';
import {TranslateService} from '@ngx-translate/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ServidoresService} from '../../../../services/servidores.service';
import {Subscription} from 'rxjs';
import {RouterDto} from '../../../../dto/RouterDto';
import {RouterNewDto} from '../../../../dto/RouterNewDto';
import { createMask } from '@ngneat/input-mask';

@Component({
  selector: 'app-empresa-servidores-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class EmpresaServidoresNuevoComponent implements OnInit {

  sucursalId = Number(localStorage.getItem('cod_suc'));

  ipAddressMask = createMask({ alias: 'ip' });

  constructor(
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<any>,
    private translate: TranslateService,
    private servicio: ServidoresService,
    private dialogRef: MatDialogRef<EmpresaServidoresNuevoComponent>
  ) {
  }

  newServertForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    usuario: ['', [Validators.required]],
    password: ['', [Validators.required]],
    ip: ['', [Validators.required]],
    puerto: [0, [Validators.required]],
    gateway: ['', [Validators.required]],
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

    const { value } = this.newServertForm;
    const { nombre, usuario, password, ip, puerto, gateway } = value;

    const newServer: RouterNewDto = {
      nombre: nombre || '',
      usuario: usuario || '',
      password: password || '',
      ip: ip || '',
      puerto: puerto || 0,
      gateway: gateway || '',
      isActive: true,
      sucursal:  this.sucursalId || 0,
    };

    this.servicio.crearServidor(newServer).subscribe(
      (datos: RouterDto) => {
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      }
    );
  }

}
