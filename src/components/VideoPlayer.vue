<template>
    <section>
        <div class="video-player">
            <div class="video">
                <video-window :source="id" :plStatus="isPlaylistChanged"></video-window>
            </div>

            <form class="playlist-select" v-on:submit.prevent v-if="!disabled">
                <span v-if="addPlaylist">
                    <input type="text" name="addfeature" v-model="playlistname" class="playlist-add" placeholder="playlist name">
                    <img class="add-icon" :src="require('@/assets/icons/add-playlist-button.svg')" @click="addNewPlaylist">
                    <img class="cancel-icon" :src="require('@/assets/icons/cancel-button.svg')" @click="addPlaylist=0">
                </span>
                <span v-else>
                    <select class="select-channel" v-model="playN"  @click="changePlaylist">
                        <option :value="i"  v-for="(playlist,i) in playlists" :key="i" >{{playlist.name}}</option>
                    </select>
                    <img class="add-icon" :src="require('@/assets/icons/add-playlist-button.svg')" @click="addPlaylist=1">
                    <img class="remove-icon" :src="require('@/assets/icons/remove-button.svg')" @click="removePlaylist">
                </span>
            </form>

            <div class="playlist">
                <div class="video-item" v-for="(video,i) in playlists[playN].videos" :key="i">
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
            playlists : [],
            isPlaylistChanged: 0,
            currentPlay: 0,
            disabled: false,
            playN: 0,
            addPlaylist: 0,
            playlistname: '',
        }
    },
    methods: {
        playVideo(item){
            this.id = item.id
            this.$root.$emit('playerPlay')
        },
        removeFromPlaylist(i){
            this.playlists[this.playN].videos.splice(i, 1);
            this.isPlaylistChanged = 1
        },
        searchVideo(title){
            this.$root.$emit('searchRelated', title)
        },
        shuffle(array) {
            array.sort(() => Math.random() - 0.5);
        },
        changePlaylist(){

        },
        addNewPlaylist(){
            let playlist  = {
                name: this.playlistname,
                videos: []
            }

            this.playlists.push(playlist)
            this.addPlaylist = 0
            this.isPlaylistChanged = 1
        },
        removePlaylist(){
            this.playlists.splice(this.playN, 1);
            this.isPlaylistChanged = 1
        },
    },
    components: {
        'video-window' : VideoWindow
    },
    created(){

    },
    mounted(){

        let self = this

        this.$root.$on('shuffle', ()=>{
            this.shuffle(this.playlists[this.playN].videos)
            this.currentPlay = -1
        });


        this.$root.$on('play',(id)=>{
            this.id = id
        });


        this.$root.$on('addToPlaylist', (video)=>{
            let add = true;
            for(let i=0;i<this.playlists[this.playN].videos.length;i++){
                if(this.playlists[this.playN].videos[i].id == video.id){
                    console.log('same id')
                    add = false;
                    break;
                }
            }
            if(add){
                console.log(this.playlists[this.playN].videos)
                this.playlists[this.playN].videos.push(video);
                this.isPlaylistChanged = 1;
            }
        });

        this.$root.$on('savePlaylist', ()=>{

            axios({
              method: 'post',
              url: `http://ghostjson.pythonanywhere.com/save/`,
              data: self.playlists,
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

        axios({
          method: 'post',
          url: `http://ghostjson.pythonanywhere.com/playlist/`,
          data: '',
          headers:{
            "Authorization" : "Token "+ localStorage.Token
          }
        })
        .then(function(response){
            self.playlists = JSON.parse(response.data)
            self.playVideo(self.playlists[self.playN].videos[self.currentPlay])
        })
        .catch(function(err){
            console.log("Login Required to save")
        });
        
        this.$root.$on('playNext',()=>{
            this.currentPlay += 1
            this.playVideo(this.playlists[this.playN].videos[this.currentPlay])
            if(this.currentPlay == this.playlists[this.playN].videos.length){
                this.currentPlay = 0
            }
        });

        this.$root.$on('playPrev',()=>{
            if(this.currentPlay > 0){    
                this.currentPlay -= 1
                this.playVideo(this.playlists[this.playN].videos[this.currentPlay])
            }
        });

        this.$root.$on('playChannel',channel=>{
            this.playlists = channel
            this.currentPlay = 0
            this.disabled = true
        });

        this.$root.$on('changePlaylist', (_)=>{

                this.playN = this.playlists.findIndex(k => k.name == _ )
                this.playVideo(this.playlists[this.playN].videos[this.currentPlay])

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
                self.playlists = JSON.parse(response.data)
                self.currentPlay = 0
                self.playN = 0
                self.playVideo(self.playlists[self.playN].videos[self.currentPlay])
                self.disabled = false
            })
            .catch(function(err){
                console.log(err)
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
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(8, 5vw);
    width: 95%;
    grid-gap: 12px;
    padding: 20px;
    height: 400px;
    background: #535353;
    overflow-y: auto;
    margin: 0 auto;
}

.playlist .video-item{
    width: 122px;
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
  top: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background: rgba(0,0,0,0.5);
}

.playlist .video-item .video-details:hover{
    opacity: 1;
}
.playlist .video-item .video-details div{
    width: 100%;
    display: flex;
    justify-content: center;
}
.playlist .video-item .video-details div img{
    width: 20px;
}

.playlist-select{
    margin-bottom: 10px;
}

.playlist-button{
    margin-left: 5px;
}

.add-icon{
    width: 25px;
    margin-left: 10px;
    cursor: pointer;
    position: absolute;
}

.cancel-icon{
    width: 28px;
    margin-left: 40px;
    margin-top: 2px;
    cursor: pointer;
    position: absolute;
}

.playlist-add{
    background: #535353;
    border: none;
    padding: 5px 10px;
    border-radius: 20px;
    color: #FFF;
}

.remove-icon{
    width: 28px;
    margin-left: 40px;
    margin-top: 2px;
    cursor: pointer;
    position: absolute; 
}



</style>