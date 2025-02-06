import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';  // 👈 Importar Router
import { AuthService } from '../services/auth.service'; // 👈 Importar el servicio de autenticación
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = "";
  user: string = "adminPP@technova.com";
  password: string = "T3chNova@2025";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,  // 👈 Inyectar el servicio de autenticación
    private router: Router  // 👈 Inyectar Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);

          const token = this.authService.getToken();
          if (token) {
            console.log('Token guardado:', token);
            this.router.navigate(['/home']); // 👈 Redirigir al usuario
          }
        },
        error: (error) => {
          console.error('Error en el login:', error);
          this.errorMessage = 'Las credenciales son incorrectas';
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }
}
