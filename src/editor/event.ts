import { TypedEvent } from 'src/utils/typedEvent';

export const EventDrawing = new TypedEvent<string>();

export interface EventCompositeSelectProps {
  type: string;
  path: string;
  id: string;
}

export const EventCompositeSelect = new TypedEvent<EventCompositeSelectProps | null>();
