import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { FacturationPeriodPipe } from './pipes/facturation-period.pipe';

@NgModule({
  declarations: [
    FacturationPeriodPipe
  ],
  imports: [CommonModule],
  exports: [FacturationPeriodPipe]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
