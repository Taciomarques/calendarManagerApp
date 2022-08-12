import {Component, Vue, Inject, Prop} from 'vue-property-decorator';

import {Status} from "@/shared/model/enumerations/status.model";

@Component
export default class ShowStatus extends Vue {

  @Prop()
  status: Status;
}
