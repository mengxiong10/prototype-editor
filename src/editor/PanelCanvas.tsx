import React, { useRef, useEffect } from 'react';
import { ComponentData, ComponentRect } from '@/types/editor';

export interface PanelCanvasProps {
  data: ComponentData[];
  width: number;
  height: number;
}

// 主要是绘制页面上不需要响应鼠标事件的图形
// * 标注的连接线
function PanelCanvas({ data, width, height }: PanelCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;
    const map: { [key: string]: ComponentRect } = {} as any;
    data.forEach(v => {
      map[v.id] = v.rect;
    });
    const lines = data
      .filter(v => v.association !== undefined && map[v.association])
      .map(v => {
        const targetRect = map[v.association!];
        const rect = v.rect;
        const point = [
          [0, 0],
          [0, 0],
        ];
        const mx1 = targetRect.left + targetRect.width / 2;
        const my1 = targetRect.top + targetRect.height / 2;
        const mx2 = rect.left + rect.width / 2;
        const my2 = rect.top + rect.height / 2;
        const slope1 = targetRect.height / targetRect.width;
        const slope2 = rect.height / rect.width;
        const slope = (my1 - my2) / (mx1 - mx2);
        if (slope1 > Math.abs(slope)) {
          point[0][0] = mx1 > mx2 ? targetRect.left : targetRect.left + targetRect.width;
          point[0][1] = Math.floor(slope * (point[0][0] - mx1) + my1);
        } else {
          point[0][1] = my1 > my2 ? targetRect.top : targetRect.top + targetRect.height;
          point[0][0] = Math.floor((point[0][1] - my1) / slope + mx1);
        }
        if (slope2 > Math.abs(slope)) {
          point[1][0] = mx2 > mx1 ? rect.left : rect.left + rect.width;
          point[1][1] = Math.floor(slope * (point[1][0] - mx2) + my2);
        } else {
          point[1][1] = my2 > my1 ? rect.top : rect.top + rect.height;
          point[1][0] = Math.floor((point[1][1] - my2) / slope + mx2);
        }
        return point;
      });
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(221, 208, 0)';
    ctx.lineWidth = 2;
    lines.forEach(points => {
      ctx.moveTo(points[0][0], points[0][1]);
      ctx.lineTo(points[1][0], points[1][1]);
    });
    ctx.stroke();
  }, [data, height, width]);

  return (
    <canvas style={{ pointerEvents: 'none', position: 'absolute', zIndex: 10 }} ref={ref}></canvas>
  );
}

export default PanelCanvas;
