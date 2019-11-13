<template>
    <div class="video">
        <youtube
         :video-id="source"
         :player-vars="attrs" ref="youtube" 
         id="video-player"
         class="videoplayer" 
         @playing="playing" 
         @paused="paused" 
         @ended="ended"
         >
        </youtube>

        <div class="controls">
            <span id="video-stop" class="control" @click="shuffle">
                <img :src="require('@/assets/icons/shuffle-button.svg')">
            </span>
            <span id="playlist-save" class="control" @click="savePlaylist">
                <img :src="playlistButton">
            </span>
            <span id="video-backward" class="control" @click="$root.$emit('seekBackward')">
                <img :src="require('@/assets/icons/backward-button.svg')">
            </span>
            <span id="video-prev" class="control" @click="playPrev">
                <img :src="require('@/assets/icons/previous-button.svg')">
            </span>
            <span id="video-play" @click="videoPlay">
                <img :src="playButton">
            </span>
            <span id="video-next" class="control" @click="playNext">
                <img :src="require('@/assets/icons/next-button.svg')">
            </span>
            <span id="video-forward" class="control" @click="$root.$emit('seekForward')">
                <img :src="require('@/assets/icons/forward-button.svg')">
            </span>
            <span id="video-stop" class="control" @click="playStop">
                <img :src="require('@/assets/icons/stop-button.svg')">
            </span>

            <span id="video-full" class="control" @click="fullscreen">
                <img :src="require('@/assets/icons/fullscreen-button.svg')">
            </span>
            <span class="playing-status">
                Playing: <span>{{current_playing}}</span>
            </span>
            
        </div>
    </div>
</template>

<script>

import Vue from 'vue'
import VueYoutube from 'vue-youtube'
 
Vue.use(VueYoutube)

export default {


    props: ['source','plStatus'],
    data(){
        return {
            attrs:{
                autoplay: 1,
                controls: 0,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                fs: 1
            },
            isPlaying: false,
            playButton: require('@/assets/icons/play-button.svg'),
            playlistButton: require(`@/assets/icons/save0-button.svg`),
            current_playing: 'My Playlists',
            disabled: false,
        }
    },
    methods:{
        videoPlay(){

            if(!this.isPlaying){
                this.player.playVideo();
            }else{
                this.player.pauseVideo();
            }
        },
        playing(){
            this.isPlaying = true;
            this.playButton = require('@/assets/icons/pause-button.svg')

            this.$root.$on('seekForward', ()=>{
                this.player.getCurrentTime().then(t=>{
                    this.player.seekTo(t+5, true)
                });
            });
            this.$root.$on('seekBackward', ()=>{
                this.player.getCurrentTime().then(t=>{
                    this.player.seekTo(t-5, true)
                });
            });
        },
        paused(){
            this.isPlaying =  false;
            this.playButton = require('@/assets/icons/play-button.svg')
        },
        savePlaylist(){
            if(!this.disabled){
                this.$root.$emit('savePlaylist');
            }
        },
        ended(){
            this.$root.$emit('playNext');
        },

        playNext(){
            this.$root.$emit('playNext');
        },

        playPrev(){
            this.$root.$emit('playPrev');
        },
        playStop(){
            this.player.stopVideo()
            this.isPlaying =  false;
            this.playButton = require('@/assets/icons/play-button.svg')
        },
        fullscreen(){
            let f = this.player.getIframe()
            this.player.playVideo();           
            f.then((res)=>{
                res.requestFullscreen()
            });
        },
        shuffle(){
            this.$root.$emit('shuffle');
        }
    },
    mounted(){
        this.$root.$on('playerPlay',()=>{
            this.player.playVideo()
        });



        this.$root.$on('changePlaylist', (name)=>{
            this.current_playing = name; 
        });

        this.$root.$on('changePlaylist', (_)=>{

                if(_ != 'My Playlist'){
                    this.disabled = true
                }
                else{
                    this.disabled = false
                }
            });
    },
    computed: {
        player() {
          return this.$refs.youtube.player
        }
    },
    watch: {
        plStatus: {
            immediate: true, 
            handler (val, oldVal) {
                this.playlistButton = require(`@/assets/icons/save${val}-button.svg`)
            }
        }
    }
};
</script>

<style scoped>


.controls{
    margin-top: 10px;
    margin-bottom: 10px;
    position: relative;
}
.controls span{
    margin-left: 5px;
    margin-right: 5px;
}
.controls span img{
    width: 25px;
    cursor: pointer;
}
.controls .control img{
    width: 22px;
}
.playing-status{
    font-size: 1.1em;
    position: absolute;
    font-family: Impact, sans-serif;
    left: 0px;
    color: #FFF;
    font-weight: 600;
}

@media only screen and (max-width: 1000px)
{
    .playing-status{
        display: none;
    }
}
</style>