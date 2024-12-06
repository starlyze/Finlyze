import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {SigninComponent} from "./signin/signin.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signin', component: SigninComponent },
];
