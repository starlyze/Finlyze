import {Component, Input, OnInit} from '@angular/core';
import {BackgroundComponent} from "../../../components/background/background.component";
import {Router, RouterLink} from "@angular/router";
import {TextFieldComponent} from "../../../components/text-field/text-field.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {} from "@angular/common/http";
import {AuthService} from "../../../services/auth.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    BackgroundComponent,
    RouterLink,
    TextFieldComponent,
    ButtonComponent,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  @Input() code: string;
  signupForm: FormGroup;
  usernameError: string | null = null;
  passwordError: string | null = null;
  serverError: string | null = null;
  emailError: string | null = null;
  confirmPasswordError: string | null = null;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    })

  }
  onSubmit() {
    this.loading = true;
    this.authService.email = this.signupForm.value.email;
    this.authService.onSignup(this.signupForm.value).subscribe({
      next: async () => {
        this.authService.email = this.signupForm.value.email;
        this.loading = false;
        await this.router.navigateByUrl('/verify');
      },
      error: (error) => {
        this.loading = false;
        this.usernameError = error && error.errors.username;
        this.emailError = error && error.errors.email;
        this.passwordError = error && error.errors.password;
        this.confirmPasswordError = error && error.errors.confirmPassword;
        this.serverError = error && error.errors.server;
        if (this.usernameError) this.signupForm.controls['username'].setValue('');
        if (this.emailError) {
          this.signupForm.controls['email'].setValue('');
          this.signupForm.controls['password'].setValue('');
          this.signupForm.controls['confirmPassword'].setValue('');
        } else if (this.passwordError || this.confirmPasswordError) {
          this.signupForm.controls['password'].setValue('');
          this.signupForm.controls['confirmPassword'].setValue('');
        }
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
