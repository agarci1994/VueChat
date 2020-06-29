<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-toolbar-title class="font">Chat Friends</v-toolbar-title>
      </div>
      <v-spacer></v-spacer>
      <v-layout v-if="user" align-center justify-end>
        <v-avatar>
          <v-img :src="user.foto"></v-img>
        </v-avatar>
        <span class="ml-4 font">{{user.nombre}}</span>
        <v-btn class='font ml-4' text small @click='user=null'>Salir</v-btn>
      </v-layout>
    </v-app-bar>

    <v-main>
      <v-container fluid fill-height>
        <Login v-if="!user" @onLogin="login" @onNotification='viewNotification' />
        <Chat v-else @onNotification='viewNotification' :user='user' />
      </v-container>
      <v-container></v-container>
    </v-main>

    <v-snackbar
      v-model="notification.hidden"
      :color="notification.color"
      multi-line
      top
      :timeout="6000"
      dark
    >
      <span>{{notification.message}}</span>
      <v-btn class='ml-10' color="white" text @click="notification.hidden = false">Cerrar</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import Login from "./components/Login";
import Chat from "./components/Chat";

export default {
  name: "App",

  components: {
    Login,
    Chat
  },

  data: () => {
    return {
      user: null,
      notification: {
        message: "",
        color: "info",
        hidden: false
      }
    };
  },
  methods: {
    login(user) {
      this.user = user;
    },
    viewNotification(notification){
      this.notification.message = notification.message
      this.notification.color = notification.color
      this.notification.hidden = true
    }
  }
};
</script>

<style>
.font {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  text-transform: uppercase;
}
</style>