
export interface IAttachment {
  id?: number;
  name?: string;
  bytesContentType?: string;
  bytes?: any;
}

export class Attachment implements IAttachment {
  constructor(
    public id?: number,
    public name?: string,
    public bytesContentType?: string,
    public bytes?: any
  ) {}
}
