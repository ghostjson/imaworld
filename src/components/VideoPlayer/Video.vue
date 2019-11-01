<template>
    <div class="video">
        <youtube
         :video-id="source"
         :player-vars="attrs" ref="youtube" 
         id="video-player"
         width="710px;" 
         @playing="playing" 
         @paused="paused" 
         @ended="ended" 
         >
        </youtube>

        <div class="controls">
            <span id="playlist-save" class="control" @click="savePlaylist">
                <img :src="playlistButton">
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
            <span id="video-stop" class="control" @click="playStop">
                <img :src="require('@/assets/icons/stop-button.svg')">
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
                showInfo: 0,
                fs: 1,
            },
            isPlaying: false,
            playButton: require('@/assets/icons/play-button.svg'),
            playlistButton: require(`@/assets/icons/save0-button.svg`),
            current_playing: 'My Playlist',
            disabled: false
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
    font-size: 1.2em;
    position: absolute;
    font-family: Impact, sans-serif;
    left: 50px;
    color: #FFF;
    font-weight: 600;
}
</style>