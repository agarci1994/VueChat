<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8 ml6 lg6 xl4>
      <v-card>
        <v-toolbar color="primary" dark card>
          <v-toolbar class="title">Ingresa tu email y contraseña</v-toolbar>
        </v-toolbar>
        <v-card-text>
          <v-text-field autofocus v-model="email" label="email"></v-text-field>
          <v-text-field @keyup.enter='login' v-model="password" label="password" type="password"></v-text-field>
        </v-card-text>
        <v-card-text>
          <v-layout justify-end>
            <v-btn @click="login" color="secondary">Ingresar</v-btn>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { auth, db } from "@/firebase";

export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    async login() {
      if (!this.email) {
        this.sendNotification("Debes indicar un email", "warning");
        return;
      }
      if (!this.password) {
        this.sendNotification("Debes indicar un password", "warning");
        return;
      }

      try {
        await auth.signInWithEmailAndPassword(this.email, this.password);
        if (auth.currentUser) {
          let uid = auth.currentUser.uid;
          let doc = await db
            .collection("usuarios")
            .doc(uid)
            .get();

          if (doc.exists) {
            let user = doc.data();
            this.$emit("onLogin", user);
          } else {
            this.sendNotification("No se encontro este usuario", "error");
          }
        }
      } catch (err) {
        switch (err.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
            this.sendNotification(
              "Usuario no valido. Revisa tu correo y contraseña",
              "warming"
            );
            break;
          default:
            this.sendNotification("Ocurrio un error en la validación", "error");
        }
      }
    },
    sendNotification(message, color) {
      this.$emit("onNotification", { message, color });
    }
  }
};
</script>

<style>
</style>