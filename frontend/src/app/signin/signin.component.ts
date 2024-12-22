import {Component, inject, Input, OnInit} from '@angular/core';
import {CanvasBackgroundComponent} from "../components/canvas-background/canvas-background.component";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {TextFieldComponent} from "../components/text-field/text-field.component";
import {CheckboxComponent} from "../components/checkbox/checkbox.component";
import {ButtonComponent} from "../components/button/button.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AccountService} from "../services/account.service";
import {HttpClientModule} from "@angular/common/http";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CanvasBackgroundComponent,
    RouterLink,
    RouterLinkActive,
    TextFieldComponent,
    CheckboxComponent,
    ButtonComponent,
    ReactiveFormsModule,
    HttpClientModule,
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
  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) {
    this.signinForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: false
    })
  }
  ngOnInit() {
    if (this.token) {
      this.loading = true;
      this.accountService.onVerifyEmail(this.token).subscribe({
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
    this.accountService.email = this.signinForm.value.email;
    this.accountService.onSignin(this.signinForm.value).subscribe({
      next: async (res: any) => {
        localStorage.setItem('token', res.token);
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
  onVerify() {
    this.router.navigateByUrl('/verify');
  }
}
