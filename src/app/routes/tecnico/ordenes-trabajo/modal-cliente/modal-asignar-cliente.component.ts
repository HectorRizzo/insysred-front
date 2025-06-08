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

export interface UserData {
  id: number;
  identificacion: string;
  nombres: string;
  email: string;
  estado: boolean;
}

@Component({
  selector: 'app-modal-asignar-cliente',
  templateUrl: './modal-asignar-cliente.component.html',
  styleUrls: ['./modal-asignar-cliente.component.css']
})
export class ModalAsignarClienteComponent implements OnInit {

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

  @Input() cliente: any;
  @Input() contrato: any;
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


  seleccionarElemento(cliente: any) {
    console.log('Seleccionando jefe:', cliente);
    this.selected = cliente.cliente.id + ' ' + cliente.cliente.nombres;
    this.selectedCliente = cliente.cliente.id;
    this.selectedContrato = cliente.contrato;
  }

  obtenerEmpleados(){

    this.clientService.getClients(this.pageIndex, this.pageSize, this.filter)
      .subscribe((res: any) => {
        const content = res.content || res;
        this.dataSource = new MatTableDataSource(content);
        this.length = res.totalElements;
        if(this.contrato){
          this.selectedCliente = this.dataSource.data.find((element:any) => element.contrato === this.contrato);
        }
        console.log('this.selectedCliente', this.selectedCliente);
      });
  }

  continuar() {
    console.log('continuar');
    console.log('this.selectedCliente', this.selectedCliente);
    if (this.selectedCliente) {
      const dialog = this.dialog.open(ClientesClienteAddOrdTrabajoComponent, {
        width: '40%',
        disableClose: true
      });
      console.log('this.dataSource.data', this.dataSource.data);
      console.log('this.selectedCliente', this.selectedCliente);
      console.log('this.selectedContrato', this.selectedContrato);
      dialog.componentInstance.cliente = this.dataSource.data.find((element:any) => element.cliente.id === this.selectedCliente && element.contrato === this.selectedContrato);
    } else {
      this.toast.showMessage('Debe seleccionar un cliente', MessageType.WARNING);
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
