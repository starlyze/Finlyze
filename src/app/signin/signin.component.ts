import { Component } from '@angular/core';
import {CanvasBackgroundComponent} from "../components/canvas-background/canvas-background.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CanvasBackgroundComponent,
    RouterLink
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {

}
