/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import { ToastPlugin } from 'bootstrap-vue';

import * as config from '@/shared/config/config';
import EventComponent from '@/entities/event/event.vue';
import EventClass from '@/entities/event/event.component';
import EventService from '@/entities/event/event.service';
import AlertService from '@/shared/alert/alert.service';

const localVue = createLocalVue();
localVue.use(ToastPlugin);

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('b-badge', {});
localVue.directive('b-modal', {});
localVue.component('b-button', {});
localVue.component('router-link', {});

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {},
    show: () => {},
  },
};

describe('Component Tests', () => {
  describe('Event Management Component', () => {
    let wrapper: Wrapper<EventClass>;
    let comp: EventClass;
    let eventServiceStub: SinonStubbedInstance<EventService>;

    beforeEach(() => {
      eventServiceStub = sinon.createStubInstance<EventService>(EventService);
      eventServiceStub.retrieve.resolves({ headers: {} });

      wrapper = shallowMount<EventClass>(EventComponent, {
        store,
        i18n,
        localVue,
        stubs: { bModal: bModalStub as any },
        provide: {
          eventService: () => eventServiceStub,
          alertService: () => new AlertService(),
        },
      });
      comp = wrapper.vm;
    });

    it('Should call load all on init', async () => {
      // GIVEN
      eventServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // WHEN
      comp.retrieveAllEvents();
      await comp.$nextTick();

      // THEN
      expect(eventServiceStub.retrieve.called).toBeTruthy();
      expect(comp.events[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
    it('Should call delete service on confirmDelete', async () => {
      // GIVEN
      eventServiceStub.delete.resolves({});

      // WHEN
      comp.prepareRemove({ id: 123 });
      expect(eventServiceStub.retrieve.callCount).toEqual(1);

      comp.removeEvent();
      await comp.$nextTick();

      // THEN
      expect(eventServiceStub.delete.called).toBeTruthy();
      expect(eventServiceStub.retrieve.callCount).toEqual(2);
    });
  });
});
