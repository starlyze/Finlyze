import {Component, HostListener} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {NgIf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent {
  atTop: boolean = true;
  active: boolean = false;

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    this.atTop = scrollTop == 0;
  }
  onDisplay(): void {
    this.active = !this.active;
  }
}
