<template>
  <div class="card">
    <div class="card-header">
      <b><span v-text="$t('calendarManagerApp.task.home.title')" id="task-heading">Tasks</span></b>
      <div v-if="!readonly" class="d-flex justify-content-end">
        <button @click="showTaskDialogNew()" id="jh-create-entity" data-cy="entityCreateButton"
                class="btn btn-primary jh-create-entity create-task">
          <font-awesome-icon icon="plus"></font-awesome-icon>
          <span v-text="$t('calendarManagerApp.task.home.createLabel')"> Create a new Task </span>
        </button>
      </div>
    </div>
    <div class="card-body">
      <div class="alert alert-danger text-dark" v-if="tasks == null || (tasks && !tasks.length)">
        <span v-text="$t('calendarManagerApp.task.home.notFound')">No tasks found</span>
      </div>
      <div class="table-responsive" v-if="tasks && tasks.length > 0">
        <table class="table table-striped" aria-describedby="tasks">
          <thead>
          <tr>
            <th scope="row"><span v-text="$t('calendarManagerApp.task.title')">Title</span></th>
            <th scope="row"><span v-text="$t('calendarManagerApp.task.status')">Status</span></th>
            <th scope="row"><span v-text="$t('calendarManagerApp.task.type')">Type</span></th>
            <th scope="row"><span v-text="$t('calendarManagerApp.task.priority')">Priority</span></th>
            <th scope="row"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(task, index) in getTasksOdered" :key="index" data-cy="entityTable">
            <td>{{ task.title }}</td>
            <td>
              <show-status :status="task.status"></show-status>
            </td>
            <td>
              <show-type-task :type="task.type"></show-type-task>
            </td>
            <td>
              <show-priority-task :priority="task.priority"></show-priority-task>
            </td>
            <td class="text-right">
              <div class="btn-group">
                <b-button
                  v-on:click="showTaskDialogView(task, index)"
                  class="btn btn-info btn-sm details"
                  data-cy="entityDetailsButton"
                >
                  <font-awesome-icon icon="eye"></font-awesome-icon>
                  <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                </b-button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!--   Modal de visualização de Tarefa   -->

    <b-modal ref="showTaskViewDialog" id="taskViewDialog">
        <span slot="modal-title" class="d-flex">
          <span id="calendarManagerApp.task.details.titlle" data-cy="taskViewDialogHeading"
                class="p-1">{{ taskSelected.title }}</span>
          <span class="p-1"><show-status :status="taskSelected.status"></show-status></span>
          <span class="p-1"><show-type-task :type="taskSelected.type"></show-type-task></span>
          <span class="p-1"><show-priority-task :priority="taskSelected.priority"></show-priority-task></span>
        </span>
      <div class="modal-body">
        <span>{{ taskSelected.description }}</span>

        <div v-if="taskSelected.type == 'MEETING'">
          <hr/>
          <b><span v-text="$t('calendarManagerApp.task.link')">Link</span></b>
          <div>
            <a :href="taskSelected.link">{{ taskSelected.link }}</a>
          </div>
        </div>

        <div v-if="taskSelected.notes">
          <hr/>
          <b><span v-text="$t('calendarManagerApp.task.notes')">Notes</span></b>
          <div>
            <span>{{ taskSelected.notes }}</span>
          </div>
        </div>

        <div v-if="taskSelected.attachment">
          <hr/>
          <b><label v-text="$t('calendarManagerApp.task.attachment')">attachment</label></b>
          <div class="form-group input-group-sm d-flex mb-2">
            <input type="text" class="form-control" :value="taskSelected.attachment.name" disabled/>
            <button class="btn btn-primary btn-sm pull-right" @click="downloadAttachment()">
              <font-awesome-icon icon="download"></font-awesome-icon>
            </button>
          </div>
        </div>

      </div>
      <div slot="modal-footer">
        <b-button
          v-on:click="showTaskDialogEdit()"
          class="btn btn-sm"
          variant="primary"
          data-cy="entityEditButton"
          v-if="!readonly"
        >
          <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
          <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
        </b-button>
        <b-button
          v-on:click="showTaskDialogDelete()"
          variant="danger"
          class="btn btn-sm"
          data-cy="entityDeleteButton"
          v-if="!readonly"
        >
          <font-awesome-icon icon="times"></font-awesome-icon>
          <span class="d-none d-md-inline" v-text="$t('entity.action.delete')">Delete</span>
        </b-button>
        <button type="button" class="btn btn-sm btn-secondary" v-text="$t('entity.action.close')"
                v-on:click="hideTaskDialogView()">Close
        </button>
      </div>
    </b-modal>

    <!--   Modal de criação de Tarefa   -->

    <b-modal ref="showTaskCreateDialog" id="taskCreateDialog">
        <span slot="modal-title" class="d-flex">
          <span id="calendarManagerApp.task.create.titlle" data-cy="taskCreateDialogHeading"
                class="p-1"><span v-text="$t('calendarManagerApp.task.home.createOrEditLabel')"/></span>
        </span>
      <div class="modal-body">

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.task.title')"
                 for="task-title">Title</label>
          <input
            type="text"
            class="form-control"
            name="title"
            id="task-title"
            data-cy="title"
            :class="{ invalid: $v.taskSelected.title.$invalid }"
            v-model="taskSelected.title"
          />
        </div>

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.task.description')"
                 for="task-content">Content</label>
          <textarea
            type="text"
            class="form-control"
            name="content"
            id="task-content"
            data-cy="content"
            :class="{ invalid: $v.taskSelected.description.$invalid }"
            v-model="taskSelected.description"
          />
        </div>

        <hr/>

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.task.type')"
                 for="task-type">Type</label>
          <select
            class="form-control"
            name="type"
            :class="{ invalid: $v.taskSelected.type.$invalid }"
            v-model="taskSelected.type"
            id="task-type"
            data-cy="type"
          >
            <option
              v-for="typeTask in typeTaskValues"
              :key="typeTask"
              v-bind:value="typeTask"
              v-bind:label="$t('calendarManagerApp.TypeTask.' + typeTask)"
            >
              {{ typeTask }}
            </option>
          </select>
        </div>

        <div class="form-group" v-if="taskSelected.type == 'MEETING'">
          <label class="form-control-label" v-text="$t('calendarManagerApp.task.link')"
                 for="task-link">Link</label>
          <input
            type="text"
            class="form-control"
            name="title"
            id="task-link"
            data-cy="link"
            :class="{ invalid: $v.taskSelected.link.$invalid }"
            v-model="taskSelected.link"
          />
        </div>

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.task.priority')"
                 for="task-priority">Priority</label>
          <select
            class="form-control"
            name="priority"
            :class="{ invalid: $v.taskSelected.priority.$invalid }"
            v-model="taskSelected.priority"
            id="task-priority"
            data-cy="priority"
          >
            <option
              v-for="priorityTask in priorityTaskValues"
              :key="priorityTask"
              v-bind:value="priorityTask"
              v-bind:label="$t('calendarManagerApp.PriorityTask.' + priorityTask)"
            >
              {{ priorityTask }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.task.status')"
                 for="task-status">Status</label>
          <select
            class="form-control"
            name="status"
            :class="{ invalid: $v.taskSelected.status.$invalid }"
            v-model="taskSelected.status"
            id="task-status"
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

        <hr/>

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.task.notes')"
                 for="task-notes">Notes</label>
          <textarea
            type="text"
            class="form-control"
            name="notes"
            id="task-notes"
            data-cy="notes"
            v-model="taskSelected.notes"
          />
        </div>

        <div>
          <label class="form-control-label mt-3" v-text="$t('calendarManagerApp.task.attachment')">attachment</label>
          <div class="form-group input-group-sm d-flex mb-2" v-if="taskSelected.attachment">
            <input type="text" class="form-control" :value="taskSelected.attachment.name" disabled/>
            <button type="button" v-on:click="removeAttachment()" class="btn btn-danger btn-sm pull-right">
              <font-awesome-icon icon="times"></font-awesome-icon>
            </button>
          </div>
          <div v-else>
            <label for="file_bytes" v-text="$t('entity.action.uploadAttachment')" class="btn btn-primary btn-sm">Select
              Image</label>
            <input type="file" style="visibility: hidden" id="file_bytes" @change="setAttachment($event)"/>
          </div>
        </div>

      </div>
      <div slot="modal-footer">
        <button :disabled="$v.taskSelected.$invalid" type="button" class="btn btn-success"
                v-text="$t('entity.action.save')"
                v-on:click="saveTask()">Save
        </button>
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')"
                v-on:click="hideTaskDialogNew()">Cancel
        </button>
      </div>
    </b-modal>

    <!--   Modal de edição de Tarefa   -->

    <b-modal ref="showTaskEditDialog" id="taskEditDialog">
        <span slot="modal-title" class="d-flex">
          <span id="calendarManagerApp.task.edit.titlle" data-cy="taskEditDialogHeading"
                class="p-1"><span v-text="$t('calendarManagerApp.task.home.createOrEditLabel')"/>{{
              taskSelected.id
            }}</span>
        </span>
      <div class="modal-body">

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.task.title')"
                 for="task-title">Title</label>
          <input
            type="text"
            class="form-control"
            name="title"
            id="task-title"
            data-cy="title"
            v-model="taskSelected.title"
            :class="{ invalid: $v.taskSelected.title.$invalid }"
          />
        </div>

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.task.description')"
                 for="task-description">Description</label>
          <textarea
            type="text"
            class="form-control"
            name="description"
            id="task-description"
            data-cy="description"
            v-model="taskSelected.description"
            :class="{ invalid: $v.taskSelected.description.$invalid }"
          />
        </div>

        <hr/>

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.task.type')"
                 for="task-type">Type</label>
          <select
            class="form-control"
            name="type"
            :class="{ invalid: $v.taskSelected.type.$invalid }"
            v-model="taskSelected.type"
            id="task-type"
            data-cy="type"
          >
            <option
              v-for="typeTask in typeTaskValues"
              :key="typeTask"
              v-bind:value="typeTask"
              v-bind:label="$t('calendarManagerApp.TypeTask.' + typeTask)"
            >
              {{ typeTask }}
            </option>
          </select>
        </div>

        <div class="form-group" v-if="taskSelected.type == 'MEETING'">
          <label class="form-control-label" v-text="$t('calendarManagerApp.task.link')"
                 for="task-link">Link</label>
          <input
            type="text"
            class="form-control"
            name="title"
            id="task-link"
            data-cy="link"
            :class="{ invalid: $v.taskSelected.link.$invalid }"
            v-model="taskSelected.link"
          />
        </div>

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.task.priority')"
                 for="task-priority">Priority</label>
          <select
            class="form-control"
            name="priority"
            :class="{ invalid: $v.taskSelected.priority.$invalid }"
            v-model="taskSelected.priority"
            id="task-priority"
            data-cy="priority"
          >
            <option
              v-for="priorityTask in priorityTaskValues"
              :key="priorityTask"
              v-bind:value="priorityTask"
              v-bind:label="$t('calendarManagerApp.PriorityTask.' + priorityTask)"
            >
              {{ priorityTask }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.task.status')"
                 for="task-status">Status</label>
          <select
            class="form-control"
            name="status"
            :class="{ invalid: $v.taskSelected.status.$invalid }"
            v-model="taskSelected.status"
            id="task-status"
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

        <hr/>

        <div class="form-group">
          <label class="form-control-label" v-text="$t('calendarManagerApp.task.notes')"
                 for="task-notes">Notes</label>
          <textarea
            type="text"
            class="form-control"
            name="notes"
            id="task-notes"
            data-cy="notes"
            v-model="taskSelected.notes"
          />
        </div>

        <div>
          <label class="form-control-label mt-3" v-text="$t('calendarManagerApp.task.attachment')">attachment</label>
          <div class="form-group input-group-sm d-flex mb-2" v-if="taskSelected.attachment">
            <input type="text" class="form-control" :value="taskSelected.attachment.name" disabled/>
            <button type="button" v-on:click="removeAttachment()" class="btn btn-danger btn-sm pull-right">
              <font-awesome-icon icon="times"></font-awesome-icon>
            </button>
          </div>
          <div v-else>
            <label for="file_bytes" v-text="$t('entity.action.uploadAttachment')" class="btn btn-primary btn-sm">Select
              Image</label>
            <input type="file" style="visibility: hidden" id="file_bytes" @change="setAttachment($event)"/>
          </div>
        </div>

      </div>
      <div slot="modal-footer">
        <button :disabled="$v.taskSelected.$invalid" type="button" class="btn btn-success"
                v-text="$t('entity.action.save')"
                v-on:click="saveTask()">Save
        </button>
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')"
                v-on:click="hideTaskDialogEdit()">Cancel
        </button>
      </div>
    </b-modal>

    <!--   Modal de deleção de Tarefa   -->

    <b-modal ref="showTaskDeleteDialog" id="removeEntity">
      <span slot="modal-title"
      ><span id="calendarManagerApp.task.delete.question" data-cy="taskDeleteDialogHeading"
             v-text="$t('entity.delete.title')"
      >Confirm delete operation</span
      ></span
      >
      <div class="modal-body">
        <p id="jhi-delete-task-heading" v-text="$t('calendarManagerApp.task.delete.question', { id: taskSelected.id })">
          Are you sure you want to delete this Task?
        </p>
      </div>
      <div slot="modal-footer">
        <button
          type="button"
          class="btn btn-danger"
          id="jhi-confirm-delete-task"
          data-cy="entityConfirmDeleteButton"
          v-text="$t('entity.action.delete')"
          v-on:click="removeTask()"
        >
          Delete
        </button>
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')"
                v-on:click="hideTaskDialogDelete()">
          Cancel
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts" src="./task.component.ts"></script>
