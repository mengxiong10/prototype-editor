import { TypedEvent } from 'src/utils/typedEvent';

export const drawingEvent = new TypedEvent<string>();

export interface DetailChangeEvent {
  type: string;
  path: string;
}

export const detailChangeEvent = new TypedEvent<DetailChangeEvent | null>();
