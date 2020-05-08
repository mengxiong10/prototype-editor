import { DraggableData } from 'react-draggable';
import { TypedEvent } from '@/utils/typedEvent';
import { ResizeStatus } from './ComponentWrapper';

// 一个组件拖动, 其余选中的组件 监听事件也拖动
export const componentDragEvent = new TypedEvent<{ data: DraggableData; status: ResizeStatus }>();
export const componentDragStopEvent = new TypedEvent();
