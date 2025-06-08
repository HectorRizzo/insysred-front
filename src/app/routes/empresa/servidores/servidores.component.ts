import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ServidoresService} from '../../../services/servidores.service';
import {RouterDto} from '../../../dto/RouterDto';
import {EmpresaServidoresNuevoComponent} from './nuevo/nuevo.component';
import {CambioEstadoDto} from '../../../dto/CambioEstadoDto';
import {EmpresaServidoresAsignarComponent} from './asignar/asignar.component';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { ModalWarningComponent } from '@shared/components/modal-warning/modal-warning.component';
import { EmpresaServidoresEditComponent } from './edit/edit.component';
import { CambiarContraseniaComponent } from './cambiar-contrasenia/cambiar-contrasenia.component';
import { EmpresaServidoresConfigurarComponent } from './configurar/configurar.component';

@Component({
  selector: 'app-empresa-servidores',
  templateUrl: './servidores.component.html',
  styleUrls: ['./servidores.component.css']
})
export class EmpresaServidoresComponent implements OnInit {
  displayedColumns: string[] = [
    'nombre',
    'usuario',
    'ip',
    'puerto',
    'gateway',
    'sucursal',
    'isActive',
    'acciones'
  ];
  dataSource: RouterDto[] = [];

  constructor(
    private dialog: MatDialog,
    private servicio: ServidoresService,
    private toast: ToastService
    ) {
  }

  ngOnInit() {
    this.cargarServidores();
  }

  openFormModal() {
    const dialogRef = this.dialog.open(EmpresaServidoresNuevoComponent, {
      width: '40%'
    });
    dialogRef.afterClosed()
      .subscribe((value) => {
        if (value){
          this.toast.showMessage('Servidor creado', MessageType.SUCCESS);
          this.cargarServidores();
        }
      });
  }

  cargarServidores() {
    const idSucursal = localStorage.getItem('cod_suc');
    if (idSucursal) {
      this.servicio.obtenerRoutersAll().subscribe(
        (datos) => {
          this.dataSource = datos;
        },
        (error) => {
          console.error('Error al cargar datos:', error);
        }
      );
    } else {
      console.error('No se pudo obtener el ID de sucursal desde el almacenamiento local.');
    }
  }

  updateStatus(element: RouterDto, event: any) {
    const cambioEstado: CambioEstadoDto = { estatus: event.checked, idComponent: element.id };

    const modalWarning = this.dialog.open(ModalWarningComponent, {
      width: 'auto'
    });

    const snap = event.source.checked;

    modalWarning.componentInstance.mensaje = '¿Está seguro de cambiar el estado de este servidor?';

    modalWarning.componentInstance.labelButtonLeft = 'No';
    modalWarning.componentInstance.labelButtonRight = 'Si';

    modalWarning.componentInstance.respuesta.subscribe(
      (respuesta: boolean) => {
          if (respuesta){
            element.isActive = snap;

            this.servicio.cambioEstadoServidor(cambioEstado).subscribe(
              (datos: RouterDto) => {
                this.toast.showMessage('Servidor actualizado', MessageType.SUCCESS);
              },
              (error) => {
                console.error('Error al cargar datos:', error);
              }
            );

          } else {
              element.isActive = !snap;
          }
    });


  }

  editarServidor(element: RouterDto) {

    const editDialog = this.dialog.open(EmpresaServidoresEditComponent, {
      width: '40%'
    });
    editDialog.componentInstance.servidor = element;
    editDialog.afterClosed()
    .subscribe((value) => {
      if (value){
        this.toast.showMessage('Servidor actualizado', MessageType.SUCCESS);
        this.cargarServidores();
      }
    });
  }

  cambiarContrasenia(element: RouterDto){
    const cambiarContraseniaDialog = this.dialog.open(CambiarContraseniaComponent, {
      width: '40%'
    });
    cambiarContraseniaDialog.componentInstance.servidor = element;
    cambiarContraseniaDialog.afterClosed()
    .subscribe((value) => {
      if (value){
        this.toast.showMessage('Contraseña actualizada', MessageType.SUCCESS);
        this.cargarServidores();
      }
    });
  }

  asignarSucursal(element: RouterDto) {
    const editDialog = this.dialog.open(EmpresaServidoresAsignarComponent, {
      width: '60%',
      disableClose: true
    });
    editDialog.componentInstance.routerDto = element;
    editDialog.afterClosed()
      .subscribe((value) => {
        if (value){
          this.cargarServidores();
          this.toast.showMessage('Servidor actualizado', MessageType.SUCCESS);
        }
      });
  }

  ConfigureServer(element: RouterDto) {
    const configDialog = this.dialog.open(EmpresaServidoresConfigurarComponent, {
      width: '80%'
    });
    configDialog.componentInstance.servidor = element;
    configDialog.afterClosed()
      .subscribe((value) => {
        if (value){
          this.toast.showMessage('Servidor actualizado', MessageType.SUCCESS);
          this.cargarServidores();
        }
      });
  }
}
