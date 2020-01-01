<template>
	<div v-if="admin==1">
		<!-- <div class="block">
			<h2>Statitics</h2>
			<div class="card-block">
				<div class="card">
					<h3>Total Visits</h3>
					<p>500</p>
				</div>
				<div class="card">
					<h3>Total Accounts</h3>
					<p>500</p>
				</div>
			</div>
		</div> -->

		<div class="block">
			<h2>Featured Videos</h2>
			<form class="addfeature" v-on:submit.prevent>
				<input type="text" name="addfeature" v-model="videolink"><button @click="addVideo()">Add</button>
			</form>
			<draggable class="feature" v-model="featured" @end="saveFeatured">
                <div class="video-item" v-for="(video,i) in featured" :key="i">
                    <img :src="video.thumbnail">
                    <div class="video-details">
                        <div class="remove" v-on:click="removeFromFeatured(i)">
                            <img :src="require('@/assets/icons/remove-button.svg')">
                        </div>
                    </div>
                </div>
            </draggable>


            <h2>Channel Videos</h2>
			<form class="addfeature" v-on:submit.prevent>
				<span v-if="state==0">
					<input type="text" placeholder="Paste URL here" name="addfeature" v-model="videolink"><button @click="addChannelVideo()">Add</button>
					<select class="select-channel" v-model="chanN">
						<option :value="i"  v-for="(channel,i) in channels" :key="i" >{{channel.name}}</option>
					</select>
					<input type="text" placeholder="new channel name here" name="addChannel" v-model="newChannel"><button @click="addChannel()">Add</button>
					<button @click="state=1">Remove</button>
					<button @click="state=2">Rename</button>
					<span v-if="channels[chanN].published">
						<button @click="setPublish(false)" class="withhold-btn">Unpublish</button>
					</span>
					<span v-else>
						<button @click="setPublish(true)" class="publish-btn">Publish</button>
					</span>
					<span class="duplicate">
						<button class="duplicate-btn" @click="duplicate()">Duplicate</button>
					</span>
				</span>
				<span v-if="state==1">
					Are you sure you want to delete this channel? It is permanent!
					<button @click="removeChannel();state=0">Yes</button>
					<button @click="state=0">No</button>
				</span>
				<span v-if="state==2">
					<input type="text" name="renameChannel" v-model="channels[chanN].name">
					<button @click="saveChannel();state=0">Ok</button>
					<button @click="state=0">Cancel</button>
				</span>
			</form>
            <draggable class="feature" v-model="channels[chanN].videos" @end="saveChannel">
                <div class="video-item" v-for="(video,i) in channels[chanN].videos" :key="i">
                    <img :src="video.thumbnail">
                    <div class="video-details">
                        <div class="remove" v-on:click="removeFromChannel(i)">
                            <img :src="require('@/assets/icons/remove-button.svg')">
                        </div>
                    </div>
                </div>
            </draggable>
		</div>
	</div>
</template>


<script>

	import axios from 'axios'
	import draggable from 'vuedraggable'

	export default{
		name: 'admin',
		components: {draggable,},
		data(){
			return {
				admin : 0,
				featured: [],
				videolink: '',
				channels: [{
					name:'Science',
					videos: []
				},{
					name:'Comedy',
					videos: []
				},{
					name:'Tragedy',
					videos: []
				}],
				chanN: 0,
				newChannel: '',
				state: 0,
				publish: 1
			}
		},
		methods:{
			removeFromFeatured(i){
				this.featured.splice(i, 1)
				this.saveFeatured()
			},
			setPublish(val){
				this.channels[this.chanN].published = val
				this.saveChannel()
			}
			,
			saveFeatured(){
				axios({
	              method: 'post',
	              url: `http://47.75.187.3:8000/saveFeatured/`,
	              data: this.featured,
	              headers:{
	                "Authorization" : "Token "+ localStorage.Token
	              }
	            })
	            .then(function(response){
	            	console.log(response.data)
	            })
	            .catch(function(err){
	                console.log("Login Required to save")
	            });
			},
			addVideo(){
				let self = this
				let id  = this.youtube_parser(this.videolink)
				axios
			      .get(`http://47.75.187.3:8000/getvideo/?query=${id}`)
			      .then(response => {
			      	let video  = {
			      		id :response.data[0].id,
			      		title: response.data[0].snippet.title,
			      		thumbnail: response.data[0].snippet.thumbnails.medium.url
			      	};

			      	self.featured.push(video)
				    this.saveFeatured()
			      })
			},
			youtube_parser(url){
    			var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    			var match = url.match(regExp);
    			return (match&&match[7].length==11)? match[7] : false;
			},
			addChannel(){
				if(this.newChannel != ''){
					let channel  = {
			      		name: this.newChannel,
						videos : [],
						published: false  
				   	};
					this.channels.push(channel)
					this.newChannel = ''
					this.saveChannel()
				}
			},
			duplicate(){
				let name = ''
				if(this.newChannel != ''){
					name = this.newChannel
				}else{
					name = this.channels[this.chanN].name
				}
				let channel = {
					name: name,
					videos: this.channels[this.chanN].videos,
					published: false
				}

				this.channels.push(channel)
				this.newChannel = ''
				this.saveChannel()
			},
			addChannelVideo(){
				let self = this
				let id  = this.youtube_parser(this.videolink)
				axios
			      .get(`http://47.75.187.3:8000/getvideo/?query=${id}`)
			      .then(response => {
			      	let video  = {
			      		id :response.data[0].id,
			      		title: response.data[0].snippet.title,
			      		thumbnail: response.data[0].snippet.thumbnails.medium.url
			      	};
					  console.log(video)
					  console.log(self.channels)
			      	self.channels[this.chanN].videos.push(video)
			      	this.saveChannel()
			      })
			},
			saveChannel(){
				axios({
	              method: 'post',
	              url: `http://47.75.187.3:8000/saveChannel/`,
	              data: this.channels,
	              headers:{
	                "Authorization" : "Token "+ localStorage.Token
	              }
	            })
	            .then(function(response){
	            	console.log(response.data)
	            })
	            .catch(function(err){
	                console.log("Login Required to save")
	            });
			},
			removeFromChannel(i){
				this.channels[this.chanN].videos.splice(i, 1)
				this.saveChannel()
			},
			removeChannel(){
				this.channels.splice(this.chanN,1)
				if(this.channels.length == this.chanN){
					this.chanN -= 1
				}
				this.saveChannel()
			}
		},
    mounted(){
        if(!localStorage.hasOwnProperty('Token')){
            this.$router.replace('login')
        }

        let self = this
        axios({
          method: 'post',
          url: `http://47.75.187.3:8000/isadmin/`,
          data: 'isadmin',
          headers:{
            "Authorization" : "Token "+ localStorage.Token
          }
        })
        .then(function(response){
            self.admin = response.data
            if(self.admin == 0){
            	self.$router.replace('/')
            }
        })
        .catch(function(err){
        	console.log(err)
            console.log("User is not admin")
        });

	    axios({
	      method: 'post',
	      url: `http://47.75.187.3:8000/featured/`,
	      data: '',
	      headers:{
	        "Authorization" : "Token "+ localStorage.Token
	      }
	    })
	    .then(function(response){
	        self.featured = JSON.parse(response.data)
	    })
	    .catch(function(err){
	        console.log("Login Required to save")
	    });

	    axios({
	      method: 'post',
	      url: `http://47.75.187.3:8000/channels/`,
	      data: '',
	      headers:{
	        "Authorization" : "Token "+ localStorage.Token
	      }
	    })
	    .then(function(response){
	        self.channels = JSON.parse(response.data)
	    })
	    .catch(function(err){
	        console.log("Login Required to save")
	    });

	}
	};
</script>

<style>
.block{
	margin-top: 50px;
}
.block h2{
	font-size: 2em;
	color: #303030;
}

.block .card-block{
	display: flex;
	margin-top: 10px;
}

.block .card-block .card{
	width: 200px;
	text-align: center;
	padding: 10px 30px;
	font-size: 1.2em;
	border-radius: 15px;
	background: #303030;
	color: #FFF;
	margin-left: 30px;
}

.block .card-block .card h3{
	font-size: 1.5em;
}

.addfeature{
	margin-top: 20px;
}

.addfeature input{
	padding: 4px 12px;
}

.addfeature button{
	padding: 4px 5px;
	margin-left: 5px;
}

.select-channel{
	padding: 4px 5px;
	margin-left: 5px;
}

.publish-btn{
	padding: 5px 10px;
}

.feature{
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(8, 6vw);
    width: 97%;
    grid-gap: 5px;
    padding: 20px;
    height: 400px;
    background: #535353;
    overflow-y: auto;
    margin: 20px auto;
}

.feature .video-item{
    width: 120px;
    position: relative;
}

.feature .video-item img{
    width: inherit;
}

.feature .video-item img:hover{
    cursor: pointer;
}

.feature .video-item .video-details {
  transition: .5s ease;
  opacity: 1;
  position: absolute;
  left: 125%;
  top: 8%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
  height: 115%;
  display: flex;
  align-items: center;
}

.feature .video-item .video-details:hover{
    opacity: 1;
}
.feature .video-item .video-details div{
    width: 20px;
    padding-left: 20px;
}
.feature .video-item .video-details div img{
    width: inherit;
}

</style>