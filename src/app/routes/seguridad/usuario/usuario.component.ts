import { Component, OnInit, ViewChild } from '@angular/core';
import {SeguridadUsuarioNuevoComponent} from './nuevo/nuevo.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import { UsuarioService } from 'app/services/usuario.service';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioDto } from 'app/dto/UsuarioDto';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EditarUsuarioComponent } from './editar/editar.component';
import { ModalWarningComponent } from '@shared/components/modal-warning/modal-warning.component';
import { ModalAsignarSucursalComponent } from './components/modal-asignar-sucursal/modal-asignar-sucursal.component';
import { ModalAsignarRolComponent } from './components/modal-asignar-rol/modal-asignar-rol.component';
import { SeguridadService } from 'app/services/seguridad.service';
import { ModalInfoComponent } from '@shared/components/modal-info/modal-info.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { ModalEmpleadoComponent } from './components/modal-empleado/modal-empleado.component';
import { VerDatosComponent } from './components/ver-datos/ver-datos.component';
@Component({
  selector: 'app-seguridad-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class SeguridadUsuarioComponent implements OnInit {

  displayedColumns: string[] = ['identificacion', 'username', 'nombres', 'email','celular','acciones'];
  dataSource = new MatTableDataSource<UsuarioDto>([]);

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
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | undefined;
  @ViewChild(MatSort, { static: true }) sort: MatSort | undefined;
  constructor(
    private dialog: MatDialog, 
    private router: Router,
    private usuarioService: UsuarioService,
    private toast: ToastService,
    private securityService: SeguridadService,
    private clipboard: Clipboard
  ) { }

  ngOnInit() {
    this.getUsuarios();
  }

  openFormModal(): void {
    const dialogRef = this.dialog.open(ModalEmpleadoComponent, {
      width: '80%', // Ajusta el tamaño según tus necesidades
    });
  }

  getUsuarios(pageIndex = 0, pageSize = 5, filtro= ''){
    this.usuarioService.obtenerUsuarios(pageIndex, pageSize, filtro).subscribe({
      next: res => {
        console.log('Usuarios:', res);
        this.dataSource = new MatTableDataSource(res.content);
        this.length = res.totalElements;
      },
      error: error => {
        console.log('Error:', error);
        this.toast.showMessage('Error al obtener los usuarios', MessageType.ERROR);
      },
    });
  }

  
  handlePageEvent(e: PageEvent){

    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getUsuarios(this.pageIndex, this.pageSize, this.filter);
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.filter = filterValue;
    this.getUsuarios(this.pageIndex, this.pageSize, this.filter);

  }
  updateStatus(usuario: UsuarioDto) {
    const modalWarning = this.dialog.open(ModalWarningComponent, {
      width: 'auto'
    });

    modalWarning.componentInstance.mensaje = '¿Está seguro de eliminar este usuario?';

    modalWarning.componentInstance.labelButtonLeft = 'No';
    modalWarning.componentInstance.labelButtonRight = 'Si';

    modalWarning.componentInstance.respuesta.subscribe(
        (respuesta: boolean) => {
            if (respuesta){
              this.usuarioService.actualizarUsuario(usuario.id, usuario, false).subscribe({
                next: res => {
                  console.log('Usuario actualizado con éxito', res);
                  this.toast.showMessage('Usuario eliminado con éxito', MessageType.SUCCESS);
                  this.getUsuarios();
                },
                error: error => {
                  console.error('Error:', error);
                  this.toast.showMessage('Error al eliminar el usuario', MessageType.ERROR);
                }
              });
            } 
    });
   
  }

  verDatos(usuario: any) {
    console.log('Editando usuario:', usuario);
    const dialogRef = this.dialog.open(VerDatosComponent, {
      width: '40%', // Ajusta el tamaño según tus necesidades
    });
    console.log('id:', usuario.id);
    dialogRef.componentInstance.empleado = usuario?.empleado;
    dialogRef.componentInstance.soloVer = true;

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getUsuarios();
    });
  }

  asignarRol(usuario: any) {
    console.log('Asignando rol a usuario:', usuario);
    const modalAddRol = this.dialog.open(ModalAsignarRolComponent, {
      width: '40%',
      disableClose: true
    });
    modalAddRol.componentInstance.idUsuario = usuario.id;
    modalAddRol.afterClosed()
      .subscribe((value)=>{
        if(value){
          this.getUsuarios();
          this.toast.showMessage('Asignación exitosa', MessageType.SUCCESS);
        }
      });
  }

  asignarSucursales(usuario:any){
    console.log('Asignando sucursales a usuario:', usuario);
    const modalAddSucurusal = this.dialog.open(ModalAsignarSucursalComponent, {
      width: '25%',
      disableClose: true
    });
    modalAddSucurusal.componentInstance.idUsuario = usuario.id;
    modalAddSucurusal.afterClosed()
      .subscribe((value)=>{
        if(value){
          this.getUsuarios();
          this.toast.showMessage('Asignación exitosa', MessageType.SUCCESS);
        }
      });
  
  }

  resetPassword(usuario: any) {
    console.log('Reseteando contraseña de usuario:', usuario);
    const modalWarning = this.dialog.open(ModalWarningComponent, {
      width: 'auto'
    });

    modalWarning.componentInstance.mensaje = '¿Está seguro de resetear la contraseña de este usuario?';

    modalWarning.componentInstance.labelButtonLeft = 'No';
    modalWarning.componentInstance.labelButtonRight = 'Si';

    modalWarning.componentInstance.respuesta.subscribe(
        (respuesta: boolean) => {
            if (respuesta){
              this.securityService.resetearContrasena(usuario.id).subscribe({
                next: res => {
                  console.log('Contraseña reseteada con éxito', res);
                  const data = res.data;
                  this.abrirModalInfo(data.password);
                  this.toast.showMessage('Contraseña reseteada con éxito', MessageType.SUCCESS);
                },
                error: error => {
                  console.error('Error:', error);
                  this.toast.showMessage('Error al resetear la contraseña', MessageType.ERROR);
                }
              });
            }
    });
  }

  abrirModalInfo(password: string): void {
    console.log('Abriendo modal de información');
    const modalInfo = this.dialog.open(ModalInfoComponent, {
      width: '40%'
    });
    modalInfo.componentInstance.titulo = 'Contraseña reestablecida';
    modalInfo.componentInstance.mensaje = 'La contraseña ha sido reestablecida con éxito';
    modalInfo.componentInstance.mensaje2 = `Contraseña: ${password}`;
    modalInfo.componentInstance.muestraBotonCancelar = false;
    modalInfo.componentInstance.labelButtonRight = 'Copiar';
    modalInfo.componentInstance.respuesta.subscribe((respuesta: boolean) => {
      console.log('Valor:', respuesta);
      if (respuesta) {
        this.copyToClipboard(password);
      }
    });

  }
  copyToClipboard( password: string) {
    const copied = this.clipboard.copy(password);
    if (copied) {
      this.toast.showMessage('Contraseña copiada al portapapeles', MessageType.SUCCESS);
      return true;
    } else {
      this.toast.showMessage('Error al copiar al portapapeles', MessageType.ERROR);
      return false;
    }
  }
}
