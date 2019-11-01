<template>
    <section>
        <div class="video-player">
            <div class="video">
                <video-window :source="id" :plStatus="isPlaylistChanged"></video-window>
            </div>
            <div class="playlist">
                <div class="video-item" v-for="(video,i) in playlist" :key="i">
                    <img :src="video.thumbnail">
                    <div class="video-details">
                        <div class="play" @click="playVideo(video)">
                            <img :src="require('@/assets/icons/play-button.svg')">
                        </div>
                        <div class="remove" v-on:click="removeFromPlaylist(i)" v-if="!disabled">
                            <img :src="require('@/assets/icons/remove-button.svg')">
                        </div>
                        <div class="search" @click="searchVideo(video.title)" v-if="!disabled">
                            <img :src="require('@/assets/icons/search-button.svg')">
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    </section>    
</template>

<script>

import VideoWindow from './VideoPlayer/Video'
import axios from 'axios'

export default {
    name: 'video-player',
    data(){
        return{
            id: '18OywdkVT2o',
            playlist : [],
            isPlaylistChanged: 0,
            currentPlay: 0,
            disabled: false
        }
    },
    methods: {
        playVideo(item){
            this.id = item.id
            this.$root.$emit('playerPlay')
        },
        removeFromPlaylist(i){
            this.playlist.splice(i, 1);
            this.isPlaylistChanged = 1
        },
        searchVideo(title){
            this.$root.$emit('searchRelated', title)
        }
    },
    components: {
        'video-window' : VideoWindow
    },
    created(){

    },
    mounted(){





        this.$root.$on('play',(id)=>{
            this.id = id
        });


        this.$root.$on('addToPlaylist', (video)=>{
            let add = true;
            for(let i=0;i<this.playlist.length;i++){
                if(this.playlist[i].id == video.id){
                    console.log('same id')
                    add = false;
                    break;
                }
            }
            if(add){
                this.playlist.push(video);
                this.isPlaylistChanged = 1;
            }
        });

        this.$root.$on('savePlaylist', ()=>{
            console.log('save')
            axios({
              method: 'post',
              url: `http://ghostjson.pythonanywhere.com/save/`,
              data: this.playlist,
              headers:{
                "Authorization" : "Token "+ localStorage.Token
              }
            })
            .then(function(response){
                self.isPlaylistChanged = 0
            })
            .catch(function(err){
                console.log("Login Required to save")
            });
        });

        let self = this
        axios({
          method: 'post',
          url: `http://ghostjson.pythonanywhere.com/playlist/`,
          data: '',
          headers:{
            "Authorization" : "Token "+ localStorage.Token
          }
        })
        .then(function(response){
            self.playlist = JSON.parse(response.data)
            self.playVideo(self.playlist[self.currentPlay])
        })
        .catch(function(err){
            console.log("Login Required to save")
        });
        
        this.$root.$on('playNext',()=>{
            this.currentPlay += 1
            this.playVideo(this.playlist[this.currentPlay])
        });

        this.$root.$on('playPrev',()=>{
            this.currentPlay -= 1
            this.playVideo(this.playlist[this.currentPlay])
        });

        this.$root.$on('playChannel',(channel)=>{
            this.playlist = channel
            this.currentPlay = 0
            this.playVideo(this.playlist[this.currentPlay])
        });

        this.$root.$on('changePlaylist', (_)=>{
                if(_ != 'My Playlist'){
                    this.disabled = true
                }
                else{
                    this.disabled = false
                }
        });

        this.$root.$on('playPlaylist', ()=>{
            let self = this
        axios({
          method: 'post',
          url: `http://ghostjson.pythonanywhere.com/playlist/`,
          data: '',
          headers:{
            "Authorization" : "Token "+ localStorage.Token
          }
        })
        .then(function(response){
            self.playlist = JSON.parse(response.data)
            self.playVideo(self.playlist[self.currentPlay])
        })
        .catch(function(err){
            console.log("Login Required to save")
      });
        });
    }
};
</script>

<style scoped>

section{
    padding-right: 30px;
    padding-left: 30px;
}

.video-player{
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-top: 40px;
}


.playlist{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(8, 5vw);
    width: 95%;
    grid-gap: 30px;
    padding: 20px;
    height: 400px;
    background: #535353;
    overflow-y: auto;
    margin: 0 auto;
}

.playlist .video-item{
    width: 140px;
    position: relative;
}

.playlist .video-item img{
    width: inherit;
}

.playlist .video-item img:hover{
    cursor: pointer;
}

.playlist .video-item .video-details {
  transition: .5s ease;
  opacity: 0;
  position: absolute;
  left: 50%;
  top: 59%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
  height: 120%;
  display: flex;
  align-items: center;
  background: rgba(0,0,0,0.5);
}

.playlist .video-item .video-details:hover{
    opacity: 1;
}
.playlist .video-item .video-details div{
    width: 20px;
    padding-left: 20px;
}
.playlist .video-item .video-details div img{
    width: inherit;
}


</style>