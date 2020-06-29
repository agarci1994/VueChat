<template>
  <v-layout>
    <v-flex xs12 sm4 lg2 class="user">
      <v-card>
        <v-toolbar color="primary" card dark dense>
          <v-toolbar-title>Contactos</v-toolbar-title>
        </v-toolbar>
        <v-list>
          <template v-for="user in users">
            <v-list-tile :value="userSelected && userSelected.uid === user.uid" @click='selectedUser(user)' :key="user.uid" active-class='user-select'>
              <v-list-tile-avatar size="40">
                <v-img class="image" :src="user.foto"></v-img>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title
                  v-html="user.nombre"
                  class="font"
                ></v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action></v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
    </v-flex>
    <v-flex xs12 sm8 lg5>
      <v-container fill-height style="background-color: gray;">
          <span v-if='user'>{{this.userSelected}}</span>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import { db } from "@/firebase";

export default {
  props: ["user"],
  data() {
    return {
      users: [],
      userSelected: null,
    };
  },

  created() {
    this.consultUsers();
  },

  methods: {
    sendNotification(message, color) {
      this.$emit("onNotification", { message, color });
    },
    selectedUser(user) {
      this.userSelected = user;
    },
    async consultUsers() {
      try {
        let docs = await db.collection("usuarios").get();
        docs.forEach((doc) => {
          let user = doc.data();
          if (user.uid !== this.user.uid) this.users.push(user);
        });
      } catch (err) {
        this.sendNotification(
          "Ocurrio un error consultando tu lista de contactos",
          "error"
        );
      }
    },
  },
};
</script>

<style>
.image {
  width: 10%;
}
.user {
  background-color: #dfdfdf
}
.user-select {
  background-color: #bad2ff;
}
</style>
