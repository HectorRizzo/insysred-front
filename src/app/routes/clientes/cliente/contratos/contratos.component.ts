import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { UserData } from '../cliente.component';

import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ClientsService, Contract } from 'app/services/clients.service';
import { ModalCrearContratoComponent } from '../modal-crear-contrato/modal-crear-contrato.component';
import { ModalEditarContratoComponent } from '../modal-editar-contrato/modal-editar-contrato.component';
import { ModalImprimirContratoComponent } from './modal-imprimir-contrato/modal-imprimir-contrato.component';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { ModalCambiarEstadoContratoComponent } from './modal-cambiar-estado-contrato/modal-cambiar-estado-contrato.component';
import { RubrosPorContratoComponent } from '../rubros-por-contrato/rubros-por-contrato.component';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.scss']
})
export class ContratosComponent {

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  @Input() cliente: UserData | any;

  displayedColumns: string[] = ['id', 'location', 'ip', 'mac', 'estado' , 'microtick', 'actions'];
  dataSource = new MatTableDataSource<Contract>([]);

  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent | undefined;

  visualizarActivos = true;
  visualizarInactivos = true;


  constructor(
    public dialog: MatDialog,
    private clientService: ClientsService,
    private toast: ToastService
  ){
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(){

    this.clientService.getContracts()
      .subscribe((contratos) => {
        const clientContracts = contratos.filter((contrato: any) => contrato.cliente.id === this.cliente.id);
        this.dataSource = new MatTableDataSource(clientContracts);
        this.length = clientContracts.length;
      });

  }

  openCreateContractModal(){
    const modalCreate = this.dialog.open(ModalCrearContratoComponent, {
      width: '75%',
      disableClose: true,
      maxHeight: '90vh',
    });

    modalCreate.componentInstance.cliente = this.cliente;

    modalCreate.afterClosed()
      .subscribe((res) => {
        if (res){
          this.getData();
          this.toast.showMessage('Contrato creado', MessageType.SUCCESS);
        }
      });
  }

  openSeeContractModal(contract: Contract){
    const modalSee = this.dialog.open(ModalEditarContratoComponent, {
      width: '75%',
      disableClose: true,
      maxHeight: '90vh',
    });
    modalSee.componentInstance.contract = contract;
    modalSee.componentInstance.cliente = this.cliente;
    modalSee.componentInstance.watchMode = true;
  }

  openUpdateStateContract(contract: Contract){
    const modalState = this.dialog.open(ModalCambiarEstadoContratoComponent, {
      width: '50%'
    });
    modalState.componentInstance.contract = contract;
    modalState.afterClosed()
    .subscribe((res) => {
      if (res){
        this.getData();
        this.toast.showMessage('Estado de contrato editado', MessageType.SUCCESS);
      }
    });
  }

  openEditContractModal(contract: Contract){
    const modalEdit = this.dialog.open(ModalEditarContratoComponent, {
      width: '75%',
      disableClose: true,
      maxHeight: '90vh',
    });
    modalEdit.componentInstance.contract = contract;
    modalEdit.componentInstance.cliente = this.cliente;
    modalEdit.afterClosed()
    .subscribe((res) => {
      if (res){
        this.getData();
        this.toast.showMessage('Contrato editado', MessageType.SUCCESS);
      }
    });
  }

  openPrintContractModal(contract: Contract){
    const modalPrint = this.dialog.open(ModalImprimirContratoComponent, {
      width: '75%',
      maxHeight: '90vh',
      disableClose: true
    });
    modalPrint.componentInstance.contrato = contract;
    modalPrint.componentInstance.cliente = this.cliente;

  }

  updateStatus(element: Contract, event: any){
    console.log('EVENTO: ', event);
    const { checked } = event;
    if (checked){
      element.status = 'ACTIVO';
    } else {
      element.status = 'INACTIVO';
    }
    this.clientService.updateClientContract(element)
      .subscribe(() => {
        console.log('Contrato actualizado');
      });
  }

  validateActiveData(event: any){
    const { checked } = event;
    this.visualizarActivos = Boolean(checked);
  }

  validateInactiveData(event: any){
    const { checked } = event;
    this.visualizarInactivos = Boolean(checked);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handlePageEvent(e: PageEvent){

    console.log('Event: ', e);

    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getData();
  }

  mostrarModalRubrosPorContrato(contract: any) {
    const modalContratos = this.dialog.open(RubrosPorContratoComponent, {
      width: '80%'
    });
    modalContratos.componentInstance.idContrato = contract.numContrato;
  }

}
