import { Component } from '@angular/core';
import {CanvasBackgroundComponent} from "../components/canvas-background/canvas-background.component";
import {RouterLink} from "@angular/router";
import {TextFieldComponent} from "../components/text-field/text-field.component";
import {ButtonComponent} from "../components/button/button.component";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CanvasBackgroundComponent,
    RouterLink,
    TextFieldComponent,
    ButtonComponent
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

}
