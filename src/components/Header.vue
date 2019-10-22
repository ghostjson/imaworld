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
                <router-link to="/logout">logout</router-link>
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

    }
}
</script>

<style scoped>
header{
    height: 70px;
    display: flex;
    justify-content: space-between;
    color: #303030;
    font-size: 1.2em;
    font-weight: bold;
}

header img{
    width: 100px;
    line-height: 70px;
}

header .routes{
    display: flex;
}

header .routes div{
    margin: 0 20px;
    line-height: 70px;
}



</style>