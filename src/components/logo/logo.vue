<script setup lang="ts">
defineProps({
  fillColor: {
    type: String,
    default: 'currentColor',
  },
})
</script>

<template>
<div>
    <svg id="Laag_1" :class="fillColor"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         viewBox="0 0 1080 1080">
        <path d="M695.9,313.3l-19.2-33.6l-42.1-5.2l-203.9-25.4L336.8,416L99.3,604.6l440.7,225.8l440.8-225.8L763.9,432.3L695.9,313.3z
           M654.5,386.9L682,435l-65.9,20.2L654.5,386.9z M540.1,749L232.5,591.4L393,463.9L470,327l126.1,15.7L464,577.6l264.3-81l119.3,94.8
          L540.1,749z"/>
    </svg>
</div>
</template>
