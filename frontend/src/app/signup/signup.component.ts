import {Component, OnInit} from '@angular/core';
import {CanvasBackgroundComponent} from "../components/canvas-background/canvas-background.component";
import {Router, RouterLink} from "@angular/router";
import {TextFieldComponent} from "../components/text-field/text-field.component";
import {ButtonComponent} from "../components/button/button.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {AccountService} from "../services/account.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CanvasBackgroundComponent,
    RouterLink,
    TextFieldComponent,
    ButtonComponent,
    ReactiveFormsModule,
    HttpClientModule,
    NgIf
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm: FormGroup;
  usernameError: string | null = null;
  passwordError: string | null = null;
  serverError: string | null = null;
  emailError: string | null = null;
  confirmPasswordError: string | null = null;

  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    })
  }
  onSubmit() {
    this.accountService.email = this.signupForm.value.email;
    this.accountService.onSignup(this.signupForm.value).subscribe({
      next: async (res: any) => {
        this.accountService.email = this.signupForm.value.email;
        await this.router.navigateByUrl('/verify');
      },
      error: (error) => {
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
    this.accountService.onGoogleSignin().subscribe({
      next: (res: any) => {
        window.location.href = res.url;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
