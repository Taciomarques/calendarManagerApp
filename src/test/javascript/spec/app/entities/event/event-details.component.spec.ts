/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import VueRouter from 'vue-router';

import * as config from '@/shared/config/config';
import EventDetailComponent from '@/entities/event/event-details.vue';
import EventClass from '@/entities/event/event-details.component';
import EventService from '@/entities/event/event.service';
import router from '@/router';
import AlertService from '@/shared/alert/alert.service';

const localVue = createLocalVue();
localVue.use(VueRouter);

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('router-link', {});

describe('Component Tests', () => {
  describe('Event Management Detail Component', () => {
    let wrapper: Wrapper<EventClass>;
    let comp: EventClass;
    let eventServiceStub: SinonStubbedInstance<EventService>;

    beforeEach(() => {
      eventServiceStub = sinon.createStubInstance<EventService>(EventService);

      wrapper = shallowMount<EventClass>(EventDetailComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: { eventService: () => eventServiceStub, alertService: () => new AlertService() },
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundEvent = { id: 123 };
        eventServiceStub.find.resolves(foundEvent);

        // WHEN
        comp.retrieveEvent(123);
        await comp.$nextTick();

        // THEN
        expect(comp.event).toBe(foundEvent);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundEvent = { id: 123 };
        eventServiceStub.find.resolves(foundEvent);

        // WHEN
        comp.beforeRouteEnter({ params: { eventId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.event).toBe(foundEvent);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        comp.previousState();
        await comp.$nextTick();

        expect(comp.$router.currentRoute.fullPath).toContain('/');
      });
    });
  });
});
