<template>
  <div id="app">
    <div id="app-header">
      <jhi-navbar></jhi-navbar>
    </div>
    <div id="content">
      <div class="container-fluid">
        <div class="card jh-card" id="card">
          <router-view></router-view>
        </div>
        <b-modal id="login-page" hide-footer lazy>
          <span data-cy="loginTitle" slot="modal-title" id="login-title" v-text="$t('login.title')">Sign in</span>
          <login-form></login-form>
        </b-modal>
        <jhi-footer></jhi-footer>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./app.component.ts"></script>

<style scoped>

#content {
  transition: 0.3s ease;
  margin-top: 80px;
}

#app-header {
  position: fixed;
  z-index: 10;
  width: 100%;
  top: 0;
}
</style>
