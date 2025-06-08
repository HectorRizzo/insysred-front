import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PeriodoDto } from 'app/dto/PeriodoDto';
import { PeriodoService } from 'app/services/periodo.service';

@Component({
  selector: 'app-proceso-factura',
  templateUrl: './proceso-factura.component.html',
  styleUrls: ['./proceso-factura.component.scss'],
})
export class ProcesoFacturaComponent implements OnInit {
  periodosMasivos: PeriodoDto[];
  periodosIndividual: PeriodoDto[];

  constructor(private periodoService: PeriodoService) {}

  ngOnInit(): void {
    this.getPeriodosMasivos();
    this.getPeriodosIndividual();
  }

  getPeriodosMasivos() {
    this.periodoService.getPeriodosMasivos().subscribe((res: PeriodoDto[]) => {
      this.periodosMasivos = res;
    });
  }

  getPeriodosIndividual() {
    this.periodoService.getPeriodosIndividual().subscribe((res: PeriodoDto[]) => {
      this.periodosIndividual = res;
    });
  }

  actualizarPeriodosMasivos(event: boolean) {
    if (event) {
      this.getPeriodosMasivos();
    }
  }
}
