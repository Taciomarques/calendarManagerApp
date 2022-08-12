<template>
  <div>
    <vue-cal
      :locale="$store.getters.currentLanguage"
      active-view="week"
      hide-weekends
      :events="eventsVueCal"
      :on-event-click="showEventDialogView"
      :editable-events="{ title: false, drag: false, resize: false, delete: false, create: true }"
    ></vue-cal>

    <!--   Modal de visualização de Evento   -->

    <b-modal ref="showEventViewDialog" id="eventViewDialog" size="xl">
        <span slot="modal-title" class="d-flex">
          <span id="calendarManagerApp.event.details.titlle" data-cy="eventViewDialogHeading"
                class="p-1">{{ eventClicked.title }}</span>
          <span class="p-1"><show-status :status="eventClicked.status"></show-status></span>
        </span>
      <div class="modal-body">
        <span>{{ eventClicked.content }}</span>
        <hr/>
        <div v-if="eventClicked.allDay">
          <b><span v-text="$t('calendarManagerApp.event.allDay')">All Day</span></b>
        </div>
        <div v-else>
          <div class="row">
            <div class="col">
              <div>
                <b><span v-text="$t('calendarManagerApp.event.start')">Start</span></b>
              </div>
              <div>
                <span v-text="eventClicked.start"/>
              </div>
            </div>
            <div class="col">
              <div>
                <b><span v-text="$t('calendarManagerApp.event.end')">End</span></b>
              </div>
              <div>
                <span v-text="eventClicked.end"/>
              </div>
            </div>
          </div>
        </div>

        <hr/>

        <div v-if="eventClicked.participants">
          <b><span v-text="$t('calendarManagerApp.event.participants')">Participants</span></b>
          <div>
            <span>{{ eventClicked.participants }}</span>
          </div>
          <hr/>
        </div>


        <task :tasksProp="eventClicked.tasks" :readonly="true"></task>

      </div>
      <div slot="modal-footer">
        <button v-if="eventClicked.id" type="button" class="btn btn-primary"
                v-on:click="showEventDialogEdit()">
          <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
          <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
        </button>
        <b-button
          v-if="eventClicked.id"
          v-on:click="showEventDialogDelete()"
          variant="danger"
          class="btn btn"
          data-cy="entityDeleteButton"
        >
          <font-awesome-icon icon="times"></font-awesome-icon>
          <span class="d-none d-md-inline" v-text="$t('entity.action.delete')">Delete</span>
        </b-button>
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.close')"
                v-on:click="hideEventDialogView()">Close
        </button>
      </div>
    </b-modal>

    <!--   Modal de Criação de Evento   -->

    <b-modal ref="showEventNewDialog" id="eventNewDialog" size="xl">
        <span slot="modal-title" class="d-flex">
          <span id="calendarManagerApp.event.new.titlle" data-cy="eventEditDialogHeading"
                class="p-1"><span v-text="$t('calendarManagerApp.event.home.createOrEditLabel')"/></span>
        </span>
      <div class="modal-body">

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.event.title')"
                 for="event-title">Title</label>
          <input
            type="text"
            class="form-control"
            name="title"
            id="event-new-title"
            data-cy="title"
            :class="{ invalid: $v.eventClicked.title.$invalid }"
            v-model="$v.eventClicked.title.$model"
          />
        </div>

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.event.content')"
                 for="event-content">Content</label>
          <textarea
            type="text"
            class="form-control"
            name="content"
            id="event-new-content"
            data-cy="content"
            :class="{ invalid: $v.eventClicked.content.$invalid }"
            v-model="$v.eventClicked.content.$model"
          />
        </div>

        <hr/>

        <div v-if="!eventClicked.allDay">
          <div class="row">
            <div class="col">
              <div class="form-group">
                <label class="form-control-label" v-text="$t('calendarManagerApp.event.start')"
                       for="event-new-start">Start</label>
                <input type="datetime-local"
                       class="form-control"
                       :class="{
                        invalid: $v.eventClicked.start.$invalid
                     }"
                       v-model="$v.eventClicked.start.$model"/>
              </div>
            </div>
            <div class="col">
              <div class="form-group">
                <label class="form-control-label" v-text="$t('calendarManagerApp.event.end')"
                       for="event-new-end">End</label>
                <input type="datetime-local"
                       class="form-control"
                       :class="{
                        invalid: $v.eventClicked.end.$invalid
                     }"
                       v-model="$v.eventClicked.end.$model"/>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.event.allDay')" for="event-allDay">All
            Day</label>
          <input
            type="checkbox"
            class="form-check"
            name="allDay"
            id="event-new-allDay"
            data-cy="allDay"
            :class="{ invalid: $v.eventClicked.allDay.$invalid }"
            v-model="$v.eventClicked.allDay.$model"
          />
        </div>

        <hr/>

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.event.status')"
                 for="event-status">Status</label>
          <select
            class="form-control"
            name="status"
            :class="{ invalid: $v.eventClicked.status.$invalid }"
            v-model="eventClicked.status"
            id="event-new-status"
            data-cy="status"
          >
            <option
              v-for="status in statusValues"
              :key="status"
              v-bind:value="status"
              v-bind:label="$t('calendarManagerApp.Status.' + status)"
            >
              {{ status }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.event.participants')"
                 for="event-participants"
          >Participants</label
          >
          <input
            type="text"
            class="form-control"
            name="participants"
            id="event-new-participants"
            data-cy="participants"
            v-model="$v.eventClicked.participants.$model"
          />
        </div>

        <hr/>

        <task :tasksProp="eventClicked['tasks']" @update-tasks="$set(eventClicked, 'tasks', $event)"></task>

      </div>
      <div slot="modal-footer">
        <button :disabled="$v.$invalid || tasksInvalid" type="button" class="btn btn-success"
                v-text="$t('entity.action.save')"
                v-on:click="saveEvent()">Save
        </button>
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')"
                v-on:click="hideEventDialogNew()">Cancel
        </button>
      </div>
    </b-modal>

    <!--   Modal de edição de Evento   -->

    <b-modal ref="showEventEditDialog" id="eventEditDialog" size="xl">
        <span slot="modal-title" class="d-flex">
          <span id="calendarManagerApp.event.edit.titlle" data-cy="eventEditDialogHeading"
                class="p-1"><span v-text="$t('calendarManagerApp.event.home.createOrEditLabel')"/>{{ eventClicked.id }}</span>
        </span>
      <div class="modal-body">

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.event.title')"
                 for="event-title">Title</label>
          <input
            type="text"
            class="form-control"
            name="title"
            id="event-title"
            data-cy="title"
            :class="{ invalid: $v.eventClicked.title.$invalid }"
            v-model="$v.eventClicked.title.$model"
          />
        </div>

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.event.content')"
                 for="event-content">Content</label>
          <textarea
            type="text"
            class="form-control"
            name="content"
            id="event-content"
            data-cy="content"
            :class="{ invalid: $v.eventClicked.content.$invalid }"
            v-model="$v.eventClicked.content.$model"
          />
        </div>

        <hr/>

        <div v-if="!eventClicked.allDay">
          <div class="row">
            <div class="col">
              <div class="form-group">
                <label class="form-control-label" v-text="$t('calendarManagerApp.event.start')"
                       for="event-start">Start</label>
                <input type="datetime-local"
                       class="form-control"
                       :class="{
                        invalid: $v.eventClicked.start.$invalid
                     }"
                       v-model="$v.eventClicked.start.$model"/>
              </div>
            </div>
            <div class="col">
              <div class="form-group">
                <label class="form-control-label" v-text="$t('calendarManagerApp.event.end')"
                       for="event-end">End</label>
                <input type="datetime-local"
                       class="form-control"
                       :class="{
                        invalid: $v.eventClicked.end.$invalid
                     }"
                       v-model="$v.eventClicked.end.$model"/>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.event.allDay')" for="event-allDay">All
            Day</label>
          <input
            type="checkbox"
            class="form-check"
            name="allDay"
            id="event-allDay"
            data-cy="allDay"
            :class="{ invalid: $v.eventClicked.allDay.$invalid }"
            v-model="$v.eventClicked.allDay.$model"
          />
        </div>

        <hr/>

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.event.status')"
                 for="event-status">Status</label>
          <select
            class="form-control"
            name="status"
            :class="{ invalid: $v.eventClicked.status.$invalid }"
            v-model="eventClicked.status"
            id="event-status"
            data-cy="status"
          >
            <option
              v-for="status in statusValues"
              :key="status"
              v-bind:value="status"
              v-bind:label="$t('calendarManagerApp.Status.' + status)"
            >
              {{ status }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.event.participants')"
                 for="event-participants"
          >Participants</label
          >
          <input
            type="text"
            class="form-control"
            name="participants"
            id="event-participants"
            data-cy="participants"
            v-model="$v.eventClicked.participants.$model"
          />
        </div>

        <hr/>

        <task :tasksProp="eventClicked['tasks']" @update-tasks="$set(eventClicked, 'tasks', $event)"></task>

      </div>
      <div slot="modal-footer">
        <button :disabled="$v.$invalid || tasksInvalid" type="button" class="btn btn-success"
                v-text="$t('entity.action.save')"
                v-on:click="saveEvent()">Save
        </button>
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')"
                v-on:click="hideEventDialogEdit()">Cancel
        </button>
      </div>
    </b-modal>

    <!--   Modal de Deleção de Evento   -->
    <b-modal ref="showEventDeleteDialog" id="removeEntity">
      <span slot="modal-title"
      ><span id="calendarManagerApp.event.delete.question" data-cy="eventDeleteDialogHeading"
             v-text="$t('entity.delete.title')"
      >Confirm delete operation</span
      ></span
      >
      <div class="modal-body">
        <p id="jhi-delete-event-heading"
           v-text="$t('calendarManagerApp.event.delete.question', { id: eventClicked.id })">
          Are you sure you want to delete this Event?
        </p>
      </div>
      <div slot="modal-footer">
        <button
          type="button"
          class="btn btn-danger"
          id="jhi-confirm-delete-event"
          data-cy="entityConfirmDeleteButton"
          v-text="$t('entity.action.delete')"
          v-on:click="removeEvent()"
        >
          Delete
        </button>
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')"
                v-on:click="hideEventDialogDelete()">Cancel
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts" src="./event.component.ts"></script>
