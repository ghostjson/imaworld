<template>
  <div id="app">
    <app-header></app-header>
    <router-view/>
    <footer>
      All rights are reserved &copy imaworld
    </footer>
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
      authenticate(){
      }
    },
    components: {
      'app-header': Header
    },

    mounted(){
      
    },
    watch:{
      
    } 
	};
</script>


<style>
/*@import url('https://fonts.googleapis.com/css?family=McLaren&display=swap');*/



*{
  margin: 0px;
  padding: 0px;
  font-family: Arial, sans-serif;
}

#video-player{
    width: 710px;
}



iframe{
    pointer-events: none;
}
input:focus{
  outline: none;
}
body{
  margin: 0 50px;
}

a, a:visited, a:active, a:hover{
    text-decoration: none;
    color: black;
}

footer{
  background: #303030;
  margin-top: 50px;
  padding: 5px;
  text-align: center;
  color: #fff;
  height: 40px;
  font-size: 1.2em;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  line-height: 40px;
}
/*@media only screen and (max-width: 1000px){
  #search-section{
    
  }
  #video-player{
    width: 100%;
  }

  body{
    margin: 0 0;
  }

  section .v{
    margin-right: 0px;
    border-radius: 10px;
    background: #303030;
    width: 100%;
  }
  section .s{
    width: 33vw;
  } 
  
}*/
</style>
