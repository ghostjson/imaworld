<template>
    <header>
        <div class="logo">
            <img src="../assets/images/logo.webp" alt="imaworld logo">
        </div>
        <div class="routes">
            <div>
                <router-link to="/">Home</router-link>
            </div>
            <div v-if="!login">
                <router-link to="/login">Login</router-link>
            </div>
            <div v-if="!login">
                <router-link to="/signup">SignUp</router-link>
            </div>
            <div v-if="login">
                <router-link to="/logout">Logout</router-link>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    name: 'app-header',
    data(){
        return {
            login: false,
        }
    },
    methods: {

    },
    mounted(){
        if(localStorage.hasOwnProperty('Token')){
            this.login = true
        }else{
            this.login = false
        }
    }
};
</script>

<style scoped>
header{
    height: 70px;
    display: flex;
    justify-content: space-between;
    color: #303030;
    font-size: 1.2em;
    font-weight: bold;
    border-bottom: 1px solid #32313142;
}

@media (max-width: 900px){
    header{
        font-size: 1em;
    }
}

header img{
    width: 100px;
    line-height: 70px;
}

header .routes{
    display: flex;
}

header .routes div{
    margin: 0 10px;
    line-height: 70px;
}

*{
    font-family: Arial, Helvetica, sans-serif;
}


</style>