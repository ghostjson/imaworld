<script>
	export default{
		created(){
        	localStorage.removeItem('Token')
        	window.location.href = '/login'
		}
	};
</script>