import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { RouterDto } from '../../../../../dto/RouterDto';
import { MatTableDataSource } from '@angular/material/table';
import { InterfacesDto } from '../../../../../dto/microtik/InterfacesDto';
import { MatDialog } from '@angular/material/dialog';
import { MicrotikService } from '../../../../../services/microtik.service';
import { IdParamDto } from '../../../../../dto/microtik/IdParamDto';
import { FormBuilder, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { SucursalDto } from '../../../../../dto/SucursalDto';
import { VlanDto } from '../../../../../dto/microtik/VlanDto';
import { createMask } from '@ngneat/input-mask';

@Component({
  selector: 'app-empresa-servidores-configurar-interfaz',
  templateUrl: './interfaz.component.html',
  styleUrls: ['./interfaz.component.css']
})
export class EmpresaServidoresConfigurarInterfazComponent implements OnInit {
  @Input() routerView!: RouterDto | undefined;

  displayedColumns: string[] = ['.id','name', 'type', 'mac-address', 'disabled'];
  dataSource: InterfacesDto[] = [];
  ipAddressMask = createMask({ alias: 'ip' });
  macAddressMask = createMask({ alias: 'mac' });
  dataSourceLocal = new MatTableDataSource<InterfacesDto>([]);
  length = 0;
  pageSize = 5;
  pageIndex = 0;

  constructor(
    private dialog: MatDialog,
    private servicio: MicrotikService,
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<any>,
  ) { }

  newInterfaz = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    comentario: ['', [Validators.required]],
    interface: ['', [Validators.required]],
    ip: ['', [Validators.required]],
    mascara: ['', [Validators.required]],
    redPadre: ['', [Validators.required]],
  });

  ngOnInit() {
    this.cargarInterfaces();
  }

  cargarInterfaces() {
   // alert(this.routerView?.id);
    this.servicio.obtenerInterfaces(this.routerView?.id)
      .subscribe((data: InterfacesDto[]) => {
          //console.log(data);
          this.dataSource = data;
          this.length = this.dataSource.length;
          this.dataSourceLocal = new MatTableDataSource(this.getDataToDisplay());
        },
        (error) => {
          console.error('Error al cargar datos:', error);
        }
      );
  }

  openFormModal(){
    alert('test');
  }

  guardar(){
    const newVlan: VlanDto = {
      nombre: this.newInterfaz.get('nombre')?.value || '',
      comentario: this.newInterfaz.get('interface')?.value || '',
      interfaz: this.newInterfaz.get('interface')?.value || '',
    };
    this.servicio.addInterface(newVlan).subscribe(
      (datos: any) => {
        console.log('guardado');
      },
      (error) => {
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
  verIpVlan(vlan: VlanDto) {
  }

}
