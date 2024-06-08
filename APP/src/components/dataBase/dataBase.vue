<template>
   <div class="data">
      <LoadData :type="type" @loaded="loadHandler" :upadate="reloadKey"/>
      <div :class="{ disabled: !data}" style="display: flex;">
         <textarea class="form-control"  placeholder="Equipment name" v-model="filename" style="line-height: 1;"></textarea>
         <SaveData :data="data" :type="type" @data-saved="dataSavedHandler" :filename="filename"/>
      </div>
      
   </div>
</template>

<script>
import { FadeTransition } from "vue2-transitions";
import LoadData from "./loadData.vue";
import SaveData from "./saveData.vue";

export default {
   components: {
      FadeTransition,
      LoadData,
      SaveData
   },
   props: {
      type: String,
      data: Object,
   },
   data(){
      return {
         filename: 'Equipment',
         reloadKey: 0,
      }
   },
   mounted() {
      console.log(this.data)
   },
   methods: {
      loadHandler(data) {
         console.log("data")
         if (data) {
            this.$emit("loaded", data)
         }
      },
      dataSavedHandler() {
         this.reloadKey++; 
      }
   }
};
</script>

<style>
.data {
  display: flex;
  align-items: center;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>