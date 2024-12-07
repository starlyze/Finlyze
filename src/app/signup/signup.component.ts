import { Component } from '@angular/core';
import {CanvasBackgroundComponent} from "../components/canvas-background/canvas-background.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CanvasBackgroundComponent,
    RouterLink
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

}
