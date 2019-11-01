<template>
    <section class="content">
        <videoplayer class="v"></videoplayer>
        <searchvideo class="s"></searchvideo>
    </section>  
</template>

<script>

import VideoPlayer from '../components/VideoPlayer'
import SearchVideo from '../components/SearchVideo'

export default {
    name: 'design',
    components: {
        'videoplayer': VideoPlayer,
        'searchvideo': SearchVideo,
    }
};
</script>

<style scoped>

section{
	display: grid;
	grid-template-columns: 5fr 3fr;
    margin-bottom: 30px;
}

section .v{
	margin-right: 60px;
	border-radius: 10px;
	background: #303030;
}

section .s{
	background: skyblue;
    margin-bottom: 30px;
}

</style>