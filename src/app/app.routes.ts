import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {SigninComponent} from "./signin/signin.component";
import {ProductComponent} from "./product/product.component";
import {AboutComponent} from "./about/about.component";
import {SignupComponent} from "./signup/signup.component";
import {ForgotComponent} from "./forgot/forgot.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'product', component: ProductComponent },
  { path: 'about', component: AboutComponent },
  { path: 'forgot', component: ForgotComponent }
];
