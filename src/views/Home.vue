<template>
    <div class="home">
    <div class="searchButton" v-if="window.width < 900 && isSearch==false" @click="isSearch=true">
        <img :src="require('@/assets/icons/search-button.svg')">
    </div>
    <div class="channels dragscroll">
        <div class="channel" @click="playPlaylist">My Playlists</div>
        <div class="channel" v-for="(channel,i) in channels" :key="i" @click="playChannel(i)">{{channel.name}}</div>
    </div>
    <section class="content">
        <videoplayer class="v"></videoplayer>
        <searchvideo class="s" v-if="isSearch || window.width> 900" ></searchvideo>
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
import dragscroll from 'dragscroll'

export default {
    name: 'design',
    data(){
        return {
            featured: [],
            channels: [],
            isSearch: false,
            window: {
                width: 0,
                height: 0
            }
        }
    },
    components: {
        'videoplayer': VideoPlayer,
        'searchvideo': SearchVideo,dragscroll
    },
    
    methods:{
        handleResize() {
            this.window.width = window.innerWidth;
            this.window.height = window.innerHeight;
        },
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
        window.addEventListener('resize', this.handleResize)
        console.log('hello')
        this.handleResize();
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


        this.$root.$on('closeSearch', ()=>{

            this.isSearch  = false
        });

       
    }
  


};
</script>

<style scoped>

.searchButton{
    background: #303030;
    width: 40px;
    height: 40px;
    padding: 3px;
    border-radius: 100%;
    display: flex;
    justify-content: space-around;
    position: fixed;
    bottom: 40px;
    right: 30px;
    border: 2px solid #8eda3b;
    z-index: 2;
}
.searchButton img{
    width: 30px;

}

section.content{
	display: grid;
	grid-template-columns: 5fr 6fr;
    margin-bottom: 50px;
    margin-top: 10px;
    height: 800px;
}

.home{
    display: block;
}

section .v{
	margin-right: 10px;
	border-radius: 10px;
	background: #303030;
    width: 420px;
    height: 81%;
}


section .s{
    background: #535353;
    border-radius: 10px;
    margin-bottom: 30px;
}


.close{
    display: none;
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
    grid-template-columns: repeat(5,1fr);
    grid-gap: 5px;
}

/*@media only screen and (max-width: 1000px){
    .feature-videos{
        margin-top: 20px;
        display: grid;
        grid-template-columns: repeat(3,1fr);
        grid-gap: 5px;
    }
}*/

.thumbnail img{
    width: 240px;
}

@media (max-width: 900px){
    .feature-videos{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
    }

    .thumbnail{
        padding: 3px;
    }

    .thumbnail img{
        width: 98%;
    }
}
`

.details{
    margin-bottom: 15px;
}

.details .heading{
    height: 45px;
    overflow: hidden;
    font-size: 0.8em;
    font-weight: 600;
}

.channels{
    width: 100%;
    display: flex;
    margin: 0 auto;
    justify-content: space-around;
    margin-top: 12px;
    overflow-x: hidden;
    cursor: pointer;
}

@media (max-width: 900px){
    .channels{
        overflow-x: auto;
    }
}

.channels::before{
    content : '';
    
}

@media (min-width: 320px){
    .channels::before{
        margin: 0 700px;
    }
}
@media (min-width: 510px){
    .channels::before{
        margin: 0 600px;
    }
}
@media (min-width: 750px){
    .channels::before{
        margin: 0 480px;
    }
}
@media (min-width: 1000px){
    .channels::before{
        margin: 0 240px;
    }
}
.channels .channel{
    background: rgb(169,196,220);
    padding: 10px 40px;
    margin: 0 5px;
    border-radius: 20px;
    font-size: 1em;
    color: #303030;
    font-weight: bolder;
    cursor: pointer;
    text-align: center;
    vertical-align: center;
    white-space: nowrap;
    transition: color 0.5s;
}

.channels .channel:nth-child(4n){
    background: linear-gradient(180deg, rgba(169,196,220,1) 0%, rgba(131,173,212,1) 36%, rgba(187,228,250,1) 72%);
}

.channels .channel:nth-child(4n+1){
    background: rgb(198,239,255);
background: linear-gradient(0deg, rgba(198,239,255,1) 0%, rgba(134,180,228,1) 69%, rgba(0,68,143,1) 100%);
}

.channels .channel:nth-child(4n+2){
    background: rgb(202,202,202);
    background: linear-gradient(180deg, rgba(202,202,202,1) 0%, rgba(140,140,140,1) 25%, rgba(224,224,224,1) 72%);
}

.channels .channel:nth-child(4n+3){
    background: rgb(175,246,196);
    background: linear-gradient(180deg, rgba(175,246,196,1) 0%, rgba(129,223,234,1) 25%, rgba(129,234,210,1) 72%);

}

.channels .channel:hover{
    color: black;
}

/*@media only screen and (max-width: 1000px){
  section .v{
    margin-right: 10px;
    border-radius: 10px;
    background: #303030;
    width: 420px;
  }
  .thumbnail img{
    width: 100%;
    }

}*/
@media(max-width: 900px){
    section.content{
        display: block;
    }
    section .v{
        width: 100%;
        /*margin: 0px;*/
    }

    section .s{
        display: block;
        position: absolute;
        top: 0px;
        right: 0px;
    }

}

@media (min-width: 900px){
    .searchButton{
      display: none;
    }
  }
</style>

<style>
    
</style>