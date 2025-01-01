import { Routes } from '@angular/router';
import {HomeComponent} from "./routes/info/home/home.component";
import {SigninComponent} from "./routes/auth/signin/signin.component";
import {ProductComponent} from "./routes/info/product/product.component";
import {AboutComponent} from "./routes/info/about/about.component";
import {SignupComponent} from "./routes/auth/signup/signup.component";
import {ForgotPasswordComponent} from "./routes/auth/forgot-password/forgot-password.component";
import {ChangePasswordComponent} from "./routes/auth/change-password/change-password.component";
import {DashboardComponent} from "./routes/user/dashboard/dashboard.component";
import {VerifyComponent} from "./routes/auth/verify/verify.component";
import {authGuard} from "./guards/auth.guard";
import {PublicLayoutComponent} from "./layouts/public-layout/public-layout.component";
import {UserLayoutComponent} from "./layouts/user-layout/user-layout.component";
import {InvestmentsComponent} from "./routes/user/investments/investments.component";
import {TransactionsComponent} from "./routes/user/transactions/transactions.component";
import {GoalsComponent} from "./routes/user/goals/goals.component";
import {BudgetComponent} from "./routes/user/budget/budget.component";
import {ProfileComponent} from "./routes/user/profile/profile.component";
import {SettingsComponent} from "./routes/user/settings/settings.component";

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'signin', component: SigninComponent, canActivate: [authGuard] },
      { path: 'signup', component: SignupComponent, canActivate: [authGuard] },
      { path: 'product', component: ProductComponent },
      { path: 'about', component: AboutComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'verify', component: VerifyComponent, canActivate: [authGuard] },
    ]
  },
  {
    path: 'dashboard',
    component: UserLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['user'] },
    children: [
      { path: '', component: DashboardComponent },
      { path: 'investments', component: InvestmentsComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'goals', component: GoalsComponent },
      { path: 'budget', component: BudgetComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
