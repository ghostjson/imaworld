<template>
  <div id="app">
    <app-header></app-header>
    <router-view/>
  </div>
</template>

<script>

  import Header from './components/Header'

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
    },
    components: {
      'app-header': Header
    }
	};
</script>


<style>
*{
  margin: 0px;
  padding: 0px;
}
body{
  margin: 0 50px;
}

a, a:visited, a:active, a:hover{
    text-decoration: none;
    color: black;
}
</style>
