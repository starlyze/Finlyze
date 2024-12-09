import {Component, OnInit} from '@angular/core';
import {CanvasBackgroundComponent} from "../components/canvas-background/canvas-background.component";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {TextFieldComponent} from "../components/text-field/text-field.component";
import {CheckboxComponent} from "../components/checkbox/checkbox.component";
import {ButtonComponent} from "../components/button/button.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

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
    ReactiveFormsModule
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.signinForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: false
    })
    // this.signinForm.valueChanges.subscribe(updatedForm => console.log(updatedForm));
  }
  onSubmit() {
    if (this.signinForm.valid) {
      console.log(this.signinForm.value);
    } else {
      console.log(this.signinForm);
    }
  }
}
