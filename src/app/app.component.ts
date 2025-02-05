import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UserComponent } from './user/user.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, UserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Techpay';
  authenticated: boolean = false;
  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 500);
    this.authenticated = this.auth.isAuthenticated();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}