import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_helpers/auth.guard';
import { Role } from '../_models/role';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('../modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'orders',
                loadChildren: () =>
                    import('../modules/orders/orders.module').then((m) => m.OrdersModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'user',
                loadChildren: () =>
                    import('../modules/user/user.module').then((m) => m.UserModule),
                canActivate: [AuthGuard],
                data: { roles: [Role.SA] }
            },
            {
                path: 'listings',
                loadChildren: () =>
                    import('../modules/listings/listings.module').then((m) => m.ListingsModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'portfolio',
                loadChildren: () =>
                    import('../modules/portfolio/portfolio.module').then((m) => m.PortfolioModule),
                canActivate: [AuthGuard],
                data: { roles: [Role.Owner,Role.Investor] }
            },
            {
                path: 'my-assets',
                loadChildren: () =>
                import('../modules/my-assets/my-assets.module').then((m) => m.MyAssetsModule),
                canActivate: [AuthGuard],
                data: { roles: [Role.Owner] }
            },
            // Owner = 'Owner',
            // SA = 'SA',
            // Promissory='Promissory',
            // Investor='Investor'
            {
                path: '',
                redirectTo: 'listings',
                pathMatch: 'full',
            },
            {
                path: '**',
                redirectTo: 'errors/404',
                pathMatch: 'full',
            },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule { }
