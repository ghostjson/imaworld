<template>
    <div class="home">
    <div class="searchButton" v-if="window.width < 900 && isSearch==false" @click="isSearch=true">
        <img :src="require('@/assets/icons/search-button.svg')">
    </div>
    <div class="channels dragscroll">
        <div class="channel-container">
            <div class="channel" @click="playPlaylist">My Playlists</div>
            <div class="channel" v-for="(channel,i) in publishedChannels" :key="i" @click="playChannel(i)">{{channel.name}}</div>
        </div>
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
    computed: {
        publishedChannels : function(){
            return this.channels.filter(function(c){
                return c.published
            })
        }
    }
    ,
    watch: {
        isSearch: function(val){

            if(val){
                this.$root.$emit('isSearch', true)
            }else{
                this.$root.$emit('isSearch', false)
            }
        }
    }
    ,
    
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
          url: `https://imaworld-backend.herokuapp.com/featured/`,
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
          url: `https://imaworld-backend.herokuapp.com/channels/`,
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
    right: 10px;
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
    /*margin-left: 130px;*/
    /* height: 600px; */
    margin-left: 11%;
    margin-right: 1%;
}

.home{
    display: block;
}

section .v{
	margin-right: 10px;
	border-radius: 10px;
	background: #303030;
    width: 420px;
    height: 100%;
}


section .s{
    background: #535353;
    border-radius: 10px;
    margin-bottom: 30px;
    width: 75%;
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
    grid-template-columns: repeat(7,1fr);
    grid-gap: 20px;
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
    width: 150px;
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
    width: 55%;
    display: flex;
    margin: 0 auto;
    justify-content: space-around;
    margin-top: 12px;
    overflow-x: hidden;
    cursor: pointer;
    position: absolute;
    top: 5px;
    right: 340px;
}

.channels .channel-container{
    display: flex;
    width: 100%;
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
        margin: 0 80px;
    }
}
@media (min-width: 510px){
    .channels::before{
        margin: 0 100px;
    }
}
@media (min-width: 750px){
    .channels::before{
        margin: 0 50px;
    }

}
@media (min-width: 1000px){
    .channels::before{
        margin: 0 60px;
    }
}
/*.channels .channel{
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
*/
/*.channels .channel:nth-child(4n){
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

}*/

.channels .channel{
    background: rgb(169,196,220);
    padding: 10px 40px;
    margin: 0 15px;
    border-radius: 20px;
    font-size: 0.8em;
    font-weight: bolder;
    cursor: pointer;
    text-align: center;
    vertical-align: center;
    white-space: nowrap;
    transition: color 0.5s;
    background: linear-gradient(180deg, rgba(255,211,204,1) 0%, rgba(242,129,95,1) 29%, rgba(238,107,53,1) 54%, rgba(247,129,42,1) 88%);
    color: #FFF;
    text-transform: uppercase;
    border: 3px solid;
    
    border-image-slice: 1;
    border: 3px solid #2f2f2f70;
}

/* .channels .channel:nth-child(4n){ */
    /*background: linear-gradient(180deg, rgba(210,212,224,1) 7%, rgba(164,132,135,1) 44%, rgba(236,233,228,1) 88%);*/
/* } */
.channels .channel:nth-child(4n+1){
    background: linear-gradient(180deg, rgba(254,235,220,1) 14%, rgba(250,166,42,1) 39%, rgba(250,171,18,1) 53%, rgba(251,172,17,1) 66%, rgba(253,194,12,1) 88%);
}
.channels .channel:nth-child(4n+2){
    background: linear-gradient(180deg, rgba(194,218,196,1) 14%, rgba(100,183,75,1) 39%, rgba(100,183,75,1) 53%, rgba(91,190,22,1) 66%, rgba(135,203,28,1) 88%);
}
.channels .channel:nth-child(4n+3){
    background: linear-gradient(180deg, rgba(196,204,217,1) 14%, rgba(102,144,184,1) 39%, rgba(46,124,173,1) 53%, rgba(48,131,183,1) 66%, rgba(111,190,223,1) 88%);
}


.channels .channel:hover{
    color: #303030;
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
        margin-left: 0px;
    }
    section .v{
        width: 100%;
        /*margin: 0px;*/
    }

    section .s{
        display: block;
        position: fixed;
        top: 0px;
        right: 0px;
        height: 60vh;
        width: 100%;
        border-radius: 0px;
    }

    .channels{
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
    }

    .channels .channel{
        transform: scale(0.8);
        margin-left: 2px;
        margin-right: 2px;
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