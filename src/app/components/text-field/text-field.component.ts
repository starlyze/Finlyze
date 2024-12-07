import {AfterContentInit, Component, ContentChild, ElementRef, input, viewChild} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss'
})
export class TextFieldComponent implements AfterContentInit {
  @ContentChild('content', { static: false }) contentElement: ElementRef | null = null;
  type = input.required<string>();
  label = true;
  ngAfterContentInit() {
    this.label = !this.contentElement?.nativeElement?.textContent.trim();
  }
}
