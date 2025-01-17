import { Component } from '@angular/core';
import {BackgroundComponent} from "../../../components/background/background.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [
    BackgroundComponent,
    ButtonComponent,
    NgIf
  ],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.scss'
})
export class VerifyComponent {
  error: string | null = null;
  loading: boolean = false;
  success: boolean = false;
  constructor(private authService: AuthService, private router: Router) {
    this.requestVerification();
  }
  requestVerification(): void {
    this.loading = true;
    this.success = false;
    this.error = null;
    if (this.authService.email) {
      this.authService.onRequestVerification(this.authService.email).subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
        },
        error: (error: any) => {
          this.error = error.message;
          this.loading = false;
        }
      })
    } else {
      this.router.navigateByUrl('').catch((error: Error) => {});
    }
  }
}
