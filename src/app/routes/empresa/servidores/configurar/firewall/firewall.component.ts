import { Component, Input, OnInit } from '@angular/core';
import { RouterDto } from '../../../../../dto/RouterDto';
import { MicrotikService } from '../../../../../services/microtik.service';
import { FirewallDto } from '../../../../../dto/microtik/FirewallDto';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-empresa-servidores-configurar-firewall',
  templateUrl: './firewall.component.html',
  styleUrls: ['./firewall.component.css']
})
export class EmpresaServidoresConfigurarFirewallComponent implements OnInit {
  @Input() routerView!: RouterDto | undefined;

  displayedColumns: string[] = ['.id', 'list', 'address', 'disabled'];
  dataSource: FirewallDto[] = [];

  dataSourceLocal = new MatTableDataSource<FirewallDto>([]);
  length = 0;
  pageSize = 5;
  pageIndex = 0;

  constructor(
    private servicio: MicrotikService
  ) { }

  ngOnInit() {
    this.cargarFirewall();
  }
  cargarFirewall() {
    this.servicio.getFirewall(this.routerView?.id)
      .subscribe((data: FirewallDto[]) => {
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
