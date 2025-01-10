import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  Input,
  input,
  Output,
  EventEmitter, OnChanges
} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss'
})
export class GraphComponent implements OnChanges, OnInit {
  @Input() data: any;
  @Input() relative: boolean = false;
  @Output() hoverIndexChange = new EventEmitter<number>();
  minDataLength: number = 2;
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
  onResize() {
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
    this.context = this.canvas.getContext('2d', {willReadFrequently: true})!;
    this.container.addEventListener('mouseover', () => {
      this.hovered = true;
      this.hoverIndex = -1;
    });
    this.container.addEventListener('mouseout', () => {
      this.hovered = false;
      if (this.data.length > this.minDataLength) {
        this.hoverIndexChange.emit(this.data.length-1);
        this.context.putImageData(this.savedState, 0, 0);
      }
    });
    this.container.addEventListener('mousemove', (event) => {
      if (this.hovered) {
        this.drawHover(event.offsetX);
      }
    });
    if (this.data.length > this.minDataLength) {
      this.drawGraph();
    }
  }

  ngOnChanges() {
    this.minX = this.data[0][0];
    this.maxX = this.data[this.data.length-1][0];
    this.minY = Infinity;
    this.maxY = -Infinity;
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i][1] > this.maxY) {
        this.maxY = this.data[i][1];
      }
      if (this.data[i][1] < this.minY) {
        this.minY = this.data[i][1];
      }
    }
    if (this.context) {
      this.drawGraph();
    }
  }
  drawHover(x: number): void {
    if (this.data.length <= this.minDataLength) return;
    let newIndex = 0;
    for (let i = 0, minDiff = Infinity; i < this.data.length; i++) {
      const currentDiff = Math.abs(this.transformData(i)[0] - x);
      if (minDiff > currentDiff) {
          minDiff = currentDiff;
          newIndex = i;
      } else break;
    }
    if (newIndex == this.hoverIndex) return;
    this.hoverIndex = newIndex;
    this.hoverIndexChange.emit(this.hoverIndex);
    const transformedPoint = this.transformData(this.hoverIndex);
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
    const p = this.transformData(0);
    this.context.moveTo(p[0], p[1]);
    for (let i = 0; i < this.data.length-1; i++) {
      const p0 = this.transformData(i);
      const p1 = this.transformData(i+1);
      const midX = (p0[0] + p1[0]) / 2;
      this.context.bezierCurveTo(midX, p0[1], midX, p1[1], p1[0], p1[1]);
    }
  }
  transformData(index: number): number[] {
    if (this.relative) {
      return [
        (this.data[index][0] - this.minX)/(this.maxX - this.minX) * this.container.clientWidth,
        this.maxY-this.minY?this.container.clientHeight - (this.data[index][1] - this.minY)/(this.maxY - this.minY) * (this.container.clientHeight - 100) - 50:this.container.clientHeight/2
      ];
    } else {
      return [
        index/(this.data.length-1) * this.container.clientWidth,
        this.maxY-this.minY?this.container.clientHeight - (this.data[index][1] - this.minY)/(this.maxY - this.minY) * (this.container.clientHeight - 100) - 50:this.container.clientHeight/2
      ];
    }
  }
}
