import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CanvasBackgroundComponent} from "../components/canvas-background/canvas-background.component";
import {TextFieldComponent} from "../components/text-field/text-field.component";
import {ButtonComponent} from "../components/button/button.component";

@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [
    CanvasBackgroundComponent,
    ReactiveFormsModule,
    TextFieldComponent,
    ButtonComponent
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', Validators.required],
    })
  }
  onSubmit() {
    console.log(this.forgotPasswordForm.value);
  }
}
