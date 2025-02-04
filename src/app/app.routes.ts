import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ApikeysComponent } from './apikeys/apikeys.component';
import { TransactionsCreateComponent } from './transactions-create/transactions-create.component';
import { ClientsComponent } from './clients/clients.component';
export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'transactions',
        component: TransactionsComponent
    },
    {
        path: 'transactionscreate',
        component: TransactionsCreateComponent
    },
    {
        path: 'apikeys',
        component: ApikeysComponent
    },
    {
        path: 'clients',
        component: ClientsComponent
    }
];