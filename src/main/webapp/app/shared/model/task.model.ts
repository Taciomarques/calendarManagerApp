import { IEvent } from '@/shared/model/event.model';

import { TypeTask } from '@/shared/model/enumerations/type-task.model';
import { Status } from '@/shared/model/enumerations/status.model';
import { PriorityTask } from '@/shared/model/enumerations/priority-task.model';
import {Attachment, IAttachment} from "@/shared/model/attachment";
export interface ITask {
  id?: number;
  title?: string | null;
  description?: string | null;
  type?: TypeTask | null;
  status?: Status | null;
  link?: string | null;
  notes?: string | null;
  attachment?: IAttachment | null;
  priority?: PriorityTask | null;
  event?: IEvent | null;
}

export class Task implements ITask {
  constructor(
    public id?: number,
    public title?: string | null,
    public description?: string | null,
    public type?: TypeTask | null,
    public status?: Status | null,
    public link?: string | null,
    public notes?: string | null,
    public attachment?: IAttachment | null,
    public priority?: PriorityTask | null,
    public event?: IEvent | null
  ) {}
}
