<template>
  <div>
    <calendar
      first-day='5'
      start-year="2012"
      end-year="2030"
      @changeMonth="changeMonth"
      @changeYear="changeYear"
    >
    </calendar>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        
      }
    },
    methods : {
      'changeMonth' (start, end, current) {
        console.log('changeMonth', start.format(), end.format(), current.format())
      },
      'changeYear' (current) {
        console.log(current.format());
      }
    },
    components : {
      'calendar' : require('src/calendar.vue')
    }
  }
</script>
<style>
  .app{
    color:green;
  }
</style>