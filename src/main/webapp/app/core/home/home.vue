<template>
  <div class="home">
    <div class="container text-center" v-if="!authenticated">
      <div class="alert alert-warning">
        <strong>
          <h2><span v-text="$t('global.messages.info.authenticated.welcome')">Welcome </span></h2>
          <h4><a v-on:click="openLogin()" v-text="$t('global.messages.info.authenticated.link')">sign in</a
          ></h4>
        </strong>
      </div>
      <div class="alert alert-warning">
        <strong>
          <h5><span v-text="$t('global.messages.info.register.noaccount')">You don't have an account yet?</span>&nbsp;
          <router-link to="/register" v-text="$t('global.messages.info.register.link')"
          >
            <span v-text="'Register a new account'"/>
          </router-link
          ></h5>
        </strong>
      </div>
    </div>
    <div v-if="authenticated">
      <event></event>
    </div>
  </div>
</template>

<script lang="ts" src="./home.component.ts"></script>
