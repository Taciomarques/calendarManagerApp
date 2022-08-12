<template>
  <div>
    <span
      :class="{
        'badge rounded-pill bg-success': status == 'TODO',
        'badge rounded-pill bg-primary':
          status == 'DONE',
        'badge rounded-pill bg-warning':
          status == 'DOING',
      }"
      v-text="$t('calendarManagerApp.Status.' + status)"
    ></span>
  </div>
</template>

<script lang="ts" src="./show-status.component.ts"></script>

<style scoped>
.badge {
  color: white;
  padding: 0.35em 0.65em;
  font-weight: bold;
  font-size: 90%;
}
</style>
