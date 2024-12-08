import { Component } from '@angular/core';
import {CanvasBackgroundComponent} from "../components/canvas-background/canvas-background.component";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {TextFieldComponent} from "../components/text-field/text-field.component";
import {CheckboxComponent} from "../components/checkbox/checkbox.component";
import {ButtonComponent} from "../components/button/button.component";

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CanvasBackgroundComponent,
    RouterLink,
    RouterLinkActive,
    TextFieldComponent,
    CheckboxComponent,
    ButtonComponent
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {

}
