<template>
  <div>
    <span
      :class="{
        'badge rounded-pill bg-dark': priority == 'URGENT',
        'badge rounded-pill bg-danger':
          priority == 'HIGH',
          'badge rounded-pill bg-warning':
          priority == 'MEDIUM',
        'badge rounded-pill bg-primary':
          priority == 'LOW',
      }"
      v-text="$t('calendarManagerApp.PriorityTask.' + priority)"
    ></span>
  </div>
</template>

<script lang="ts" src="./show-priority-task.component.ts"></script>

<style scoped>
.badge {
  color: white;
  padding: 0.35em 0.65em;
  font-weight: bold;
  font-size: 90%;
}
</style>
