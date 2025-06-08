import { Component, Input, OnInit } from '@angular/core';
import { RouterDto } from '../../../../../dto/RouterDto';
import { QueueDto } from '../../../../../dto/microtik/QueueDto';
import { MangleDto } from '../../../../../dto/microtik/MangleDto';
import { MicrotikService } from '../../../../../services/microtik.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-empresa-servidores-configurar-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css'],
})
export class EmpresaServidoresConfigurarQueueComponent implements OnInit {
  @Input() routerView!: RouterDto | undefined;

  displayedColumns: string[] = ['.id', 'parent', 'name', 'queue', 'max-limit'];
  dataSource: QueueDto[] = [];

  dataSourceLocal = new MatTableDataSource<QueueDto>([]);
  length = 0;
  pageSize = 5;
  pageIndex = 0;

  constructor(
    private servicio: MicrotikService,
  ) {
  }

  ngOnInit() {
    this.cargarQueue();
  }

  cargarQueue() {
    this.servicio.getQueue(this.routerView?.id)
      .subscribe((data: QueueDto[]) => {
         // console.log(data);
          this.dataSource = data;
          this.length = this.dataSource.length;
          this.dataSourceLocal = new MatTableDataSource(this.getDataToDisplay());
        }, (error) => {
          console.error('Error al cargar datos:', error);
        },
      );
  }

  getDataToDisplay() {
    return this.dataSource.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }

  onPaginateChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.dataSourceLocal = new MatTableDataSource(this.getDataToDisplay());
  }
}
