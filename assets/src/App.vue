<template>
  <div v-if="$route.name === 'notfound'">
    <router-view></router-view>
  </div>
  <v-layout v-else>
    <notifications group="admins" position="top center" />
    <router-view></router-view>
  </v-layout>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
