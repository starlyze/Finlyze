import {Component, OnInit, ViewChild, ElementRef, HostListener, Input} from '@angular/core';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss'
})
export class GraphComponent implements OnInit {
  @Input() data: any;
  @Input() density: number;

  @ViewChild('canvasContainer', {static: true}) containerRef: ElementRef<HTMLDivElement>;

  private container: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
  }

  ngOnInit() {
    this.container = this.containerRef.nativeElement;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.container.appendChild(this.canvas);

    this.context = this.canvas.getContext('2d')!;
    this.draw();
  }

  draw(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.strokeStyle = 'white';
    this.context.lineWidth = 3;
    this.context.beginPath();
    this.context.moveTo(0, this.container.clientHeight);
    this.context.lineTo(this.container.clientWidth, this.container.clientHeight);
    this.context.stroke();
  }
}
