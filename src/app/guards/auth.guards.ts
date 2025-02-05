import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Verifica si el token existe
    if (this.authService.isAuthenticated()) {
      return true; // El usuario está autenticado, puede acceder a la ruta
    } else {
      // Si no hay token, redirige al login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
