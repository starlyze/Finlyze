import {CanActivateFn, Router} from '@angular/router';
import {AccountService} from "../services/account.service";
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = async (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  if (accountService.authenticated) return true;
  else if (await accountService.isAuthenticated()) {
    return true;
  } else {
    await router.navigateByUrl('/signin');
    return false;
  }

};
