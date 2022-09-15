<template>
  <div>
    <h1>选择电影</h1>
    <MovieList />
  </div>
</template>

<script>
import MovieList from '@/views/front/select_movie/MovieList/index.vue'
export default {
  name: 'SelectMovie',
  components: {
    MovieList
  }
}
</script>

<style>

</style>
