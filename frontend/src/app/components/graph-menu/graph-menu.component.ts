import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-graph-menu',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './graph-menu.component.html',
  styleUrl: './graph-menu.component.scss'
})
export class GraphMenuComponent {
  active: number = 0;
  @Output() activeChange = new EventEmitter<number>();
  setActive(index: number) {
    this.active = index;
    this.activeChange.emit(index);
  }
}
