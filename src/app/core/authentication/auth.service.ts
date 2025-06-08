import { Injectable } from '@angular/core';
import { BehaviorSubject, iif, merge, of } from 'rxjs';
import { catchError, map, share, switchMap, tap } from 'rxjs/operators';
import { filterObject, isEmptyObject } from './helpers';
import { User } from './interface';
import { LoginService } from './login.service';
import { TokenService } from './token.service';
import { SeguridadService } from 'app/services/seguridad.service';
import { MenuService } from '@core/bootstrap/menu.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private permissionsTree: any[] = [];
  private user$ = new BehaviorSubject<User>({});
  private change$ = merge(
    this.tokenService.change(),
    // this.tokenService.refresh().pipe(switchMap(() => this.refresh())),
  ).pipe(
    switchMap(() => this.assignUser()),
    share(),
  );

  constructor(
    private loginService: LoginService,
    private tokenService: TokenService,
    private securityService: SeguridadService,
    private menuService: MenuService,
  ) {
  }

  init() {
    return new Promise<void>(resolve => this.change$.subscribe(() => resolve()));
  }

  change() {
    return this.change$;
  }

  check() {
    return this.tokenService.valid();
  }

  checkSucursal() {
    const codSucursalEscogida = localStorage.getItem('cod_suc');
    return !!codSucursalEscogida;
  }

  login(username: string, password: string) {
    return this.loginService.login(username, password).pipe(
      tap(token => this.tokenService.set(token)),
      map(() => this.check()),
    );
  }

  /*login_old(username: string, password: string, rememberMe = false) {
    return this.loginService.login(username, password, rememberMe).pipe(
      tap(token => this.tokenService.set(token)),
      map(() => this.check())
    );
  }*/
  // refresh() {
  //   return this.loginService
  //     .refresh(filterObject({ refresh_token: this.tokenService.getRefreshToken() }))
  //     .pipe(
  //       catchError(() => of(undefined)),
  //       tap(token => this.tokenService.set(token)),
  //       map(() => this.check()),
  //     );
  // }

  // getPermissionsTree() {
  //   console.log('getPermissionsTree', this.permissionsTree);
  //   if (!this.permissionsTree || this.permissionsTree.length === 0) {
  //     // obtén el árbol de permisos del API solo si no se ha obtenido antes
  //     this.menuXUsuario().subscribe(
  //       (menu) => {
  //         this.permissionsTree = menu.data;
  //         return this.permissionsTree;
  //       },
  //       (error) => {
  //         console.error('Error al cargar datos:', error);
  //       }
  //     );
  //   }
  //   return this.permissionsTree;
  // }

  async getPermissionsTree() {
    console.log('getPermissionsTree', this.permissionsTree);
    if (!this.permissionsTree || this.permissionsTree.length === 0) {
      try {
        const menu = await this.menuXUsuario().toPromise();
        this.permissionsTree = menu.data;
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    }
    return this.permissionsTree;
  }
  logout() {
    this.tokenService.clear();
  return of(!this.check());
  }

  user() {
    return this.user$.pipe(share());
  }

  menu() {
    return iif(() => this.check(), this.menuXUsuario(), of([]));
  }

  menuXUsuario() {
    const idUsuario = localStorage.getItem('id_usuario_insysred');
    const idSucursal = localStorage.getItem('cod_suc');
    return this.securityService.obtenerPermisosXUsuario(idUsuario,idSucursal).pipe(
      tap(menu => {
        this.menuService.addNamespace(menu.data, 'menu');
        this.menuService.set(menu.data);
        this.permissionsTree = menu.data;
      }),
    );
  }

  private assignUser() {
    console.log('assignUser');
    if (!this.check()) {
      return of({}).pipe(tap(user => this.user$.next(user)));
    }

    if (!isEmptyObject(this.user$.getValue())) {
      return of(this.user$.getValue());
    }

    return this.loginService.me().pipe(tap(user => this.user$.next(user)));
  }
}
