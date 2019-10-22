<template>
	<div class="login">
		<input type="text" name="username" v-model="username"><br>
		<input type="password" v-model="password"><br>
		<button v-on:click="login">Submit</button>
	</div>
</template>

<script>
import axios from 'axios'; 

export default {


	name: 'login',

	data(){

		return {
			username: '',
			password: '',


		}

	},
	methods: {
		login(){


			axios({
			  method: 'post',
			  url: 'http://127.0.0.1:8000/login/',
			  data: {
			  	'username':this.username,
			  	'password':this.password,
			  },
			})
			.then(function (response){
				localStorage.setItem("Token",response.data)
				console.log(localStorage.Token)
			})

			.catch(function(err){
				console.log("Failed to login")
			});
		}
	}



};

</script>

<style scoped>
	
</style>