import React, { useRef, useEffect } from 'react';
import type { ComponentData } from 'src/editor/type';

export interface StageCanvasProps {
  data: ComponentData[];
  scale: number;
}

// 主要是绘制页面上不需要响应鼠标事件的图形
// * 标注的连接线
function StageCanvas({ data, scale }: StageCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const parent = canvas.offsetParent!;
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;
    const map: { [key: string]: ComponentData } = {} as any;
    data.forEach((v) => {
      map[v.id] = v;
    });
    const lines = data
      .filter((v) => v.association !== undefined && map[v.association])
      .map((current) => {
        const target = map[current.association!];
        const point = [
          [0, 0],
          [0, 0],
        ];
        const mx1 = target.left + target.width / 2;
        const my1 = target.top + target.height / 2;
        const mx2 = current.left + current.width / 2;
        const my2 = current.top + current.height / 2;
        const slope1 = target.height / target.width;
        const slope2 = current.height / current.width;
        const slope = (my1 - my2) / (mx1 - mx2);
        if (slope1 > Math.abs(slope)) {
          point[0][0] = mx1 > mx2 ? target.left : target.left + target.width;
          point[0][1] = Math.floor(slope * (point[0][0] - mx1) + my1);
        } else {
          point[0][1] = my1 > my2 ? target.top : target.top + target.height;
          point[0][0] = Math.floor((point[0][1] - my1) / slope + mx1);
        }
        if (slope2 > Math.abs(slope)) {
          point[1][0] = mx2 > mx1 ? current.left : current.left + current.width;
          point[1][1] = Math.floor(slope * (point[1][0] - mx2) + my2);
        } else {
          point[1][1] = my2 > my1 ? current.top : current.top + current.height;
          point[1][0] = Math.floor((point[1][1] - my2) / slope + mx2);
        }
        return point;
      });
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(221, 208, 0)';
    ctx.lineWidth = 2;
    lines.forEach((points) => {
      ctx.moveTo(points[0][0] * scale, points[0][1] * scale);
      ctx.lineTo(points[1][0] * scale, points[1][1] * scale);
    });
    ctx.stroke();
  }, [data, scale]);

  return (
    <canvas style={{ pointerEvents: 'none', position: 'absolute', zIndex: 10 }} ref={ref}></canvas>
  );
}

export default StageCanvas;
