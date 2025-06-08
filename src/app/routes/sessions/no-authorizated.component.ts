import { Component } from '@angular/core';

@Component({
    selector: 'app-no-authorizated',
    template: `
        <error-code
        code="401"
        title="No Autorizado!"
        message="No tienes permisos para acceder a esta página."
        ></error-code>
    `,
    })
export class NoAuthorizatedComponent {}