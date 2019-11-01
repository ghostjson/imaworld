<template>

<div class="bar">
<div class="search-results">
    <div class="search-results-block">
        <div class="thumbnail">
            <img src="http://i3.ytimg.com/vi/erLk59H86ww/maxresdefault.jpg">
        </div>
        <div class="details">
            <div class="heading">Heading Heading Heading sadf f ahsj lkjlkfjaslkdjfkl asdflk jsldkjf  lksjdflkjsaldkfjlksajdfl kjsdlk fjs</div>
            <div>
                <span class="icons">
                    <img :src="require('@/assets/icons/play-button.svg')">
                </span>
                <span class="icons">
                    <img :src="require('@/assets/icons/add-button.svg')">
                </span>
            </div>
        </div>
    </div>
</div>
</div>

</template>




<script>
export default{

};
</script>



<style scoped>

.bar{
    width: 360px;
    height: 500px;
    overflow: auto;
}

.search-results{
    width: 100%;
    background: green;
}
.search-results 
.search-results-block{
    background: gray;
    display: flex;
    padding: 5px;
    height: 88px;
}

.details{
    margin: 3px;
}

.heading{
    font-size: 1.1em;
    font-weight: bold;
    height: 60.3px;
    overflow: hidden;
}

.search-results 
.search-results-block
.thumbnail img{
    width: 150px;
}

.icons img{
    padding-left: 10px;
    padding-top: 5px;
    width: 20px;
}
</style>