<template>
  <div :class="[CLASS.colContainer]">
    <slot
      :name="SLOT.beforeCol"
      :models="models"
    />
    <!-- COLUMN -->
    <div
      :class="[
        CLASS.col,
        models[0],
        classes.col,
      ]"
    >
      <slot :name="SLOT.beforeComponent(models[0])" />
      <!-- COMPONENT -->
      <slot />
      <!-- COMPONENT ENDS -->
      <slot :name="SLOT.afterComponent(models[0])" />
    </div>
    <!-- COLUMN ENDS -->
    <slot
      :name="SLOT.afterCol"
      :models="models"
    />
  </div>
</template>

<script>
import constants from '../mixins/constants';

export default {
  mixins: [constants],
  props: {
    models: {
      type: Array,
      required: false,
      default: () => []
    },
    classes: {
      type: Object,
      required: false,
      default: () => ({})
    }
  }
};
</script>
