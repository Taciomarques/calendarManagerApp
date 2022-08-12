import {Component, Vue, Prop} from 'vue-property-decorator';

import {TypeTask} from "@/shared/model/enumerations/type-task.model";

@Component
export default class ShowTypeTask extends Vue {

  @Prop()
  type: TypeTask;
}
