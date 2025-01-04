import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {GraphComponent} from "../../../components/graph/graph.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    GraphComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  @Input() token: string;
  username: string | null = null;
  data: any = [[0, 0], [1, 2], [2, 1]];

  constructor(private router: Router, private authService: AuthService) {
    this.username = this.authService.username;
  }
}
