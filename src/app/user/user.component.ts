import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  imports: [NgIf, RouterLink],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  authenticated: boolean = false;
  private authSubscription: Subscription = new Subscription();

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    // Suscribirse a los cambios de autenticación
    this.authSubscription = this.auth.authenticated$.subscribe(
      (isAuthenticated) => {
        this.authenticated = isAuthenticated;
      }
    );
  }

  ngOnDestroy(): void {
    // Cancelar la suscripción para evitar pérdidas de memoria
    this.authSubscription.unsubscribe();
  }

  logout(){
    this.auth.logout();
  }
}
