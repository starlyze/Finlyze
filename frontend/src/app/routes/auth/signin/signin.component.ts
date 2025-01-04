import {Component, inject, Input, OnInit} from '@angular/core';
import {BackgroundComponent} from "../../../components/background/background.component";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {TextFieldComponent} from "../../../components/text-field/text-field.component";
import {CheckboxComponent} from "../../../components/checkbox/checkbox.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {} from "@angular/common/http";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    BackgroundComponent,
    RouterLink,
    RouterLinkActive,
    TextFieldComponent,
    CheckboxComponent,
    ButtonComponent,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent implements OnInit {
  @Input() token: string;
  signinForm: FormGroup;
  emailError: string | null = null;
  passwordError: string | null = null;
  serverError: string | null = null;
  verifyError: boolean = false;
  loading: boolean = false;
  verified: boolean = false;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signinForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: false
    })
  }
  ngOnInit() {
    if (this.token) {
      this.loading = true;
      this.authService.onVerifyEmail(this.token).subscribe({
        next: () => {
          this.verified = true;
          this.loading = false;
        },
        error: (error: any) => {
          this.loading = false;
          this.emailError = error.message;
        }
      })
    }
  }

  onSubmit() {
    this.loading = true;
    this.verified = false;
    this.authService.email = this.signinForm.value.email;
    this.authService.onSignin(this.signinForm.value).subscribe({
      next: async () => {
        this.authService.onAuthenticate();
        await this.router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        this.emailError = error && error.errors.email;
        this.passwordError = error && error.errors.password;
        this.serverError = error && error.errors.server;
        this.verifyError = error && error.errors.verify;
        if (this.emailError) {
          this.signinForm.controls['email'].setValue('');
          this.signinForm.controls['password'].setValue('');
        } else if (this.passwordError) this.signinForm.controls['password'].setValue('');
        this.loading = false;
      }
    })
  }
  onGoogleSignin() {
    this.authService.onGoogleSignin().subscribe({
      next: (res: any) => {
        window.location.href = res.url;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
