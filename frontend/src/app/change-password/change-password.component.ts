import {Component, OnInit} from '@angular/core';
import {CanvasBackgroundComponent} from "../components/canvas-background/canvas-background.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TextFieldComponent} from "../components/text-field/text-field.component";
import {ButtonComponent} from "../components/button/button.component";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CanvasBackgroundComponent,
    ReactiveFormsModule,
    TextFieldComponent,
    ButtonComponent
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }
  onSubmit() {
    console.log(this.changePasswordForm.value);
  }
}
