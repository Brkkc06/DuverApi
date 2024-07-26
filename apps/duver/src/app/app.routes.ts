import { Route } from '@angular/router';
import { LoginComponentComponent } from './components/login-component/login-component.component';
import { RegisterComponentComponent } from './components/register-component/register-component.component';
import { HomeComponentComponent } from './components/home-component/home-component.component';
import { ProfileComponentComponent } from './components/profile-component/profile-component.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const appRoutes: Route[] = [
    {path:"login",component:LoginComponentComponent},
    {path:"register",component:RegisterComponentComponent},
    {path:"",component:HomeComponentComponent},
    {path:"profile",component:ProfileComponentComponent},
    {path:"statistics",component:DashboardComponent}
];
