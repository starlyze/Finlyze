import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  Input,
  input,
  Output,
  EventEmitter
} from '@angular/core';

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
  @Output() hoverIndexChange = new EventEmitter<number>();
  private maxX: number = -Infinity;
  private maxY: number = -Infinity;
  private minX: number = Infinity;
  private minY: number = Infinity;
  private hovered: boolean = false;
  private savedState: any;
  private hoverIndex: number = -1;

  @ViewChild('canvasContainer', {static: true}) containerRef: ElementRef<HTMLDivElement>;

  private container: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.drawGraph();
  }

  ngOnInit() {
    this.container = this.containerRef.nativeElement;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.container.appendChild(this.canvas);
    if (this.data.length > 0) {
      this.minX = this.data[0][0];
      this.maxX = this.data[this.data.length-1][0];
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i][1] > this.maxY) {
          this.maxY = this.data[i][1];
        }
        if (this.data[i][1] < this.minY) {
          this.minY = this.data[i][1];
        }
      }
    }
    this.context = this.canvas.getContext('2d', {willReadFrequently: true})!;
    this.drawGraph();
    this.container.addEventListener('mouseover', () => {
      this.hovered = true;
      this.hoverIndex = -1;
    });
    this.container.addEventListener('mouseout', () => {
      this.hovered = false;
      this.hoverIndexChange.emit(this.data.length-1);
      this.context.putImageData(this.savedState, 0, 0);
    });
    this.container.addEventListener('mousemove', (event) => {
      if (this.hovered) {
        this.drawHover(event.offsetX);
      }
    })
  }
  drawHover(x: number): void {
    let newIndex = 0;
    for (let i = 0, minDiff = Infinity; i < this.data.length; i++) {
      if (minDiff > Math.abs((this.data[i][0] - this.minX)/(this.maxX - this.minX) * this.container.clientWidth - x)) {
          minDiff = Math.abs((this.data[i][0] - this.minX)/(this.maxX - this.minX) * this.container.clientWidth - x);
          newIndex = i;
      } else break;
    }
    if (newIndex == this.hoverIndex) return;
    this.hoverIndex = newIndex;
    this.hoverIndexChange.emit(this.hoverIndex);
    const point = this.data[this.hoverIndex];
    const transformedPoint = this.transformData(point[0], point[1]);
    this.context.putImageData(this.savedState, 0, 0);
    this.context.beginPath();
    this.context.arc(transformedPoint[0], transformedPoint[1], 5, 0, Math.PI * 2);
    this.context.moveTo(transformedPoint[0], 0);
    this.context.lineTo(transformedPoint[0], this.container.clientHeight);
    this.context.strokeStyle = 'rgb(255, 255, 255)';
    this.context.fillStyle = 'rgb(28, 32, 34)';
    this.context.lineWidth = 0.5;
    this.context.stroke();
    this.context.fill();
  }

  drawGraph(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.beginPath();
    this.context.lineWidth = 1;
    this.context.strokeStyle = 'rgb(81,198,224)';
    this.drawSpline();
    this.context.stroke();
    this.context.lineTo(this.container.clientWidth, this.container.clientHeight);
    this.context.lineTo(0, this.container.clientHeight);
    const gradient = this.context.createLinearGradient(0, 0, 0, this.container.clientHeight);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    gradient.addColorStop(0, 'rgba(81, 198, 224, 0.2)');
    this.context.fillStyle = gradient;
    this.context.fill();
    this.savedState = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }
  drawSpline(): void {
    if (this.data.length < 2) return;
    const p = this.transformData(this.data[0][0], this.data[0][1]);
    this.context.moveTo(p[0], p[1]);
    for (let i = 0; i < this.data.length-1; i++) {
      const p0 = this.transformData(this.data[i][0], this.data[i][1]);
      const p1 = this.transformData(this.data[i+1][0], this.data[i+1][1]);
      const midX = (p0[0] + p1[0]) / 2;
      this.context.bezierCurveTo(midX, p0[1], midX, p1[1], p1[0], p1[1]);
    }
  }
  transformData(x: number, y: number): number[] {
    return [
      (x - this.minX)/(this.maxX - this.minX) * this.container.clientWidth,
      this.maxY-this.minY?this.container.clientHeight - (y - this.minY)/(this.maxY - this.minY) * (this.container.clientHeight - 100) - 50:this.container.clientHeight/2
    ];
  }
}
