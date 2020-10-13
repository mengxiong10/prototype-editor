import { TypedEvent } from 'src/utils/typedEvent';
import type { ComponentId } from './type';

export const EventDrawing = new TypedEvent<string>();

export interface EventCompositeSelectProps {
  path: string;
  id: string;
}

export const EventCompositeSelect = new TypedEvent<EventCompositeSelectProps | null>();

export interface EditableParam {
  children: string;
  style: Partial<React.CSSProperties>;
  rect: Record<'left' | 'top' | 'width' | 'height', number>;
  id: ComponentId;
  path: string;
}
export const EventEditable = new TypedEvent<EditableParam | null>();
