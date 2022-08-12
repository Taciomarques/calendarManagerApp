<template>
  <div class="home text-black">
    <div class="alert alert-warning text-dark" v-if="!authenticated">
      <strong>
        <span v-text="$t('global.messages.info.authenticated.prefix')">If you want to </span>
        <a v-on:click="openLogin()" v-text="$t('global.messages.info.authenticated.link')">sign in</a
        ><span v-html="$t('global.messages.info.authenticated.suffix')"
      >, you can try the default accounts:<br/>- Administrator (login="admin" and password="admin") <br/>- User (login="user" and
          password="user").</span
      >
      </strong>
    </div>
    <div class="alert alert-warning text-dark" v-if="!authenticated">
      <strong>
        <span v-text="$t('global.messages.info.register.noaccount')">You don't have an account yet?</span>&nbsp;
        <router-link to="/register" v-text="$t('global.messages.info.register.link')"
        >
          <span v-text="'Register a new account'"/>
        </router-link
        >
      </strong>
    </div>
    <div v-if="authenticated">
      <event></event>
    </div>
  </div>
</template>

<script lang="ts" src="./home.component.ts"></script>
