import {Component, OnInit} from '@angular/core';
import {SeguridadUsuarioNuevoComponent} from '../usuario/nuevo/nuevo.component';
import {SeguridadPermisosNuevoComponent} from './nuevo/nuevo.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PermisosXRolDTO } from 'app/dto/PermisosXRolDTO';
import { SeguridadService } from 'app/services/seguridad.service';
import { ModalWarningComponent } from '@shared/components/modal-warning/modal-warning.component';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';

@Component({
  selector: 'app-seguridad-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.css']
})
export class SeguridadPermisosComponent implements OnInit {
  displayedColumns: string[] = ['idRol', 'idModulo', 'estado'];
  dataSource = new MatTableDataSource<PermisosXRolDTO>([]);

  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];
  filter = '';
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  pageEvent: PageEvent | undefined;
  constructor(
    private dialog: MatDialog, private router: Router,
    private seguridadService: SeguridadService,
    private toast: ToastService
  ) {
  }

  ngOnInit() {
    this.getPermisosXRol();
  }

  openFormModal(): void {
    this.router.navigate(['/seguridad/permisos/nuevo-permiso']);
  }

    
  handlePageEvent(e: PageEvent){
    console.log('Page Event:', e);
    console.log(this.dataSource.filter);
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getPermisosXRol(this.pageIndex, this.pageSize, this.filter);
  }

  getPermisosXRol(pageIndex = 0, pageSize = 5, filter = '') {
    this.seguridadService.obtenerPermisosXRol(pageIndex, pageSize, filter).subscribe({
      next: res => {
        console.log('Permisos:', res);
        this.dataSource = new MatTableDataSource(res.data.content);
        this.length = res.data.totalElements;
        
      },
      error: error => {
        console.log('Error:', error);
      },
    });
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim();
    this.filter = filterValue.trim();
    this.getPermisosXRol(this.pageIndex, this.pageSize, this.filter);
  }

  updateStatus(event: any, permiso: PermisosXRolDTO){
    console.log('Update Status:', event, permiso);
    const checked = event.source.checked;
    const modalWarning = this.dialog.open(ModalWarningComponent, {
      width: 'auto'
    });

    modalWarning.componentInstance.mensaje = '¿Está seguro de cambiar el estado de este permiso?';

    modalWarning.componentInstance.labelButtonLeft = 'No';
    modalWarning.componentInstance.labelButtonRight = 'Si';

    modalWarning.componentInstance.respuesta.subscribe(
        (respuesta: boolean) => {
            if (respuesta){
              this.seguridadService.actualizarPermisoXRol(permiso.id, event.checked).subscribe({
                next: res => {
                  this.toast.showMessage('Permiso actualizado con éxito', MessageType.SUCCESS);
                  this.getPermisosXRol(this.pageIndex, this.pageSize, this.filter);
                },
                error: error => {
                  console.log('Error:', error);
                },
              });
            } else{
              permiso.activo = !checked;
            }
    });
  }
}
