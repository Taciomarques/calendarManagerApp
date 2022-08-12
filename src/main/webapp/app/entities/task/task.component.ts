import {Component, Vue, Inject, Prop, Emit, Watch} from 'vue-property-decorator';
import {ITask} from '@/shared/model/task.model';
import {Status} from "@/shared/model/enumerations/status.model";
import {required, requiredIf} from "vuelidate/lib/validators";
import {TypeTask} from "@/shared/model/enumerations/type-task.model";
import {PriorityTask} from "@/shared/model/enumerations/priority-task.model";
import {mixins} from "vue-class-component";
import JhiDataUtils from "@/shared/data/data-utils.service";
import {Attachment, IAttachment} from "@/shared/model/attachment";
import lodash from 'lodash';

const validations: any = {
  taskSelected: {
    title: {
      required,
    },
    description: {
      required
    },
    type: {
      required
    },
    status: {
      required
    },
    priority: {
      required
    },
    link: {
      required: requiredIf(function () {
        return this.taskSelected['type'] == 'MEETING';
      }),
    },
  },
};

@Component({
  validations,
})
export default class Task extends mixins(JhiDataUtils) {

  @Prop()
  tasksProp: ITask[];

  @Prop({default: false})
  readonly: boolean;

  public tasks: ITask[] = [];

  public taskSelected: ITask = {};
  public taskSelectedIndex = null;
  public statusValues: string[] = Object.keys(Status);
  public typeTaskValues: string[] = Object.keys(TypeTask);
  public priorityTaskValues: string[] = Object.keys(PriorityTask);

  @Watch('tasksProp')
  onTasksPropChanged() {
    if (this.tasksProp && this.tasksProp.length) {
      this.tasks = this.tasksProp;
    }
  }

  mounted() {
    if (this.tasksProp && this.tasksProp.length) {
      this.tasks = this.tasksProp;
    }
  }

  get getTasksOdered() {
    return lodash.orderBy(this.tasks, 'title');
  }

  public showTaskDialogView(task, index) {
    this.taskSelected = task;
    this.taskSelectedIndex = index;
    (<any>this.$refs.showTaskViewDialog).show();
  }

  public showTaskDialogNew() {
    (<any>this.$refs.showTaskCreateDialog).show();
  }

  public showTaskDialogEdit() {
    (<any>this.$refs.showTaskViewDialog).hide();
    (<any>this.$refs.showTaskEditDialog).show();
  }

  public showTaskDialogDelete() {
    (<any>this.$refs.showTaskEditDialog).hide();
    (<any>this.$refs.showTaskDeleteDialog).show();
  }

  public hideTaskDialogView(): void {
    this.taskSelected = {};
    this.taskSelectedIndex = {};
    (<any>this.$refs.showTaskViewDialog).hide();
  }

  public hideTaskDialogNew(): void {
    this.taskSelected = {};
    (<any>this.$refs.showTaskCreateDialog).hide();
  }

  public hideTaskDialogEdit(): void {
    (<any>this.$refs.showTaskEditDialog).hide();
    (<any>this.$refs.showTaskViewDialog).show();
  }

  public hideTaskDialogDelete(): void {
    (<any>this.$refs.showTaskDeleteDialog).hide();
  }

  @Emit('update-tasks')
  public saveTask() {
    if (this.taskSelected.id) {
      this.tasks.forEach(task => {
        if (task.id == this.taskSelected.id) {
          task.title = this.taskSelected.title;
          task.description = this.taskSelected.description;
          task.type = this.taskSelected.type;
          task.status = this.taskSelected.status;
          task.priority = this.taskSelected.priority;
          task.link = this.taskSelected.link;
          task.attachment = this.taskSelected.attachment;
          task.notes = this.taskSelected.notes;
        }
      });
      this.hideTaskDialogEdit();
      return this.tasks;
    }
    if (!this.tasks || this.tasks.length == 0) {
      this.tasks = [];
    }
    this.$set(this.taskSelected, 'id', this.tasks.length + 1);
    this.tasks.push(this.taskSelected);
    this.hideTaskDialogNew();
    return this.tasks;
  }

  public removeTask() {
    this.tasks.splice(this.taskSelectedIndex, 1);
    if (this.tasks.length == 0) {
      this.tasks = null;
    }
    this.hideTaskDialogDelete();
    this.hideTaskDialogView();
    return this.tasks;
  }

  public setAttachment(event) {
    const files = event.target.files;
    for (const file in files) {
      if (files[file] instanceof File) {
        this.toBase64(files[file], base64Data => {
          const attachment: IAttachment = new Attachment();
          attachment.bytes = base64Data;
          attachment.bytesContentType = files[file].type;
          attachment.name = files[file].name;
          this.$set(this.taskSelected, 'attachment', attachment);
        });
      }
    }
  }

  public removeAttachment(): void {
    this.taskSelected.attachment = null;
  }

  public downloadAttachment() {
    this.downloadFile(this.taskSelected.attachment.bytesContentType, this.taskSelected.attachment.bytes, this.taskSelected.attachment.name);
  }
}
