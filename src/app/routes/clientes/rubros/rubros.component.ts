/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RubroService } from 'app/services/rubro.service';
import { RubroDto } from 'app/dto/RubroDto';
import { ModalWarningComponent } from '@shared/components/modal-warning/modal-warning.component';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { ModalCrearRubroComponent } from './modal-crear-rubro/modal-crear-rubro.component';

@Component({
  selector: 'app-rubros',
  templateUrl: './rubros.component.html',
  styleUrls: ['./rubros.component.scss'],
})
export class RubrosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'valor', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<RubroDto>([]);

  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent | undefined;

  filtroCliente = new FormControl<string>('');

  clear() {
    this.pageSize = 5;
    this.pageIndex = 0;
    this.filtroCliente.setValue('');
    this.getData();
  }

  constructor(
    public dialog: MatDialog,
    private toast: ToastService,
    private rubroService: RubroService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.rubroService
      .getAllRubros(this.pageIndex, this.pageSize, this.filtroCliente?.value || '', '')
      .subscribe((res: any) => {
        this.dataSource = new MatTableDataSource(res.content);
        this.length = res.totalElements;
      });
  }

  applySearchFilters() {
    this.pageIndex = 0;
    this.rubroService
      .getAllRubros(this.pageIndex, this.pageSize, this.filtroCliente?.value || '', '')
      .subscribe((res: any) => {
        this.dataSource = new MatTableDataSource(res.content);
        this.length = res.totalElements;
      });
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openEditModal(rubro: RubroDto) {
    const modalEdit = this.dialog.open(ModalCrearRubroComponent, {
      width: '60%',
      height: '90%',
      disableClose: true,
    });
    modalEdit.componentInstance.rubro = rubro;
    modalEdit.afterClosed().subscribe(() => {
      this.getData();
    });
  }

  openDeleteModal(factura: any) {
    // const modalEdit = this.dialog.open(ModalEditarCobroComponent, {
    //   width: '60%',
    //   height: '90%',
    // });
    // modalEdit.componentInstance.factura = factura;
    // modalEdit.componentInstance.watchMode = true;
  }

  openNewForm() {
    const ref = this.dialog.open(ModalCrearRubroComponent, {
      width: 'auto',
    });
    ref.afterClosed().subscribe(() => {
      this.getData();
    });
  }

  updateStatus(event: any, element: RubroDto) {
    const modalWarning = this.dialog.open(ModalWarningComponent, {
      width: 'auto',
    });
    const checked = event.source.checked;
    modalWarning.componentInstance.mensaje = '¿Está seguro de cambiar el estado de este rubro?';
    modalWarning.componentInstance.labelButtonLeft = 'No';
    modalWarning.componentInstance.labelButtonRight = 'Si';
    modalWarning.componentInstance.respuesta.subscribe((respuesta: boolean) => {
      if (respuesta) {
        this.rubroService.updateRubro(element.id, checked).subscribe(() => {
          this.toast.showMessage('Rubro actualizado con éxito', MessageType.SUCCESS);
          element.isActive = checked;
        });
      } else {
        event.source.checked = !checked;
      }
    });
  }
}
