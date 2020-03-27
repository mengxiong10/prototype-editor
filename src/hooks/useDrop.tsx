export type DropDoneData = { x: number; y: number; data: string };

export type DropDoneHandler = (v: DropDoneData) => void;

export interface DropZoneProps {
  onDropDone: DropDoneHandler;
  format?: string;
}

export function useDrop({ format = 'type', onDropDone }: DropZoneProps) {
  const onDrop = (evt: React.DragEvent<HTMLDivElement>) => {
    const data = evt.dataTransfer.getData(format);
    const rect = evt.currentTarget.getBoundingClientRect();
    const y = evt.clientY - rect.top;
    const x = evt.clientX - rect.left;
    onDropDone({ x, y, data });
  };

  const onDragOver = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
  };

  return { onDrop, onDragOver };
}
