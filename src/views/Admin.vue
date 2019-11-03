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
			<div class="feature">
                <div class="video-item" v-for="(video,i) in featured" :key="i">
                    <img :src="video.thumbnail">
                    <div class="video-details">
                        <div class="remove" v-on:click="removeFromFeatured(i)">
                            <img :src="require('@/assets/icons/remove-button.svg')">
                        </div>
                    </div>
                </div>
            </div>


            <h2>Channel Videos</h2>
			<form class="addfeature" v-on:submit.prevent>
				<input type="text" name="addfeature" v-model="videolink"><button @click="addChannelVideo()">Add</button>
				<select class="select-channel" v-model="chanN">
					<option :value="i"  v-for="(channel,i) in channels" :key="i" >{{channel.name}}</option>
				</select>
				<input type="text" name="addChannel" v-model="newChannel"><button @click="addChannel()">Add</button>
				<button @click="removeChannel()">Remove</button>
			</form>
            <div class="feature">
                <div class="video-item" v-for="(video,i) in channels[chanN].videos" :key="i">
                    <img :src="video.thumbnail">
                    <div class="video-details">
                        <div class="remove" v-on:click="removeFromChannel(i)">
                            <img :src="require('@/assets/icons/remove-button.svg')">
                        </div>
                    </div>
                </div>
            </div>
		</div>
	</div>
</template>


<script>

	import axios from 'axios'

	export default{
		name: 'admin',
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
				newChannel: ''
			}
		},
		methods:{
			removeFromFeatured(i){
				this.featured.splice(i, 1)
				this.saveFeatured()
			},
			saveFeatured(){
				axios({
	              method: 'post',
	              url: `http://ghostjson.pythonanywhere.com/saveFeatured/`,
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
			      .get(`http://ghostjson.pythonanywhere.com/getvideo/?query=${id}`)
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
				let channel  = {
			      		name: this.newChannel,
			      		videos : []
			   	};
				this.channels.push(channel)
				this.newChannel = ''
			},
			addChannelVideo(){
				let self = this
				let id  = this.youtube_parser(this.videolink)
				axios
			      .get(`http://ghostjson.pythonanywhere.com/getvideo/?query=${id}`)
			      .then(response => {
			      	let video  = {
			      		id :response.data[0].id,
			      		title: response.data[0].snippet.title,
			      		thumbnail: response.data[0].snippet.thumbnails.medium.url
			      	};
			      	console.log(video)
			      	self.channels[this.chanN].videos.push(video)
			      	this.saveChannel()
			      })
			},
			saveChannel(){
				axios({
	              method: 'post',
	              url: `http://ghostjson.pythonanywhere.com/saveChannel/`,
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
          url: `http://ghostjson.pythonanywhere.com/isadmin/`,
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
	      url: `http://ghostjson.pythonanywhere.com/featured/`,
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
	      url: `http://ghostjson.pythonanywhere.com/channels/`,
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

.feature{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(8, 5vw);
    width: 95%;
    grid-gap: 30px;
    padding: 20px;
    height: 400px;
    background: #535353;
    overflow-y: auto;
    margin: 20px auto;
}

.feature .video-item{
    width: 140px;
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
  top: 15%;
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
    width: 25px;
    padding-left: 20px;
}
.feature .video-item .video-details div img{
    width: inherit;
}

</style>