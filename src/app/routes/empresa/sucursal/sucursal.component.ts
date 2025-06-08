import { Component, OnInit } from '@angular/core';
import {SucursalDto} from '../../../dto/SucursalDto';
import {MatDialog} from '@angular/material/dialog';
import {SucursalService} from '../../../services/sucursal.service';
import {SeguridadRolesNuevoComponent} from '../../seguridad/roles/nuevo/nuevo.component';
import {EmpresaSucursalNuevoComponent} from './nuevo/nuevo.component';
import {PageEvent} from '@angular/material/paginator';
import {SeguridadRolesVerComponent} from '../../seguridad/roles/ver/ver.component';
import {EmpresaSucursalVerComponent} from './ver/ver.component';
import {SeguridadRolesEditarComponent} from '../../seguridad/roles/editar/editar.component';
import {EmpresaSucursalEditarComponent} from './editar/editar.component';
import {RolDto} from '../../../dto/RolDto';
import { ModalWarningComponent } from '@shared/components/modal-warning/modal-warning.component';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';

@Component({
  selector: 'app-empresa-sucursal',
  templateUrl: './sucursal.component.html',
  styleUrls: ['./sucursal.component.css']
})
export class EmpresaSucursalComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'establecimiento', 'puntoEmision', 'secuencial', 'acciones'];
  dataSource: SucursalDto[] = [];

  constructor(
    private dialog: MatDialog,
    private servicio: SucursalService,
    private toast: ToastService
  ) { }

  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent | undefined;

  ngOnInit() {
    this.cargarSucursales();
  }
  cargarSucursales(){
    this.servicio.obtenerAllSucursales().subscribe(
      (datos) => {
        this.dataSource = datos;
        this.dataSource.sort((a, b) => a.nombre.localeCompare(b.nombre));
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      }
    );
  }

  openFormModal(){
    const dialogRef = this.dialog.open(EmpresaSucursalNuevoComponent, {
      width: '40%'
    });
    dialogRef.afterClosed()
      .subscribe((value) => {
        if (value){
          this.cargarSucursales();
          this.toast.showMessage('Sucursal creada', MessageType.SUCCESS);
        }
      });
  }

  editarSucursal(sucursal: SucursalDto) {
    const editDialog = this.dialog.open(EmpresaSucursalEditarComponent, {
      width: '40%',
      disableClose: true
    });
    editDialog.componentInstance.sucursal = sucursal;
    editDialog.componentInstance.editable = true;
    editDialog.afterClosed()
      .subscribe((value) => {
        if (value){
          this.cargarSucursales();
          this.toast.showMessage('Sucursal Editada', MessageType.SUCCESS);
        }
      });
  }

  verSucursal(sucursal: SucursalDto){
    const viewDialog = this.dialog.open(EmpresaSucursalEditarComponent, {
      width: '40%',
      disableClose: true
    });
    viewDialog.componentInstance.sucursal = sucursal;
    viewDialog.componentInstance.editable = false;
  }

  updateStatus(event:any, element: SucursalDto){

    const checked = event.source.checked;

    const sucursalEdit: SucursalDto = {
      direccion: element.direccion,
      establecimiento: element.establecimiento,
      id: element.id,
      isActive: checked,
      nombre: element.nombre,
      puntoEmision: element.puntoEmision,
      secuencial: element.secuencial,
      empresa: {
        id: 1,
        ruc: '',
        nombre: '',
        nombreComercial: '',
        direccion: '',
        isActive: true
      }
    };

    const modalWarning = this.dialog.open(ModalWarningComponent, {
      width: 'auto'
    });

    modalWarning.componentInstance.mensaje = '¿Está seguro de cambiar el estado de esta sucursal?';

    modalWarning.componentInstance.labelButtonLeft = 'No';
    modalWarning.componentInstance.labelButtonRight = 'Si';

    modalWarning.componentInstance.respuesta.subscribe(
        (respuesta: boolean) => {
            if (respuesta){
              element.isActive = checked;
              this.servicio.updateSucursal(element.id.toString(), sucursalEdit).subscribe(
                (datos: SucursalDto) => {
                  this.toast.showMessage('Sucursal Editada', MessageType.SUCCESS);
                  this.cargarSucursales();
                },
                (error) => {
                  console.error('Error al cargar datos:', error);
                }
              );
            } else {
              element.isActive = !checked;
            }
    });


  }

  handlePageEvent(e: PageEvent){
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.cargarSucursales();
  }
}
