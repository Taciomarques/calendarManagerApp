export interface IEventVueCal {
  id?: number;
  title?: string | null;
  content?: string | null;
  start?: string | null;
  end?: string | null;
  status?: string | null;
  participants?: string | null;
  allDay?: boolean | null;
  tasks?: string | null;
}

export class EventVueCal implements IEventVueCal {
  constructor(
    public id?: number,
    public title?: string | null,
    public content?: string | null,
    public start?: string | null,
    public end?: string | null,
    public status?: string | null,
    public participants?: string | null,
    public allDay?: boolean | null,
    public tasks?: string | null
  ) {
    this.allDay = this.allDay ?? false;
  }
}
