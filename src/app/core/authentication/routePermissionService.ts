import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoutePermissionService {
  private allowedRoutes: string[] = [];

  setAllowedRoutes(routes: string[]) {
    this.allowedRoutes = routes;
  }

  isRouteAllowed(route: string): boolean {
    return this.allowedRoutes.includes(route);
  }
}