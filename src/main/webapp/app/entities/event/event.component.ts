import {Component, Vue, Inject, Watch} from 'vue-property-decorator';
import Vue2Filters from 'vue2-filters';
import dayjs from "dayjs";
import {DATE_TIME_FORMAT, DATE_TIME_LONG_FORMAT} from "@/shared/date/filters";
import {Status} from "@/shared/model/enumerations/status.model";
import EventService from "@/entities/event/event.service";
import {Event} from "@/shared/model/event.model";
import AlertService from "@/shared/alert/alert.service";
import {required, requiredIf} from "vuelidate/lib/validators";

const validations: any = {
  eventClicked: {
    title: { required },
    content: { required },
    start: {
      required: requiredIf(function () {
        return !this.eventClicked['allDay'];
      }),
    },
    end: {
      required: requiredIf(function () {
        return !this.eventClicked['allDay'];
      }),
    },
    allDay: {
      required: requiredIf(function () {
        return !this.eventClicked['start'] && !this.eventClicked['start'];
      }),
    },
    status: { required },
    participants: {},
    tasks: {}
  },
};

@Component({
  mixins: [Vue2Filters.mixin],
  validations
})
export default class EventComponent extends Vue {

  @Inject('eventService') private eventService: () => EventService;
  @Inject('alertService') private alertService: () => AlertService;

  public events: Array<Event> = [];
  public eventsVueCal = [];
  public statusValues: string[] = Object.keys(Status);
  public isSaving = false;
  public eventClicked = {};

  public mounted(): void {
    this.eventClicked = {};
    this.retrieveEvents();
  }

  public retrieveEvents() {
    this.eventService()
      .retrieve()
      .then(res => {
        this.events = res.data;
        this.events.forEach(event => {
          this.eventsVueCal.push({
            id: event.id,
            start: dayjs(event.start).format(DATE_TIME_FORMAT),
            end: dayjs(event.end).format(DATE_TIME_FORMAT),
            title: event.title,
            content: event.content,
            allDay: event.allDay,
            class: this.findEventClass(event),
            status: event.status,
            participants: event.participants,
            userId: event.userId,
            tasks: event.tasks
          });
        });
      });
  }

  public findEventClass(event) {
    switch (event.status) {
      case Status.TODO:
        if (event.end < dayjs(new Date()).format(DATE_TIME_LONG_FORMAT)) {
          return "red-event";
        }
        return "blue-event";
        break;
      case Status.DOING:
        return "yellow-event";
        break;
      case Status.DONE:
        return "green-event";
        break;
    }
  }

  public hideEventDialogView(): void {
    this.eventClicked = {};
    (<any>this.$refs.showEventViewDialog).hide();
  }

  public hideEventDialogEdit(): void {
    (<any>this.$refs.showEventEditDialog).hide();

    this.eventClicked['start'] = new Date(dayjs(this.eventClicked['start']).format(DATE_TIME_FORMAT));
    this.eventClicked['end'] = new Date(dayjs(this.eventClicked['end']).format(DATE_TIME_FORMAT));

    (<any>this.$refs.showEventViewDialog).show();
  }

  public hideEventDialogNew(): void {
    this.eventClicked = {};
    (<any>this.$refs.showEventNewDialog).hide();
  }

  public hideEventDialogDelete(): void {
    (<any>this.$refs.showEventDeleteDialog).hide();
  }

  public showEventDialogView (event) {
    this.eventClicked = event;
    if (this.eventClicked['id']) {
      (<any>this.$refs.showEventViewDialog).show();
      return;
    }
    this.eventClicked['start'] = dayjs(this.eventClicked['start']).format(DATE_TIME_LONG_FORMAT);
    this.eventClicked['end'] = dayjs(this.eventClicked['end']).format(DATE_TIME_LONG_FORMAT);
    (<any>this.$refs.showEventNewDialog).show();
  }

  public showEventDialogEdit () {
    (<any>this.$refs.showEventViewDialog).hide();

    this.eventClicked['start'] = dayjs(this.eventClicked['start']).format(DATE_TIME_LONG_FORMAT);
    this.eventClicked['end'] = dayjs(this.eventClicked['end']).format(DATE_TIME_LONG_FORMAT);

    (<any>this.$refs.showEventEditDialog).show();
  }

  public showEventDialogDelete () {
    (<any>this.$refs.showEventEditDialog).hide();
    (<any>this.$refs.showEventDeleteDialog).show();
  }

  public saveEvent(): void {
    this.isSaving = true;
    if (this.eventClicked['id']) {
      this.eventService()
        .update(this.eventClicked)
        .then(param => {
          const message = this.$t('calendarManagerApp.event.updated', { param: param.id });
          return this.$root.$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Info',
            variant: 'info',
            solid: true,
            autoHideDelay: 5000,
          });
        })
        .catch(error => {
          this.alertService().showHttpError(this, error.response);
        })
        .finally(() => {
          (<any>this.$refs.showEventEditDialog).hide();
          (<any>this.$refs.showEventViewDialog).hide();
          this.eventClicked = {};
          this.isSaving = false;
          this.$router.go(0);
        });
    } else {
      this.eventService()
        .create(this.eventClicked)
        .then(param => {
          const message = this.$t('calendarManagerApp.event.created', { param: param.id });
          this.$root.$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Success',
            variant: 'success',
            solid: true,
            autoHideDelay: 5000,
          });
        })
        .catch(error => {
          this.alertService().showHttpError(this, error.response);
        })
        .finally(() => {
          (<any>this.$refs.showEventNewDialog).hide();
          (<any>this.$refs.showEventViewDialog).hide();
          this.eventClicked = {};
          this.isSaving = false;
          this.$router.go(0);
        });
    }
  }

  public removeEvent(): void {
    this.eventService()
      .delete(this.eventClicked['id'])
      .then(() => {
        const message = this.$t('calendarManagerApp.event.deleted', { param: this.eventClicked['id'] });
        this.$bvToast.toast(message.toString(), {
          toaster: 'b-toaster-top-center',
          title: 'Info',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
        });
        this.hideEventDialogDelete();
        this.eventClicked = {};
        this.$router.go(0);
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  get tasksInvalid() {
    console.log(this.eventClicked['tasks']);
    return this.eventClicked['tasks'] == null || this.eventClicked['tasks'] == undefined || this.eventClicked['tasks'].length == 0;
  }

  // @Watch('eventClicked')
  // public invalidEvent() {
  //   return !this.eventClicked['title'] || !this.eventClicked['content'] ||
  //     !this.eventClicked['start'] || !this.eventClicked['end'] ||
  //     !this.eventClicked['tasks'] || !this.eventClicked['tasks'].length ||
  //     !this.eventClicked['status'];
  // }

}
