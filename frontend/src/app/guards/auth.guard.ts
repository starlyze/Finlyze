import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (route.data['roles']) {
    if (await authService.authenticated) return true;
    else await router.navigate(['/signin']);
  } else if (await authService.authenticated) await router.navigate(['/dashboard']);
  else return true;
  return false;
};
