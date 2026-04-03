export interface Inspector {
  id: string;
  name: string;
  phone: string;
  area: string;
  status: 'online' | 'offline';
  lastActive: string;
}

export interface Schedule {
  id: string;
  date: string;
  shift: string;
  inspector: string;
  area: string;
  status: 'active' | 'pending';
}

export interface Patrol {
  id: string;
  route: string;
  inspector: string;
  progress: number;
  startTime: string;
  status: 'in_progress' | 'completed';
}

export interface Warning {
  id: string;
  type: string;
  inspector: string;
  time: string;
  level: 'high' | 'medium' | 'low';
  status: 'unhandled' | 'handled';
}

export interface SupervisionTask {
  id: string;
  name: string;
  assignee: string;
  deadline?: string;
  submitTime?: string;
  status: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  content?: string;
  feedback?: string;
  reviewResult?: string;
  reviewComment?: string;
}
