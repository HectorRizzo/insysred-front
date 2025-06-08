import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ModalCrearPlanComponent } from './components/modal-crear-plan/modal-crear-plan.component';
import { ModalEditarPlanComponent } from './components/modal-editar-plan/modal-editar-plan.component';
import { PlanService, Plan } from 'app/services/plans.service';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';

import { ModalWarningComponent } from '@shared/components/modal-warning/modal-warning.component';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.scss']
})
export class PlanesComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'description', 'price', 'megabytes', 'microtick', 'actions'];
  dataSource = new MatTableDataSource<Plan>([]);
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;
  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent | undefined;


  idSucursal = Number(localStorage.getItem('cod_suc'));

  filterValue = '';
  estado: string = 't';

  constructor(
    public dialog: MatDialog,
    private planService: PlanService,
    private toast: ToastService
  ){}

  ngOnInit(): void {
    this.estado = 't';
    this.getData();
  }

  getData(){
    this.planService.getPlans(
      this.pageIndex,
      this.pageSize,
      this.idSucursal,
      this.filterValue,
      this.estado
    )
      .subscribe((res: any) => {
        const content = res.content;
        this.dataSource = new MatTableDataSource(content);
        this.length = res.totalElements;
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = filterValue.trim().toLowerCase();
    this.getData();
  }

  openSeePlanModal(plan: Plan){
    const modal = this.dialog.open(ModalEditarPlanComponent, {
      width: '50%',
    });
    modal.componentInstance.plan = plan;
    modal.componentInstance.watchMode = true;
  }

  openCreatePlanModal(){
    const modalCreate = this.dialog.open(ModalCrearPlanComponent, {
      width: '80%',
      disableClose: true
    });


    modalCreate.afterClosed()
    .subscribe((res) => {
        if (res){
          this.getData();
          this.toast.showMessage('Plan creado', MessageType.SUCCESS);
        }
      });
  }

  openEditPlanModal(plan: Plan){
    const modalEdit = this.dialog.open(ModalEditarPlanComponent, {
      width: '80%',
      disableClose: true
    });
    modalEdit.componentInstance.plan = plan;
    modalEdit.afterClosed()
    .subscribe((res) => {
      if (res){
        this.getData();
        this.toast.showMessage('Plan editado', MessageType.SUCCESS);
      }
    });
  }

  updateStatus(event: any, element: Plan){

    const modalWarning = this.dialog.open(ModalWarningComponent, {
      width: 'auto'
    });

    const snap = event.source.checked;

    modalWarning.componentInstance.mensaje = '¿Está seguro de cambiar el estado de este plan?';

    modalWarning.componentInstance.labelButtonLeft = 'No';
    modalWarning.componentInstance.labelButtonRight = 'Si';

    modalWarning.componentInstance.respuesta.subscribe(
        (respuesta: boolean) => {
            if (respuesta){
              element.status = snap;
              this.planService.updatePlanStatus(element.id, element.status)
                .subscribe(() => {
                  this.toast.showMessage('Plan actualizado', MessageType.SUCCESS);
                  this.getData();
                });

            } else {
                element.status = !snap;
            }
    });
  }

  handlePageEvent(e: PageEvent){
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getData();
  }

  mostrarAlerta(event: any): void {
   this.estado = event.value;
   this.getData();
  }
}
