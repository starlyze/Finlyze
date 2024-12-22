import {Component, HostListener} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  atTop: boolean = true;
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    this.atTop = scrollTop == 0;
  }
}
