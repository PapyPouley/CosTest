<template>
   <div class="save">
      <div class="photo" @click="saveData">
         <img src="@/assets/icons/upload.png" />
      </div>
   </div>
</template>

<script>
export default {
   name: 'SaveData',
   data() {
      return {
      };
   },
   props: {
      type: String,
      data: Object,
      filename: String,
   },
   methods: {
      saveData() {
         // Convertir les données en JSON et les sauvegarder dans le localStorage

         try {
            let dataToSave = {
               name: this.filename,
               data: this.data,
               type: this.type
            };

            switch (this.type.toLowerCase()) {
               case 'amplifier':
                  dataToSave.data = dataToSave.data.amplifier;
                  break;
               case 'speaker':
                  dataToSave.data = dataToSave.data.speaker;
                  break;
               case 'room':
                  dataToSave.data = dataToSave.data.room;
                  break;
               case 'microphone':
                  dataToSave.data = dataToSave.data.microphone;
                  break;
               default:
                  console.log('Default', this.type)
                  break;
            }
            console.log(dataToSave);
            const jsonData = JSON.stringify(dataToSave);
            this.filename = this.localStorageRegister(this.filename);
            if (this.filename) {
               localStorage.setItem(this.filename, jsonData);
               console.log('Data saved!');
               this.$emit('data-saved');
            }
            else {
               console.error("Error on the filename");
            }
         } catch (e) {
            console.error("Error canno't saved the data:", e);
         }
      },
      localStorageRegister(name) {
         const storedData = localStorage.getItem("register");
         if (storedData) {
            try {
               // Essayer de parser les données JSON
               let data = JSON.parse(storedData);
               if (data) {
                  if (data.includes(name)) {
                     let index = 1;
                     let newName = `${name}(${index})`;

                     while (data.includes(newName)) {
                        index++;
                        newName = `${name} (${index})`;
                     }

                     name = newName;
                  }
                  data.push(name);
               }
               try {
                  const jsonData = JSON.stringify(data);
                  localStorage.setItem('register', jsonData);
                  return name;
               } catch (error) {
                  console.error('Erreur lors de la mise à jour du registre:', error);
               }
            } catch (e) {
               console.error('Erreur de parsing des données JSON:', e);
               this.data = storedData; // Si ce n'est pas du JSON, on le laisse tel quel
            }
         } else {
            console.log('Aucune donnée dont la clée est register dans le local storage');
            console.log('Création du registre.');

            let data = [];
            data.push(name)
            try {
               const jsonData = JSON.stringify(data);
               localStorage.setItem('register', jsonData);
               return name
            } catch (error) {
               console.error('Erreur lors de la mise à jour du registre:', error);
            }

         }
         return null;
      }
   }
};

</script>

<style scoped>
.image {
   cursor: pointer;
}

.photo {
   width: 34px;
   height: 34px;
   overflow: hidden;
   float: left;
   z-index: 5;
   margin-right: 10px;
   margin-left: 23px;
}

.save {
   display: flex;
   width: 40%;
   vertical-align: middle;
}
</style>