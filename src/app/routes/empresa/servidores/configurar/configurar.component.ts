import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RouterDto } from '../../../../dto/RouterDto';

@Component({
  selector: 'app-empresa-servidores-configurar',
  templateUrl: './configurar.component.html',
  styleUrls: ['./configurar.component.css'],

})
export class EmpresaServidoresConfigurarComponent implements OnInit {
  @Input() servidor: RouterDto;
  routerView:RouterDto| undefined;

  constructor(
    private dialogRef: MatDialogRef<EmpresaServidoresConfigurarComponent>

  ) {
  }

  ngOnInit() {
    this.routerView = this.servidor;
  }

}
