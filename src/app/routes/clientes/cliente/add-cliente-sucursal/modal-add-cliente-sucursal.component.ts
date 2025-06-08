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
import { Clipboard } from '@angular/cdk/clipboard';
import { ClienteDto } from 'app/dto/ClienteDto';
import { ClientesClienteAddOrdTrabajoComponent } from 'app/routes/clientes/cliente/add-ord-trabajo/add-ord-trabajo.component';
import { AsignarSucursalClienteDto } from 'app/dto/AsignarSucursalClienteDto';
import { SucursalService } from 'app/services/sucursal.service';

export interface UserData {
  id: number;
  identificacion: string;
  nombres: string;
  email: string;
  estado: boolean;
}

@Component({
  selector: 'app-modal-add-cliente-sucursal',
  templateUrl: './modal-add-cliente-sucursal.component.html',
  styleUrls: ['./modal-add-cliente-sucursal.component.css']
})
export class ModalAddClienteSucursalComponent implements OnInit {

  displayedColumns: string[] = ['seleccionar','identificacion', 'nombres', 'email','celular', 'ip', 'plan', 'estado'];
  dataSource = new MatTableDataSource<EmpleadosDTO>();
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
  selected = '';
  selectedCliente:any = null;
  selectedContrato:any = null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | undefined;
  @ViewChild(MatSort, { static: true }) sort: MatSort | undefined;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private clientService: ClientsService,
    private toast: ToastService,
    private sucursalService: SucursalService

  ) {

  }

  ngOnInit(): void {
    this.obtenerClientes();
  }

  aplicarFiltro(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.filter = filtro;
    this.obtenerClientes();
  }



  closeDialog() {
    this.dialog.closeAll();
  }


  seleccionarElemento(cliente: any) {
    console.log('Seleccionando jefe:', cliente);
    this.selected = cliente.cliente.id + ' ' + cliente.cliente.nombres;
    this.selectedCliente = cliente.cliente.id;
    this.selectedContrato = cliente.contrato;
  }

  obtenerClientes(){

    this.clientService.getClients(this.pageIndex, this.pageSize, this.filter)
      .subscribe((res: any) => {
        const content = res.content || res;
        this.dataSource = new MatTableDataSource(content);
        this.length = res.totalElements;
        console.log('this.selectedCliente', this.selectedCliente);
      });
  }

  continuar() {
    console.log('continuar');
    console.log('this.selectedCliente', this.selectedCliente);
    if (this.selectedCliente) {
      const dialog = this.dialog.open(ModalInfoComponent, {
        width: '40%',
        disableClose: true
      });
      dialog.componentInstance.titulo = 'Asignar Cliente a Sucursal';
      dialog.componentInstance.mensaje = '¿Está seguro de asignar el cliente a la sucursal?';
      dialog.componentInstance.labelButtonRight = 'Asignar';
      dialog.componentInstance.labelButtonLeft = 'Cancelar';
      dialog.componentInstance.respuesta.subscribe((respuesta: boolean) => {
        if (respuesta) {
          this.asignarClienteSucursal();
        }
      });
      
    } else {
      this.toast.showMessage('Debe seleccionar un cliente', MessageType.WARNING);
    }
  }

  asignarClienteSucursal(){
    const idSucursal = localStorage.getItem('cod_suc');
    const sucursales = [Number(idSucursal)];
    const asignaSucursalCliente: AsignarSucursalClienteDto = {
      idCliente: this.selectedCliente,
      idSucursal: sucursales
    };
    this.sucursalService.asignarSucursalCliente(asignaSucursalCliente).subscribe(
      (datos) => {
        this.toast.showMessage('Asignación de sucursal exitosa', MessageType.SUCCESS);
        this.dialog.closeAll();
      },
      (error) => {
        console.error('Error al guardar datos:', error);
      },
    );
  }


  handlePageEvent(e: PageEvent){

    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.obtenerClientes();
  }



}
