<template>
	
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/login">Login</router-link>
      <a v-on:click="logout">Logout</a>
    </div>
    <router-view/>
  </div>
</template>

<script>
	export default {
		name: 'app',

    data(){
      return {

      }

    },
    methods:{
      logout(){
        localStorage.removeItem('Token')
      }
    }
	};
</script>


<style>
*{
  margin: 0px;
  padding: 0px;
}
</style>
