import {Component, Input, OnInit} from '@angular/core';
import {SucursalDto} from '../../../../dto/SucursalDto';
import {MatDialogRef} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-empresa-sucursal-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class EmpresaSucursalVerComponent implements OnInit {

  @Input() sucursal: any;
  @Input() watchMode: boolean = false;

  constructor(private viewDialog: MatDialogRef<EmpresaSucursalVerComponent>,
              private translate: TranslateService
  ) { }
  translateSubscription!: Subscription;

  ngOnInit() {

  }
  closeDialog(): void {
    this.viewDialog.close();
  }
}
