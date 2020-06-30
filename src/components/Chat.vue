<template>
  <v-layout>
    <v-flex xs12 sm4 lg2 class="user" v-if="viewList">
      <v-card>
        <v-toolbar color="primary" card dark dense>
          <v-toolbar-title>Contactos</v-toolbar-title>
        </v-toolbar>
        <v-list>
          <template>
            <v-list-tile
              v-for="user in users"
              :value="userSelected && userSelected.uid === user.uid"
              @click="selectedUser(user)"
              :key="user.uid"
              active-class="user-select"
            >
              <v-list-tile-avatar size="40">
                <v-img class="image" :src="user.foto"></v-img>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title v-html="user.nombre" class="font"></v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action></v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
    </v-flex>
    <v-flex xs12 sm8 lg5 v-if="viewChat">
      <v-container fill-height>
        <v-layout align-end>
          <v-flex>
            <v-card color="#f7faff">
              <v-toolbar color="primary" card dense dark>
                <v-toolbar-title>
                  <v-icon class="mr-2" @click="returnList">mdi-arrow-left</v-icon>
                  <v-avatar size="32">
                    <v-img :src="userSelected.foto"></v-img>
                  </v-avatar>
                  <span class="ml-3 font">{{userSelected.nombre}}</span>
                </v-toolbar-title>
              </v-toolbar>
              <v-container>
                <v-flex
                  xs7
                  :offset-xs5="item.uid == user.uid"
                  class="my-3"
                  v-for="item in chat"
                  :key="item.id"
                >
                  <v-layout column>
                    <div class="chat-date">{{convertDate(item.date)}}</div>
                    <v-card
                      :color="item.uid != user.uid ? 'white' : '#c3d9ff'"
                      elevation="1"
                      class="chat-message"
                    >
                      <v-card-text>{{item.message}}</v-card-text>
                    </v-card>
                  </v-layout>
                </v-flex>
              </v-container>
              <v-card-text>
                <v-text-field
                  v-model="message"
                  @keyup.enter="send"
                  :loading="sendMessage"
                  :dissable="sendMessage"
                  label="escribe un mensaje"
                  solo
                  hide-details
                ></v-text-field>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import { db } from "@/firebase";
import uuidv4 from 'uuid/v4'
export default {
  props: ["user"],
  data() {
    return {
      users: [],
      userSelected: null,
      chat: [],
      message: "",
      sendMessage: false,
      cid: null
    };
  },

  created() {
    this.consultUsers();
  },

  computed: {
    isPhone() {
      return this.$vuetify.breakpoint.width < 600;
    },
    viewList() {
      return this.users && (!this.isPhone || !this.userSelected);
    },
    viewChat() {
      return this.users && this.userSelected;
    }
  },

  methods: {
    convertDate(timeStamp) {
      return timeStamp
        .toDate()
        .toISOString()
        .subString(0, 16)
        .replace("t", "");
    },

    returnList() {
      this.userSelected = null;
    },
    sendNotification(message, color) {
      this.$emit("onNotification", { message, color });
    },
    async selectedUser(user) {
      this.cid = this.generateChatId(this.user.uid, user.uid);
      try {
        let doc = await db
          .collection("contactos")
          .doc(this.cid)
          .get();
        if (!doc.exists) {
          await db
            .collection("contactos")
            .doc(this.cid)
            .set({ cid: this.cid });
        }
        this.userSelected = user;
      } catch (err) {
        this.sendNotification(
          "ocurrio un error recuperando la informacion",
          "error"
        );
      }
    },
    consultChat() {
      this.chat = [];
      db.collection("contactos")
        .doc(this.cid)
        .collection("chat")
        .onSnapshot(
          snapshot => {
            snapshot.docChanges().forEach(change => {
              if (change.type == "added") {
                let message = change.doc.data();
                this.chat.push(message);
              }
            });
          },
          () => {
            this.sendNotification(
              "ocurrio un error recuperando los mensajes",
              "error"
            );
          }
        );
    },
    generateChatId(uid1, uid2) {
      return uid1 < uid2 ? `${uid1}` - `${uid2}` : `${uid2}` - `${uid1}`;
    },
    async consultUsers() {
      try {
        let docs = await db.collection("usuarios").get();
        docs.forEach(doc => {
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
    async send() {
      if (!this.message || this.sendMessage) {
        return;
      }
      this.sendMessage = true;

      let mid = uuidv4

      let messageReady = {
        mid,
        text: this.message,
        date: new Date(),
        uid: this.user.uid
      };

      try {
        await db.collection('contactos').doc(this.cid).collection('chat').doc(mid).set(messageReady)
        this.message = ''

      } catch (err) {
        this.sendNotification('ocurrio un error enviando el mensaje. Intentalo nuevamente', 'error')
      }finally{
        this.sendMessage = false
      }
    }
  }
};
</script>

<style>
.image {
  width: 10%;
}
.user {
  background-color: #dfdfdf;
}
.user-select {
  background-color: #bad2ff;
}
.chat-message {
  border-radius: 10px;
}
.chat-date {
  font-size: 0.8rem;
  margin: 3px;
  color: "#929292";
}
</style>
