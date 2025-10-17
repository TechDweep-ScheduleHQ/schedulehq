export interface Event {
  id: number;
  UserId: number;
  title: string;
  url: string;
  description: string;
  duration: string;
  hidden: boolean;
  createdAt: Date;
  updatedAt: string;
  user?: {
    email: string;
    username: string;
  };
}

export interface EventGetResponse {
  status: boolean;
  message: string;
  data: {
    events: Event[];
    totalEvents: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface EventResponse {
  status: boolean;
  message: string;
  event: Event;
}

export interface EventCreatePayload {
  userId: number;
  title: string;
  url: string;
  description: string;
  duration: string;
}

export interface EventEditPayload {
  userId: number;
  eventId: number;
  eventPayload: {
    title?: string;
    url?: string;
    description?: string;
    duration?: string;
  };
}

export interface EventGetAndSearchPayload {
  userId: number;
  search?: string;
  page?: number;
  limit?: number;
}
