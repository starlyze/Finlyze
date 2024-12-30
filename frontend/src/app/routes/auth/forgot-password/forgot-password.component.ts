import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CanvasBackgroundComponent} from "../../../components/canvas-background/canvas-background.component";
import {TextFieldComponent} from "../../../components/text-field/text-field.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {NgIf} from "@angular/common";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [
    CanvasBackgroundComponent,
    ReactiveFormsModule,
    TextFieldComponent,
    ButtonComponent,
    NgIf
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  loading: boolean = false;
  sent: boolean = false;
  emailError: string;
  serverError: string;
  constructor(private fb: FormBuilder, private authService: AuthService) {}
  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', Validators.required],
    })
  }
  onSubmit() {
    this.loading = true;
    this.sent = false;
    this.emailError = '';
    this.serverError = '';
    this.authService.onForgotPassword(this.forgotPasswordForm.value.email).subscribe({
      next: () => {
        this.sent = true;
        this.loading = false;
      },
      error: (error: any) => {
        this.emailError = error && error.errors.email;
        this.serverError = error && error.errors.server;
        this.loading = false;
        this.forgotPasswordForm.reset();
      }
    })
  }
}
