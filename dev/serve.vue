<script>
import Vue from 'vue';
import FormGeneratorVue from '@/form-generator-vue.vue';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    FormGeneratorVue
  }
});
</script>

<template>
  <div id="app">
    <form-generator-vue />
  </div>
</template>
