<template>
   <div>
      <base-dropdown tag="li" title-tag="a" class="nav-item load" menu-classes="dropdown-navbar">
         <a slot="title" href="#" class="dropdown-toggle nav-link" data-toggle="dropdown" aria-expanded="true">
            <div class="photo">
               <img src="@/assets/icons/download.png"/>
            </div>
            <b class="caret d-none d-lg-block d-xl-block"></b>
         </a>
         <li v-if="data" v-for="data in data" :key="data" class="nav-link">
            <a href="#" :class="['nav-item dropdown-item']" @click="handleLoadClick(data)">
               {{ data }}
            </a>
         </li>
      </base-dropdown>
   </div>
</template>

<script>
export default {
   name: 'LoadData',
   props: {
      type: [String],
      upadate: Number,
   },
   watch: {
      upadate(){
         this.loadData();
      }
   },
   data() {
      return {
         data: null
      };
   },
   mounted() {
      this.loadData();
   },
   methods: {
      loadData() {
         const storedData = localStorage.getItem("register");
         if (storedData) {
            try {
               // Essayer de parser les données JSON
               this.data = JSON.parse(storedData);
            } catch (e) {
               console.error('Erreur de parsing des données JSON:', e);
               this.data = storedData; // Si ce n'est pas du JSON, on le laisse tel quel
            }
         } else {
            console.log('Aucune donnée trouvée dans le localStorage');
         }
      },
      handleLoadClick(data) {
         const storedData = localStorage.getItem(data);
         if (storedData) {
            try {
               let dataLoaded = JSON.parse(storedData);
               if (dataLoaded) {
                  this.$emit('loaded', dataLoaded);
                  console.log(dataLoaded);
               }
            } catch (e) {
               console.error('Erreur de parsing des données JSON:', e);
               this.data = storedData; // Si ce n'est pas du JSON, on le laisse tel quel
            }
         } else {
            console.log('Aucune donnée trouvée dans le localStorage');
         }
         
      }
   }
};
</script>

<style scoped>
.photo {
   width: 34px;
   height: 34px;
   overflow: hidden;
   float: left;
   z-index: 5;
   margin-right: 10px;
   margin-left: 23px;
}

.load {
   display: flex;
}
</style>