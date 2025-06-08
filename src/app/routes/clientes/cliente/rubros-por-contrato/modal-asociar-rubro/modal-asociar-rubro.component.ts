import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { RubroDto } from 'app/dto/RubroDto';
import { RubroService } from 'app/services/rubro.service';

@Component({
  selector: 'app-modal-asociar-rubro',
  templateUrl: './modal-asociar-rubro.component.html',
  styleUrls: ['./modal-asociar-rubro.component.scss'],
})
export class ModalAsociarRubroComponent implements OnInit {
  @Input() idContrato: number;

  rubros: RubroDto[] = [];

  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalAsociarRubroComponent>,
    private toast: ToastService,
    private fb: FormBuilder,
    private rubroService: RubroService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      rubro: [null, [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(0)]],
    });
    this.getData();
  }

  getData() {
    this.rubroService.getAllRubros(0, 50, '', '').subscribe((res: any) => {
      this.rubros = res.content;
    });
  }

  cancelar() {
    this.dialogRef.close();
  }

  guardar() {
    const { rubro, cantidad } = this.form.value;
    this.rubroService.postRubroXContrato(this.idContrato, rubro.id, cantidad).subscribe({
      next: res => {
        this.toast.showMessage('Rubro asociado con éxito', MessageType.SUCCESS);
        this.cancelar();
      },
      error: error => {
        console.log('Error:', error);
      },
    });
  }
}
