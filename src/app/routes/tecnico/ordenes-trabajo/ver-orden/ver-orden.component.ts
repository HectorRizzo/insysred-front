import { Component, Input, OnInit } from '@angular/core';
import { OrdenTrabajoDto } from '../../../../dto/OrdenTrabajoDto';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tecnico-ord-trabajo-verOrden',
  templateUrl: './ver-orden.component.html',
  styleUrls: ['./ver-orden.component.css']
})
export class TecnicoOrdTrabajoVerOrdenComponent implements OnInit {
  @Input() ordenTrab: any;
  @Input() watchMode: boolean = false;

  ordTrab_view: OrdenTrabajoDto | undefined;
  constructor(private editDialog: MatDialogRef<TecnicoOrdTrabajoVerOrdenComponent>) { }

  ngOnInit() {
    //alert(localStorage.getItem('cod_suc'))
    this.ordTrab_view = this.ordenTrab;
  }
  closeDialog(): void {
    this.editDialog.close();
  }

}
