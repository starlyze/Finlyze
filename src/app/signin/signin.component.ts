import { Component } from '@angular/core';
import {CanvasBackgroundComponent} from "../components/canvas-background/canvas-background.component";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CanvasBackgroundComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {

}
