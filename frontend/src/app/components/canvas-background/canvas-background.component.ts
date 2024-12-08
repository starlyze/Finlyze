import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import * as THREE from 'three';
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-canvas-background',
  standalone: true,
  imports: [],
  templateUrl: './canvas-background.component.html',
  styleUrl: './canvas-background.component.scss'
})

export class CanvasBackgroundComponent implements OnInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;

  private container: HTMLDivElement | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private uniforms: any;
  private mesh: THREE.Points | null = null;
  private geometry: THREE.PlaneGeometry | null = null;
  private material: THREE.ShaderMaterial | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private animationId: number | null = null;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        this.initThree()
      });
    }
  }

  ngOnDestroy(): void {
    if (this.renderer) this.renderer.dispose();
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (this.camera && this.renderer && this.container && this.geometry && this.material) {
      this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
      if (this.uniforms.u_resolution) {
        this.uniforms.u_resolution.value.x = this.container.offsetWidth * window.devicePixelRatio;
        this.uniforms.u_resolution.value.y = this.container.offsetHeight * window.devicePixelRatio;
      }
      this.geometry = new THREE.PlaneGeometry(
        this.container.offsetWidth/50,
        13,
        this.container.offsetWidth/5,
        130
      );
      this.mesh = new THREE.Points(this.geometry, this.material);
      this.mesh.scale.set(1, 1, 1);
      this.mesh.rotation.x = Math.PI/2;
      if (this.scene) {
        this.scene.remove(this.scene.children[0]);
        this.scene.add(this.mesh);
      }
    }
  }

  private vertexShader(): string {
    return `
    #define PI 3.14159265359

    #define AMP_1 1.0
    #define FRE_1 0.5
    #define SPE_1 0.2

    #define AMP_2 1.0
    #define FRE_2 0.6
    #define SPE_2 0.3

    uniform float u_time;
    out vec3 pos;

    float random(in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233)))*43758.5453);
    }

    float noise(in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a, b, u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;
    }

    void main() {
        gl_PointSize = 1.5;
        pos = position;
        pos.z += noise(pos.xy * FRE_1 + u_time * SPE_1) * AMP_1;
        pos.z += noise(mat2(cos(PI / 2.0), -sin(PI / 2.0), sin(PI / 2.0), -cos(PI / 2.0)) * pos.yx * FRE_2 - u_time * SPE_2) * AMP_2;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }`
  }

  private fragmentShader(): string {
    return `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform vec2 u_resolution;
    in vec3 pos;
    void main() {
        float st = gl_FragCoord.y/u_resolution.y;
        vec3 color = mix(vec3(1, 1, 1), vec3(0.3176470588235294, 0.7764705882352941, 0.8784313725490196), st+0.1*pos.z);
        gl_FragColor = vec4(color, 1.0);
    }`
  }

  private initThree(): void {
    this.container = this.canvasContainer.nativeElement;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.container.offsetWidth/this.container.offsetHeight, 0.1, 1000);
    this.camera.position.z = 10;
    this.camera.position.y = 4;
    this.camera.lookAt(new THREE.Vector3(0, 0, 1.1));

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    this.container.appendChild(this.renderer.domElement);

    this.uniforms = {
      u_time: {
        value: 0.0
      },
      u_resolution: {
        value: {
          x: this.container.offsetWidth * window.devicePixelRatio,
          y: this.container.offsetHeight * window.devicePixelRatio,
        }
      }
    };
    this.geometry = new THREE.PlaneGeometry(
      this.container.offsetWidth/50,
      13,
      this.container.offsetWidth/5,
      130
    );
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.vertexShader(),
      fragmentShader: this.fragmentShader()
    });
    this.mesh = new THREE.Points(this.geometry, this.material);
    this.mesh.rotation.x = Math.PI/2;
    this.mesh.scale.set(1, 1, 1);
    this.scene.add(this.mesh);

    const clock = new THREE.Clock();
    const animate = () => {
      if (!this.scene || !this.camera || !this.renderer) return;
      this.uniforms.u_time.value = clock.getElapsedTime();
      this.renderer.render(this.scene, this.camera);
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }
}
