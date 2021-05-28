<template>
  <div :class="[CLASS.rowContainer]">
    <slot
      :name="SLOT.beforeRow"
      :models="models"
    />
    <!-- ROW -->
    <div
      :key="i"
      :class="[CLASS.row, classes.row]"
    >
      <slot
        :name="SLOT.rowStart"
        :models="models"
      />
      <!-- COLUMN -->
      <slot />
      <!-- COLUMN ENDS -->
      <slot
        :name="SLOT.rowEnd"
        :models="models"
      />
    </div>
    <!-- ROW ENDS -->
    <slot
      :name="SLOT.afterRow"
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
