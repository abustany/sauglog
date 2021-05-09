<template>
  <div class="addbutton">+</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AddButton',
  components: {
  }
})
</script>

<style>
.addbutton {
  width: 3rem;
  height: 3rem;
  font-size: 1.5rem;
  border-radius: 100%;
  background-color: var(--color-accent);
  cursor: pointer;
  box-shadow: -5px 5px 5px 0px #9E9E9E;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
