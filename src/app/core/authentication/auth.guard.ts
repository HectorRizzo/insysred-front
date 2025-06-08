import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard = async (route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastrService);
  const targetUrl: string = state?.url ?? '';
  return auth.check() ? 
            auth.checkSucursal() ?
              checkUrlInPermissionsTree(targetUrl, await auth.getPermissionsTree(), '') ? 
                true 
                : unauthorized(router, toast)
            : router.parseUrl('/auth/escoger_sucursales') 
         : router.parseUrl('/auth/login');
};

function unauthorized(router: Router, toast: ToastrService) {
  toast.error('No tienes permisos para acceder a esta ruta');
  router.navigateByUrl('/inicio');
}

function checkUrlInPermissionsTree(url: string, tree: any[], parentRoute: string): boolean {
  for (const node of tree) {
    let fullRoute = parentRoute + node.route;
    console.log('fullRoute', fullRoute);
    console.log('url', url);
    // si la ruta termina con '/*', elimina el '/*' y verifica si la url comienza con la ruta
    if (fullRoute.endsWith('/*')) {
      fullRoute = fullRoute.slice(0, -2);
      if (url.startsWith(fullRoute)) {
        return true;
      }
    }
    if (fullRoute === url) {
      return true;
    }

    if (node.children) {
      const isUrlInChildren = checkUrlInPermissionsTree(url, node.children, fullRoute);
      if (isUrlInChildren) {
        return true;
      }
    }
  }

  return false;
}
