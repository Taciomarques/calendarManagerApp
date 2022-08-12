<template>
  <div>
    <span
      :class="{
        'badge rounded-pill bg-danger': type == 'JOB',
        'badge rounded-pill bg-primary':
          type == 'ACTIVITY',
        'badge rounded-pill bg-warning':
          type == 'MEETING',
      }"
      v-text="$t('calendarManagerApp.TypeTask.' + type)"
    ></span>
  </div>
</template>

<script lang="ts" src="./show-type-task.component.ts"></script>

<style scoped>
.badge {
  color: white;
  padding: 0.35em 0.65em;
  font-weight: bold;
  font-size: 90%;
}
</style>
