import { Component } from '@angular/core';
import {SearchBarComponent} from "../../../components/search-bar/search-bar.component";

@Component({
  selector: 'app-investments',
  standalone: true,
  imports: [
    SearchBarComponent
  ],
  templateUrl: './investments.component.html',
  styleUrl: './investments.component.scss'
})
export class InvestmentsComponent {

}
