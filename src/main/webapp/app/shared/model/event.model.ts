import { ITask } from '@/shared/model/task.model';

import { Status } from '@/shared/model/enumerations/status.model';
export interface IEvent {
  id?: number;
  title?: string | null;
  content?: string | null;
  start?: Date | null;
  end?: Date | null;
  status?: Status | null;
  participants?: string | null;
  allDay?: boolean | null;
  tasks?: ITask[] | null;
  userId?: number | null;
}

export class Event implements IEvent {
  constructor(
    public id?: number,
    public title?: string | null,
    public content?: string | null,
    public start?: Date | null,
    public end?: Date | null,
    public status?: Status | null,
    public participants?: string | null,
    public allDay?: boolean | null,
    public tasks?: ITask[] | null,
    public userId?: number | null
  ) {
    this.allDay = this.allDay ?? false;
  }
}
