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
  maxX: number;
  maxY: number;

  @ViewChild('canvasContainer', {static: true}) containerRef: ElementRef<HTMLDivElement>;

  private container: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.draw();
  }

  ngOnInit() {
    this.container = this.containerRef.nativeElement;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.container.appendChild(this.canvas);

    if (this.data.length > 0) {
      this.maxX = this.data[0][0];
      this.maxY = this.data[0][1];
      for (let i = 1; i < this.data.length; i++) {
        if (this.data[i][0] > this.maxX) {
          this.maxX = this.data[i][0];
        }
        if (this.data[i][1] > this.maxY) {
          this.maxY = this.data[i][1];
        }
      }
    }

    this.context = this.canvas.getContext('2d')!;
    this.draw();
  }

  draw(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.lineWidth = 3;
    this.context.beginPath();
    this.context.strokeStyle = 'white';

    if (this.data.length > 0) {
      this.context.moveTo(0, this.container.clientHeight-100);
    }

    this.context.moveTo(0, this.container.clientHeight-100);
    this.context.lineTo(this.container.clientWidth/2, 0);
    this.context.lineTo(this.container.clientWidth, this.container.clientHeight-100);
    this.context.stroke();
    this.context.lineTo(this.container.clientWidth, this.container.clientHeight);
    this.context.lineTo(0, this.container.clientHeight);

    this.context.fill();
  }
}
