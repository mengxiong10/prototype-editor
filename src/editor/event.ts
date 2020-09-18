import { TypedEvent } from 'src/utils/typedEvent';

export const EventDrawing = new TypedEvent<string>();

export interface EventCompositeSelectProps {
  path: string;
  id: string;
}

export const EventCompositeSelect = new TypedEvent<EventCompositeSelectProps | null>();
