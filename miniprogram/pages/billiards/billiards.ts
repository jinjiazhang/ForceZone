
const BALL_RADIUS = 22; 
const FRICTION = 0.988; 
const WALL_BOUNCE = 0.6; 
const MAX_POWER = 35; 

class Ball {
  x: number;
  y: number;
  startY: number; 
  vx: number;
  vy: number;
  color: string;
  isMoving: boolean;
  lastX: number;
  lastY: number;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.startY = y;
    this.vx = 0;
    this.vy = 0;
    this.color = color;
    this.isMoving = false;
    this.lastX = x;
    this.lastY = y;
  }

  update(canvasWidth: number, canvasHeight: number) {
    if (Math.abs(this.vx) < 0.1 && Math.abs(this.vy) < 0.1) {
      this.vx = 0;
      this.vy = 0;
      this.isMoving = false;
      return;
    }

    this.isMoving = true;
    this.vx *= FRICTION;
    this.vy *= FRICTION;

    const nextX = this.x + this.vx;
    const nextY = this.y + this.vy;

    if (nextX - BALL_RADIUS < 0 || nextX + BALL_RADIUS > canvasWidth) {
      this.vx = -this.vx * WALL_BOUNCE;
      this.x = nextX < BALL_RADIUS ? BALL_RADIUS : canvasWidth - BALL_RADIUS;
    } else {
      this.x = nextX;
    }

    if (nextY - BALL_RADIUS < 0 || nextY + BALL_RADIUS > canvasHeight) {
      this.vy = -this.vy * WALL_BOUNCE;
      this.y = nextY < BALL_RADIUS ? BALL_RADIUS : canvasHeight - BALL_RADIUS;
    } else {
      this.y = nextY;
    }

    this.lastX = this.x;
    this.lastY = this.y;
  }

  getVerticalDisplacement() {
    return Math.abs(this.y - this.startY);
  }

  draw(ctx: any) {
    ctx.beginPath();
    ctx.arc(this.x + 4, this.y + 4, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(this.x, this.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
    
    const gradient = ctx.createRadialGradient(
      this.x - BALL_RADIUS/3, this.y - BALL_RADIUS/3, BALL_RADIUS/10,
      this.x, this.y, BALL_RADIUS
    );
    gradient.addColorStop(0, 'rgba(255,255,255,0.6)');
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.1)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.1)');
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
  }
}

Page({
  data: {
    p1Pressing: false,
    p2Pressing: false,
    p1PowerPercent: 0,
    p2PowerPercent: 0,
    p1Shooting: false,
    p2Shooting: false,
    showResult: false,
    winner: '',
    p1Distance: 0,
    p2Distance: 0
  },

  canvas: null as any,
  ctx: null as any,
  p1Ball: null as Ball | null,
  p2Ball: null as Ball | null,
  animationId: 0,
  p1PowerTimer: 0,
  p2PowerTimer: 0,
  canvasWidth: 0,
  canvasHeight: 0,

  onReady() {
    const query = wx.createSelectorQuery();
    query.select('#poolCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio;
        
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);

        this.canvas = canvas;
        this.ctx = ctx;
        this.canvasWidth = res[0].width;
        this.canvasHeight = res[0].height;

        this.initBalls();
        this.startLoop();
      });
  },

  initBalls() {
    const startY = this.canvasHeight - 100;
    const centerX = this.canvasWidth / 2;
    this.p1Ball = new Ball(centerX - 60, startY, '#FFFFFF'); 
    this.p2Ball = new Ball(centerX + 60, startY, '#FF0000'); 
    
    this.setData({
      p1Shooting: false,
      p2Shooting: false,
      showResult: false,
      p1PowerPercent: 0,
      p2PowerPercent: 0
    });
  },

  startLoop() {
    const render = () => {
      this.update();
      this.draw();
      this.animationId = this.canvas.requestAnimationFrame(render);
    };
    this.animationId = this.canvas.requestAnimationFrame(render);
  },

  update() {
    if (this.p1Ball) this.p1Ball.update(this.canvasWidth, this.canvasHeight);
    if (this.p2Ball) this.p2Ball.update(this.canvasWidth, this.canvasHeight);

    if (this.data.p1Shooting && this.data.p2Shooting) {
      // Manual check to replace ?.
      const p1StillMoving = this.p1Ball ? this.p1Ball.isMoving : false;
      const p2StillMoving = this.p2Ball ? this.p2Ball.isMoving : false;
      
      if (!p1StillMoving && !p2StillMoving && !this.data.showResult) {
        setTimeout(() => {
          if (!this.data.showResult) this.handleGameOver();
        }, 800);
      }
    }
  },

  draw() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    this.ctx.beginPath();
    this.ctx.setLineDash([5, 10]);
    this.ctx.moveTo(0, this.canvasHeight - 100);
    this.ctx.lineTo(this.canvasWidth, this.canvasHeight - 100);
    this.ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    if (this.p1Ball) this.p1Ball.draw(this.ctx);
    if (this.p2Ball) this.p2Ball.draw(this.ctx);
  },

  onP1Start() {
    if (this.data.p1Shooting) return;
    this.setData({ p1Pressing: true, p1PowerPercent: 0 });
    let power = 0;
    this.p1PowerTimer = setInterval(() => {
      power += 2.5;
      if (power > 100) power = 0;
      this.setData({ p1PowerPercent: power });
    }, 25);
  },

  onP1End() {
    if (!this.data.p1Pressing) return;
    clearInterval(this.p1PowerTimer);
    const powerValue = (this.data.p1PowerPercent / 100) * MAX_POWER;
    if (this.p1Ball) this.p1Ball.vy = -powerValue;
    this.setData({ p1Pressing: false, p1Shooting: true });
  },

  onP2Start() {
    if (this.data.p2Shooting) return;
    this.setData({ p2Pressing: true, p2PowerPercent: 0 });
    let power = 0;
    this.p2PowerTimer = setInterval(() => {
      power += 2.5;
      if (power > 100) power = 0;
      this.setData({ p2PowerPercent: power });
    }, 25);
  },

  onP2End() {
    if (!this.data.p2Pressing) return;
    clearInterval(this.p2PowerTimer);
    const powerValue = (this.data.p2PowerPercent / 100) * MAX_POWER;
    if (this.p2Ball) this.p2Ball.vy = -powerValue;
    this.setData({ p2Pressing: false, p2Shooting: true });
  },

  handleGameOver() {
    // Determine winner based on vertical displacement from start line
    const v1 = this.p1Ball ? Math.round(this.p1Ball.getVerticalDisplacement()) : 0;
    const v2 = this.p2Ball ? Math.round(this.p2Ball.getVerticalDisplacement()) : 0;
    
    let winner = '平局';
    if (v1 > v2) winner = '玩家 1 (白球)';
    else if (v2 > v1) winner = '玩家 2 (红球)';

    this.setData({
      showResult: true,
      winner,
      p1Distance: v1,
      p2Distance: v2
    });
  },

  resetGame() {
    this.initBalls();
  },

  onUnload() {
    if (this.canvas && this.animationId) {
      this.canvas.cancelAnimationFrame(this.animationId);
    }
    clearInterval(this.p1PowerTimer);
    clearInterval(this.p2PowerTimer);
  }
});
