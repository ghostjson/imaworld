<template>
	<div class="search">
		<div class="search-block">
			<input type="text" name="search" v-model="search" :disabled="disabled" placeholder="search here..." v-on:keyup.enter="getData">
			<span class="search-button-icon" @click="getData" :disabled="disabled"><img class="search-button" :src="require('@/assets/icons/search-button.svg')"></span>
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

	export default{
		data(){
			return {
				searchResults: '',
				search: '',
				quatity: 1,
				isShowMore: false,
				disabled: false
			}
		},
		methods:{
			getData(){
				if(this.search != ''){
					axios
				      .get(`http://ghostjson.pythonanywhere.com/search/?query=${this.search}&quatity=${this.quatity}`)
				      .then(response => (this.searchResults = response))			

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

				let video = {
					'id': item.id.videoId,
					'title': item.snippet.title,
					'thumbnail' : item.snippet.thumbnails.medium.url,
				};
				this.$root.$emit('addToPlaylist', video)
			}
		},
		mounted(){
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
		}
	};
</script>

<style scoped>

div.search{
	position: relative;
	display: flex;
	flex-direction: column;
	height: inherit;
}

div.search div.search-block{
	height: inherit;
	display: flex;
	justify-content: space-around;
}

div.search div  input{
	background: #303030;
	border: none;
	padding: 5px 10px;
	font-size: 1.5em;
	border-radius: 20px;
	color: #FFF;
	margin-top: 20px;
}

div.search span.search-button-icon{
	position: absolute;
	right: 20%;
	top: 30px;
}

.search-button{
	width: 25px;
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
    /*background: rgb(142,218,59);*/
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
    font-size: 1.1em;
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
    padding-top: 5px;
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
</style>