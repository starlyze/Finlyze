import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {SigninComponent} from "./signin/signin.component";
import {ProductComponent} from "./product/product.component";
import {AboutComponent} from "./about/about.component";
import {SignupComponent} from "./signup/signup.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {VerifyComponent} from "./verify/verify.component";
import {authGuard} from "./guards/auth.guard";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'product', component: ProductComponent },
  { path: 'about', component: AboutComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'verify', component: VerifyComponent },
];
