import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ApikeysComponent } from './apikeys/apikeys.component';
import { TransactionsCreateComponent } from './transactions-create/transactions-create.component';
import { ClientsComponent } from './clients/clients.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guards';
import { ApikeysCreateComponent } from './apikeys-create/apikeys-create.component';
import { ReportsComponent } from './reports/reports.component';
import { ClientCreateComponent } from './clients-create/clients-create.component';
export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard] },
    { path: 'transactions-create', component: TransactionsCreateComponent, canActivate: [AuthGuard] },
    { path: 'apikeys', component: ApikeysComponent, canActivate: [AuthGuard] },
    { path: 'apikeys-create', component: ApikeysCreateComponent, canActivate: [AuthGuard] },
    { path: 'clients', component: ClientsComponent, canActivate: [AuthGuard] },
    { path: 'clients-create', component: ClientCreateComponent, canActivate: [AuthGuard] },
    { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] }
];