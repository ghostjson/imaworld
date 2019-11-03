<template>
    <div>
    <div class="channels">
        <div class="channel" @click="playPlaylist">My Playlists</div>
        <div class="channel" v-for="(channel,i) in channels" :key="i" @click="playChannel(i)">{{channel.name}}</div>
    </div>
    <section class="content">
        <videoplayer class="v"></videoplayer>
        <searchvideo class="s"></searchvideo>
    </section>
        <div>
            <div class="feature-heading">Feature Videos</div>
            <div class="feature-videos">
                <div class="feature-video-block" v-for="(item, i) in featured" :key="i">
                    <div class="thumbnail">
                        <img :src="item.thumbnail">
                    </div>
                    <div class="details">
                        <div class="heading">{{item.title}}</div>
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
            </div>

        </div>
    </div> 
</template>

<script>

import VideoPlayer from '../components/VideoPlayer'
import SearchVideo from '../components/SearchVideo'
import axios from 'axios'

export default {
    name: 'design',
    data(){
        return {
            featured: [],
            channels: [],
        }
    },
    components: {
        'videoplayer': VideoPlayer,
        'searchvideo': SearchVideo,
    },
    methods:{
        playVideo(item){
                console.log(item)
                this.$root.$emit('play', item.id)
        },
        addtoPlaylist(item){
            this.$root.$emit('addToPlaylist', item)
        },
        playChannel(i){
            this.$root.$emit('playChannel', this.channels)
            this.$root.$emit('changePlaylist', this.channels[i].name)
        },
        playPlaylist(){
            this.$root.$emit('playPlaylist')
            this.$root.$emit('changePlaylist', 'My Playlists')
        }
    },
    created(){
        if(!localStorage.hasOwnProperty('Token')){
            this.$router.replace('login')
        }
    },
    mounted(){
        let self = this
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

<style scoped>

section.content{
	display: grid;
	grid-template-columns: 5fr 3fr;
    margin-bottom: 50px;
    margin-top: 50px;
}

section .v{
	margin-right: 60px;
	border-radius: 10px;
	background: #303030;
}

section .s{
    background: #535353;
    border-radius: 10px;
    margin-bottom: 30px;
}



.feature-heading{
    font-size: 1.8em;
    text-align: center;
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

.feature-videos{
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(4,1fr);
    grid-gap: 20px;
    margin-bottom: 20px;
}

.thumbnail img{
    width: 250px;
}

.details .heading{
    height: 45px;
    overflow: hidden;
}

.channels{
    display: flex;
    justify-content: space-around;
    margin-top: 12px;
}

.channels .channel{
    background: #8eda3b;
    padding: 10px 40px;
    margin: 0 5px;
    border-radius: 20px;
    font-size: 1em;
    color: #303030;
    font-weight: bolder;
    cursor: pointer;
}

</style>