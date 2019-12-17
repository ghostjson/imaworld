
<template>
	<div class="login">
		<div class="form-box">
			
			<div class="title">Sign In</div>
			<div>
				<form @submit.prevent class="login-form">	
					<input type="text" name="username" v-model="username" placeholder="Username"><br>
					<input type="text" v-model="email" placeholder="Email"><br>
					<input type="password" v-model="password" placeholder="Password"><br>
					<input type="password" v-model="confirm_password" placeholder="Confirm Password"><br>
					<input type="password" v-model="search_password" placeholder="Search Password"><br>
					<input type="password" v-model="confirm_search_password" placeholder="Confirm Search Password"><br>
					<button v-on:click="login">Submit</button>

				</form>
					<p class="message">{{ message }}</p>
			</div>
		</div>
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
			confirm_password: '',
			email:'',
			message: '',
			search_password: '',
			confirm_search_password: ''
		}

	},
	methods: {
		login(){

			if(this.username != '' && this.password != '' && this.search_password != ''){
				let self = this


				if(this.password == this.confirm_password && this.search_password == this.confirm_search_password){

					try{

						console.log({
							'username':this.username,
							'password':this.password,
							'email': this.email
						});

						axios({
					
						method: 'post',
						url: `https://imaworld-backend.herokuapp.com/register/`,
						data: {
							'username':this.username,
							'password':this.password,
							'email': this.email,
							'search_password' : this.search_password
						},
						})
						.then(function (response){
							localStorage.setItem("Token",response.data)
							self.$root.$emit('login', true)
							window.location.href = '/'
						})

						.catch(function(err){
							console.log(err)
							self.message = "Username is already exist"
						});
					}catch(err){
						console.log(err)
						self.message = "Server Error"
					}

				}else{
					this.message = "Password is not matching"
				}

				
				
			}else{
				this.message = "All inputs are mantatory"
			}


		}
	}



};

</script>

<style scoped>
	.login{
		height: 80vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.form-box{
		width: 400px;
		display: block;
		text-align: center;
		background: #f7f7f7;
		margin-top: 20px;
		border-top-left-radius: 15px;
		border-top-right-radius: 15px;
		padding-bottom: 30px;
	}
	.title{
		background: #63b923;
		padding-top: 20px;
		padding-bottom: 20px;
		font-size: 1.5em;
		font-family: Impact, sans-serif;
		border-top-left-radius: 15px;
		border-top-right-radius: 15px;
		color: #FFF;
	}
	form{
		margin-top: 20px;
		margin-bottom: 20px;
	}
	form input{
		width: 150px;
		margin-top: 10px;
		padding: 8px 30px;
		border-radius: 15px;
		border:  none;
		background: #ebebeb;
	}

	form button{
		margin-top: 25px;
		padding: 8px 30px;
		border-radius: 15px;
		border: none;
		width: 200px;
		background: #63b923;
		color: #FFF;
		cursor: pointer;
	}

	.message{
		color: #d50000;
		font-family: Impact, sans-serif;
	}
</style>