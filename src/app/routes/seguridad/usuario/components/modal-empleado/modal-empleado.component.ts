import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { ClientsService } from 'app/services/clients.service';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { EmpleadosService } from 'app/services/empleados.service';
import { EmpleadosDTO } from 'app/dto/EmpleadosDTO';
import { ModalInfoComponent } from '@shared/components/modal-info/modal-info.component';
import { UsuarioService } from 'app/services/usuario.service';
import { VerDatosComponent } from '../ver-datos/ver-datos.component';
import { Clipboard } from '@angular/cdk/clipboard';

export interface UserData {
  id: number;
  identificacion: string;
  nombres: string;
  email: string;
  estado: boolean;
}

@Component({
  selector: 'app-modal-empleado',
  templateUrl: './modal-empleado.component.html',
  styleUrls: ['./modal-empleado.component.css']
})
export class ModalEmpleadoComponent implements OnInit {

  empleadosColumns: string[] = ['seleccionar','identificacion', 'nombreCompleto','telefonoMovil','telefonoFijo', 'correo'];
  dataEmpleados = new MatTableDataSource<EmpleadosDTO>();
  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent | undefined;

  filter = '';
  selectedJefe: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | undefined;
  @ViewChild(MatSort, { static: true }) sort: MatSort | undefined;

  @Input() empleadoId: any;
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private clientService: ClientsService,
    private toast: ToastService,
    private empleadoService: EmpleadosService,
    private usuarioService: UsuarioService,
    private clipboard: Clipboard

  ) {

  }

  ngOnInit(): void {
    this.obtenerEmpleados();
  }

  aplicarFiltro(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.filter = filtro;
    this.obtenerEmpleados();
  }



  closeDialog() {
    this.dialog.closeAll();
  }


  seleccionarElemento(jefe: EmpleadosDTO) {
    this.empleadoId = jefe.id;
  }

  obtenerEmpleados(){
    this.empleadoService.obtenerEmpleados( this.pageIndex, this.pageSize, this.filter).subscribe({
      next: (res) => {
        const data = res.data;
        const empleados = data.content.filter(
          (empleado: EmpleadosDTO) => empleado.id !== this.empleadoId);
        this.dataEmpleados = new MatTableDataSource(empleados);
        this.length = data.totalElements;
        this.selectedJefe = this.dataEmpleados.data.find((empleado: EmpleadosDTO) => empleado.id === this.empleadoId)?.id;
        console.log('this.selectedJefe', this.selectedJefe);
      },
      error: (error) => {
        this.toast.showMessage('Error al obtener los empleados ' + error, MessageType.ERROR);
      }
    });
  }

  saveClient(): void {
    if(this.empleadoId){
    const body ={
      idEmpleado: this.empleadoId,
    };
    const dialogRef = this.dialog.open(VerDatosComponent, {
      width: '40%'
    });
    dialogRef.componentInstance.empleado = this.dataEmpleados.data.find(
      (empleado: EmpleadosDTO) => empleado.id === this.empleadoId);
    dialogRef.componentInstance.empleadoGuardado.subscribe((empleado: EmpleadosDTO) => {
        this.usuarioService.guardarUsuario(body).subscribe({
          next: res => {
            console.log('Usuario guardado con éxito', res);
            const data = res.data;
            this.abrirModalInfo(data.username, data.password);
          },
          error: error => {
            console.error('Error:', error);
            this.toast.showMessage('Error al guardar el usuario ' + error.error.message
            , MessageType.ERROR);
          }
        });
      });
    }else{
      this.toast.showMessage('Debe seleccionar un empleado', MessageType.ERROR);
    }


  }

  abrirModalInfo(usuario: any, password: string): void {
    console.log('Abriendo modal de información');
    const modalInfo = this.dialog.open(ModalInfoComponent, {
      width: '40%'
    });
    modalInfo.componentInstance.titulo = 'Usuario creado';
    modalInfo.componentInstance.mensaje = 'El usuario ha sido creado con éxito';
    modalInfo.componentInstance.mensaje2 = `Usuario: ${usuario} - Contraseña: ${password}`;
    modalInfo.componentInstance.muestraBotonCancelar = false;
    modalInfo.componentInstance.labelButtonRight = 'Copiar';
    modalInfo.componentInstance.respuesta.subscribe((respuesta: boolean) => {
      console.log('Valor:', respuesta);
      if (respuesta) {
        this.copyToClipboard(usuario, password);
        this.closeDialog();
      }
    });

  }
  copyToClipboard(usuario: any, password: string) {
    const copied = `Usuario: ${usuario} - Contraseña: ${password}`;
    this.clipboard.copy(copied);
    if (copied) {
      this.toast.showMessage('Contraseña copiada al portapapeles', MessageType.SUCCESS);
      return true;
    } else {
      this.toast.showMessage('Error al copiar al portapapeles', MessageType.ERROR);
      return false;
    }
  }


  handlePageEvent(e: PageEvent){

    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.obtenerEmpleados();
  }



}
