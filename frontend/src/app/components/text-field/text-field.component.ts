import {AfterContentInit, Component, ContentChild, ElementRef, Input, input, OnInit, viewChild} from '@angular/core';
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgTemplateOutlet
  ],
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss'
})
export class TextFieldComponent {
  @ContentChild('content', { static: false }) contentElement: ElementRef | null = null;
  @Input() type: string = 'text';
  @Input() public form: FormGroup;
  @Input() name: string = '';
  visible: boolean = false;
  changeVisibility(): void {
    this.visible = !this.visible;
  }
}
