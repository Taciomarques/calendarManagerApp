import {Component, Vue, Prop} from 'vue-property-decorator';

import {PriorityTask} from "@/shared/model/enumerations/priority-task.model";

@Component
export default class ShowPriorityTask extends Vue {

  @Prop()
  priority: PriorityTask;
}
