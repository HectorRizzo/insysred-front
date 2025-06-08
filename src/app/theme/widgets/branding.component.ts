import { Component } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <a class="d-inline-block text-nowrap r-full text-reset" href="/">
      <img src="./assets/images/insysred-logo.png" style="height: 50px;" class="align-middle m-2 r-full" alt="logo" />
    </a>
  `,
  styles: [
    `
      .brand-logo {
        width: 30px;
        height: 30px;
      }
    `,
  ],
})
export class BrandingComponent {}
