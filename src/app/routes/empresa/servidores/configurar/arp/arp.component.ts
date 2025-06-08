import { Component, Input, OnInit } from '@angular/core';
import { RouterDto } from '../../../../../dto/RouterDto';
import { ArpDto } from '../../../../../dto/microtik/ArpDto';
import { MicrotikService } from '../../../../../services/microtik.service';
import { MangleDto } from '../../../../../dto/microtik/MangleDto';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-empresa-servidores-configurar-arp',
  templateUrl: './arp.component.html',
  styleUrls: ['./arp.component.css'],
})
export class EmpresaServidoresConfigurarArpComponent implements OnInit {
  @Input() routerView!: RouterDto | undefined;

  displayedColumns: string[] = ['.id', 'address', 'interface'];
  dataSource: ArpDto[] = [];

  dataSourceLocal = new MatTableDataSource<ArpDto>([]);
  length = 0;
  pageSize = 5;
  pageIndex = 0;

  constructor(
    private servicio: MicrotikService,
  ) {
  }

  ngOnInit() {
    this.cargarArp();
  }

  cargarArp() {
    this.servicio.getArp(this.routerView?.id)
      .subscribe((data: ArpDto[]) => {
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
