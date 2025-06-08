import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'facturationPeriod'
})
export class FacturationPeriodPipe implements PipeTransform {

  transform(fechaEmision: string, ...args: unknown[]): unknown {
    const [, mes, añoFacturacion ] = fechaEmision.split('/');

    let mesFacturacion = '';

    switch (Number(mes)) {
      case 1:
        mesFacturacion = 'Enero';
        break;
      case 2:
        mesFacturacion = 'Febrero';
        break;
      case 3:
        mesFacturacion = 'Marzo';
        break;
      case 4:
        mesFacturacion = 'Abril';
        break;
      case 5:
        mesFacturacion = 'Mayo';
        break;
      case 6:
        mesFacturacion = 'Junio';
        break;
      case 7:
        mesFacturacion = 'Julio';
        break;
      case 8:
        mesFacturacion = 'Agosto';
        break;
      case 9:
        mesFacturacion = 'Septiembre';
        break;
      case 10:
        mesFacturacion = 'Octubre';
        break;
      case 11:
        mesFacturacion = 'Noviembre';
        break;
      case 12:
        mesFacturacion = 'Diciembre';
        break;
    
      default:
        break;
    }

    return `${mesFacturacion} - ${añoFacturacion}`;
  }

}
