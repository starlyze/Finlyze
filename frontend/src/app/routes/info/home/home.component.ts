import { Component } from '@angular/core';
import {CanvasBackgroundComponent} from "../../../components/canvas-background/canvas-background.component";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CanvasBackgroundComponent,
    NgOptimizedImage
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
