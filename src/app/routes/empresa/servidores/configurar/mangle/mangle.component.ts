import { Component, Input, OnInit } from '@angular/core';
import { RouterDto } from '../../../../../dto/RouterDto';
import { MangleDto } from '../../../../../dto/microtik/MangleDto';
import { MicrotikService } from '../../../../../services/microtik.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-empresa-servidores-configurar-mangle',
  templateUrl: './mangle.component.html',
  styleUrls: ['./mangle.component.css'],
})
export class EmpresaServidoresConfigurarMangleComponent implements OnInit {
  @Input() routerView!: RouterDto | undefined;

  displayedColumns: string[] = ['.id', 'chain', 'action', 'src-address'];
  dataSource: MangleDto[] = [];

  dataSourceLocal = new MatTableDataSource<MangleDto>([]);
  length = 0;
  pageSize = 5;
  pageIndex = 0;

  constructor(
    private servicio: MicrotikService
  ) {
  }

  ngOnInit() {
    this.cargarMangle();
  }

  cargarMangle() {
    this.servicio.getMangles(this.routerView?.id)
      .subscribe((data: MangleDto[]) => {
          //console.log(data);
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
