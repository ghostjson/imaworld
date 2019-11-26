<template>
	<div class="search" id="search-section" :class="isSearch">
		<img :src="require('@/assets/icons/close.svg')" class="close-button" @click="closeSearch">
		<!-- <div class="search-block">
			<span class="lock-button-icon" @click="locksearch">
				<img class="search-button" :src="lockedButton">
			</span>
			<input type="text" name="search" v-model="search" :disabled="disabled" placeholder="search here..." v-on:keyup.enter="getData">
			<span class="search-button-icon" @click="getData" :disabled="disabled"><img class="search-button" :src="require('@/assets/icons/search-button.svg')"></span>
			<img class="link-button" :src="require('@/assets/icons/link-button.svg')" @click="linkVideo()"></span>
		</div> -->
		<div class="search-block">
			<span v-if="search_state==0">
				<input type="password" name="search" v-model="search_password_entered" placeholder="Enter Password To unlock">
				<span class="lock-button-icon">
					<img class="search-button" :src="lockedButton">
				</span>
			</span>
			<span v-if="search_state==1">
				<autocomplete :search="suggest" v-on:keyup.enter="getData" @submit="getData"></autocomplete>
				<div>
					<!-- <input class="" type="text" name="search" v-model="search" :disabled="disabled" placeholder="search here..." v-on:keyup.enter="getData"> -->
				</div>
				<span class="search-button-icon" @click="getData" :disabled="disabled"><img class="search-button" :src="require('@/assets/icons/search-button.svg')"></span>
				<img class="link-button" :src="require('@/assets/icons/link-button.svg')" @click="linkVideo()">
				<img class="search-button" :src="lockedButton" @click="locksearch">
			</span>
		</div>
		<div class="orderby" v-if="search!=''">
			<span @click="changeOrder('relevance')">Relevance</span>
			<span @click="changeOrder('viewCount')">View Count</span>
			<span @click="changeOrder('rating')">Rating</span>
		</div>
		<div class="results-block">
			<div class="search-results">
    			<div class="search-results-block" v-for="(item, i) in searchResults.data" :key="i">
        			<div class="thumbnail">
            			<img :src="item.snippet.thumbnails.medium.url">
        			</div>
	        		<div class="details">
	            		<div class="heading">{{item.snippet.title}}</div>
		            	<div id="icon-pack">
			                <span class="icons" @click="playVideo(item)">
			                    <img :src="require('@/assets/icons/play-button.svg')">
			                </span>
			                <span class="icons" @click="addtoPlaylist(item)">
			                    <img :src="require('@/assets/icons/add-button.svg')">
			                </span>
		            	</div>
	        		</div>
    			</div>

    			<div class="show-more" @click="moreResults" v-if="isShowMore">
    				<p>Show More</p>
    			</div>
			</div>

		</div>
	</div>
</template>


<script>

	import axios  from 'axios'
	import Autocomplete from '@trevoreyre/autocomplete-vue'
	import yauto from 'youtube-autocomplete'
	import '@trevoreyre/autocomplete-vue/dist/style.css'
	import suggest from  'suggestion'


	export default{
		data(){
			return {
				searchResults: '',
				search: '',
				quatity: 1,
				isShowMore: false,
				disabled: false,
				lockedButton: require('@/assets/icons/lock-state.svg'),
				search_password: '',
				search_state: 0,
				search_password_entered: '',
				isSearch: 'search-show',
				suggestions: []
			}
		}
		,
		components: {
			Autocomplete,
			yauto
		},
		methods:{
			getData(input){
				if(this.search != ''){
					axios
				      .get(`http://ghostjson.pythonanywhere.com/search/?query=${this.search}&quatity=${this.quatity}&orderby=relevance`)
				      .then(response => {
				      	this.searchResults = response
				      })	

				    this.isShowMore = true	
				}
			},
			moreResults(){
				this.quatity = this.quatity + 1
				this.getData()

				if(this.quatity == 5) {
					this.isShowMore = false
				}
			},
			playVideo(item){
				this.$root.$emit('play', item.id.videoId)
			},
			addtoPlaylist(item){
				console.log(this.searchResults)


				for( var i = 0; i < this.searchResults.data.length; i++){ 
				console.log('List id: '+ this.searchResults.data[i].id + '  ' + 'video id: '+ item.id.videoId)
				   if ( this.searchResults.data[i].id.videoId == item.id.videoId) {
				    	this.searchResults.data.splice(i, 1); 
				   }
				}

				let video = {
					'id': item.id.videoId,
					'title': item.snippet.title,
					'thumbnail' : item.snippet.thumbnails.medium.url,
				};
				this.$root.$emit('addToPlaylist', video)
			},
			locksearch(){
				this.search_state = 0
				this.lockedButton = require('@/assets/icons/lock-state.svg');
				
			},
			changeOrder(order){
				if(this.search != ''){
					axios
				      .get(`http://ghostjson.pythonanywhere.com/search/?query=${this.search}&quatity=${this.quatity}&orderby=${order}`)
				      .then(response => (this.searchResults = response))			

				    this.isShowMore = true	
				}
			},
			linkVideo(){
				if(this.search != ''){
					let self = this
					let id  = this.youtube_parser(this.search)
					axios
			      	.get(`http://ghostjson.pythonanywhere.com/getvideo/?query=${id}`)
			      	.then(response => {
			      		let video  = {
			      		id :response.data[0].id,
			      		title: response.data[0].snippet.title,
			      		thumbnail: response.data[0].snippet.thumbnails.medium.url
			      		};

			      		this.$root.$emit('addToPlaylist', video)
			      		this.changePlaylist = 1
			      	})
				}
			},
			youtube_parser(url){
    			var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    			var match = url.match(regExp);
    			return (match&&match[7].length==11)? match[7] : false;
			},
			suggest(input){
				this.search = input
				if(0){
					return []
				}
				else{
					if(input != ''){

						return new Promise(resolve=>{
							suggest(input,{client: 'youtube'} ,function (err, suggestions) {
							  if (err) throw err;
							  resolve(suggestions);
							});
						})
					}
				}
			},
			closeSearch(){
				this.$root.$emit('closeSearch')
			}
		},
		mounted(){

			let self = this
        axios({
          method: 'post',
          url: `http://ghostjson.pythonanywhere.com/getsp/`,
          data: '',
          headers:{
            "Authorization" : "Token "+ localStorage.Token
          }
        })
        .then(function(response){
            self.search_password = JSON.parse(response.data)
            console.log(self.search_password)
        })
        .catch(function(err){
            console.log("Login Required to save")
        });



			this.$root.$on('changePlaylist', (_)=>{

				if(_ != 'My Playlist'){
					this.disabled = true
					this.searchResults = ''
					this.search = ''
					this.isShowMore = false
				}
				else{
					this.disabled = false
				}
			});

			this.$root.$on('searchRelated', (title)=>{
				this.search = title
				this.getData()
			});			
		},
		watch: {
			search_password_entered : function(val){
				if(val == this.search_password){
					this.search_state = 1
					this.lockedButton = require('@/assets/icons/unlocked-state.svg')
					this.search_password_entered = ''
					this.searchResults = {}
				}
			}
		}
	};
</script>

<style scoped>

div.search{
	position: relative;
	display: flex;
	flex-direction: column;
	height: 81%;
}

.suggest ul{
	list-style: none;
	font-size: 1.1em;
	background: white;
	position: absolute;
	width: 180px;

}

/*div.search div.search-block{
	height: inherit;
	display: flex;
	justify-content: space-around;
}



div.search span.search-button-icon{
	position: absolute;
	right: 20%;
	top: 30px;
}

div.search span.lock-button-icon{
	position: absolute;
	left: 10%;
	top: 30px;
	cursor: pointer;
}



.link-button{
	position: absolute;
	left: 85%;
	top: 30px;
	cursor: pointer;
}*/

div.search div.search-block{
	display: flex;
	justify-content: center;
	align-items: center;
}

div.search div  input{
	background: #303030;
	border: none;
	padding: 3% 10%;
	font-size: 1.2em;
	border-radius: 20px;
	color: #FFF;
	margin-top: 5%;
	width: 80%;

}

.search-button, .link-button{
	width: 25px;
	margin-left: 2px;
	position: relative;
	left: 10px;
	top: 5px;
	cursor: pointer;
}

div.details{
	display: flex;
	flex-direction: column;
}

.search-results{
    width: 100%;
    margin-top: 30px;
    height: 855px;
    overflow: auto;
}
.search-results 
.search-results-block{
	background: #72da21;	
    display: flex;
    padding: 5px;
    height: 88px;
    margin-top: 15px;
}

.details{
    margin: 3px;
}

.heading{
    font-size: 0.8em;
    font-weight: bold;
    height: 90.3px;
    overflow: hidden;
}

.search-results 
.search-results-block
.thumbnail img{
    width: 150px;
}


.icons img{
    padding-left: 10px;
    width: 20px;
    cursor: pointer;
}
#icon-pack{
	height: 20px ;
}

.show-more{
	font-size: 1.3em;
	font-family: Impact, sans-serif;
	font-weight: 400;
	text-align: center;
	cursor: pointer;
	transition: .5s ease;
	background: #3380da;
	color: #fff;
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
}

.show-more:hover{
	font-size: 1.5em;
}

.orderby{
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	text-align: center;
	margin-top: 12px;
	margin-bottom: 12px;
	text-decoration: underline;
	color: #fff;
}

.orderby span{
	cursor: pointer;
}

.close-button{
	width: 30px;
	position: absolute;
	right: 3px;
	top: 12px;
	display: none;
}

@media (max-width: 900px){
	.close-button{
		display: block;
	}

	div.search div  input{
	background: #303030;
	border: none;
	padding: 2px 5px;
	font-size: 1.2em;
	border-radius: 20px;
	color: #FFF;
	margin-top: 5%;
	width: 50%;

}
}

/*@media only screen and (max-width: 1000px){
	div.search div  input{
		width: 60%;
	}
	div.search span.search-button-icon{
		position: absolute;
		right: 22%;
		top: 28px;
	}

	div.search span.lock-button-icon{
		position: absolute;
		left: 10%;
		top: 65px;
		cursor: pointer;
	}
	.link-button{
		position: absolute;
		left: 20%;
		top: 65px;
		cursor: pointer;
	}

}
*/
</style>