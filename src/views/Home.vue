<template>
	<div class="home">
		<h2>Home</h2>
		<div>
			<input type="text" name="search" v-model="search">
			<button v-on:click="getData">Search</button>
		</div>

		<div class="container">
			<div class="results">
				<h1>Results</h1>
				<div v-for="(item, i) in results.data" :key="i">
					<h2>{{item.snippet.title}}</h2>
					<img :src="item.snippet.thumbnails.medium.url">
					<p>{{item.snippet.description}}</p>
					<button v-on:click="addToPlaylist(i)">Add</button>
				</div>
			</div>

			<div class="playlist">
				<h1>Playlist</h1>
				<div v-for="(item,i) in playlist" :key="i">
					<h2>{{item.title}}</h2>
					<img :src="item.thumbnail">
					<p>{{item.description}}</p>
					<button v-on:click="removeFromPlaylist(i)">Remove</button>
				</div><br><br><br>
				<button v-on:click="save">Save</button>
			</div>
		</div>

			<h1>Featured</h1>
		<div class="featured">
			<div v-for="{item, i} in featured" width="200px" :key="i">
				<h2>{{item.title}}</h2>
				<img :src="item.thumbnail" width="200px">
				<p>{{item.description}}</p>
			</div>
		</div>

	</div>



</template>


<script>

import axios from 'axios';


export default 
{	
	name: 'home',

	data(){
		return {
			search : '',
			results: '',
			playlist: [],
			featured: [
				{
					id: 'Z3Te1OlHGBs',
					description: 'School Principal talks about association with Smile Foundation',
					title: 'School Principal talks about association with Smile Foundation',
					thumbnail: 'https://i.ytimg.com/vi/Z3Te1OlHGBs/mqdefault.jpg',
				},
				{
					id: 'Z3Te1OlHGBs',
					description: 'School Principal talks about association with Smile Foundation',
					title: 'School Principal talks about association with Smile Foundation',
					thumbnail: 'https://i.ytimg.com/vi/Z3Te1OlHGBs/mqdefault.jpg',
				},
				{
					id: 'Z3Te1OlHGBs',
					description: 'School Principal talks about association with Smile Foundation',
					title: 'School Principal talks about association with Smile Foundation',
					thumbnail: 'https://i.ytimg.com/vi/Z3Te1OlHGBs/mqdefault.jpg',
				}
				,
				{
					id: 'Z3Te1OlHGBs',
					description: 'School Principal talks about association with Smile Foundation',
					title: 'School Principal talks about association with Smile Foundation',
					thumbnail: 'https://i.ytimg.com/vi/Z3Te1OlHGBs/mqdefault.jpg',
				}
			]
		}
	},
	methods: {
		getData(){
			axios
		      .get(`http://127.0.0.1:8000/search/?query=${this.search}`)
		      .then(response => (this.results = response))
		},
		addToPlaylist(i){
			let video = {
				id: this.results.data[i].id.videoId,
				title: this.results.data[i].snippet.title,
				description: this.results.data[i].snippet.description,
				thumbnail: this.results.data[i].snippet.thumbnails.medium.url,
			}

			let add = true;
			for(let i=0;i<this.playlist.length;i++){
				if(this.playlist[i].id == video.id){
					add = false;
					break;
				}
			}
			if(add){
				this.playlist.push(video);
			}

			console.log(this.playlist);
		},
		removeFromPlaylist(i){
			this.playlist.splice(i, 1);
		},
		save(){
			axios({
			  method: 'post',
			  url: 'http://127.0.0.1:8000/save/',
			  data: this.playlist,
			  headers:{
			  	"Authorization" : "Token "+ localStorage.Token
			  }
			})
			.catch(function(err){
				console.log("Login Required to save")
			});
		}

	}
};

</script>

<style scoped>
	.container{
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 50px;
	}
	.featured{
		display: grid;
		grid-template-columns: repeat(4, 1fr);
	}
</style>