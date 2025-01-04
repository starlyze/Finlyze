import {Component, Input, OnInit} from '@angular/core';
import {BackgroundComponent} from "../../../components/background/background.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TextFieldComponent} from "../../../components/text-field/text-field.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {AuthService} from "../../../services/auth.service";
import {Router, RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    BackgroundComponent,
    ReactiveFormsModule,
    TextFieldComponent,
    ButtonComponent,
    NgIf,
    RouterLink
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
  @Input() token: string;
  changePasswordForm: FormGroup;
  passwordError: string | null = null;
  confirmPasswordError: string | null = null;
  loading: boolean = false;
  changed: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.changePasswordForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }
  ngOnInit() {
    if (!this.token) {
      this.router.navigateByUrl('/').catch(() => {});
    }
  }
  onSubmit() {
    this.loading = true;
    this.authService.onChangePassword(this.changePasswordForm.value, this.token).subscribe({
      next: () => {
        this.changed = true;
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        if (error.error) {
          this.confirmPasswordError = error.error;
        } else {
          this.passwordError = error && error.errors.password;
          this.confirmPasswordError = error && error.errors.confirmPassword;
          this.changePasswordForm.reset();
        }
      }
    });
  }
}
