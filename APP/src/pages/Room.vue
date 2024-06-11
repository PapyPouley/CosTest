<template>
   <div class="amplifier">
      <div class="header-row">
         <h1 class="header-text">Room Test Results</h1>
         <div class="image" @click="runTest">
            <img src="@/assets/icons/Run.png" class="img" />
            <p>Run</p>
         </div>
         <div class="data">
            <dataBase :data="results" type="room" @loaded="loadHandler" />
         </div>
      </div>
      <div v-if="testResults">
         <div class="row">
            <div class="col-md-6 col-12">
               <card type="chart">
                  <template slot="header">
                     <h5 class="card-category">Impulse Response</h5>
                     <h2 class="card-title">Impulse Response</h2>
                  </template>
                  <div class="chart-area">
                     <line-chart style="height: 100%" :chart-data="testResults.impulseResponse"
                        :extra-options="chartOptions" />
                  </div>
               </card>
            </div>
            <div class="col-md-6 col-12">
               <card type="chart">
                  <template slot="header">
                     <h5 class="card-category">Frequency Response</h5>
                     <h2 class="card-title">Frequency Response</h2>
                  </template>
                  <div class="chart-area">
                     <line-chart style="height: 100%" :chart-data="testResults.frequencyResponse"
                        :extra-options="chartOptions" />
                  </div>
               </card>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import NotificationTemplate from "./Notifications/NotificationTemplate";
import LineChart from "@/components/Charts/LineChart";
import testAudio from "../TestScript/TestAudio";
import DataBase from "../components/dataBase/dataBase.vue";

export default {
   components: {
      LineChart,
      DataBase
   },
   data() {
      return {
         type: ["", "info", "success", "warning", "danger"],
         testResults: null,
         chartOptions: {
            responsive: true,
            maintainAspectRatio: false,
         },
         results: null
      };
   },
   methods: {
      notifyVue(verticalAlign, horizontalAlign, message) {
         this.$notify({
            component: NotificationTemplate,
            icon: "tim-icons icon-bell-55",
            horizontalAlign: horizontalAlign,
            verticalAlign: verticalAlign,
            type: this.type[4],
            message: message,
            timeout: 5000,
         });
      },
      async runTest() {
         let resConnection = connectCOMPort(this.$globals.Port);
         if (resConnection.error) {
            this.notifyVue('top', 'center', resConnection.message);
         } else {
            let results = await testAudio("room");
            this.results = results;
            //  Print the results
            this.printGraph(this.results.room)
         }
      },
      printGraph(results) {
         if (results) {
            this.testResults = {
               impulseResponse: {
                  labels: results.impulseResponse.labels,
                  datasets: [
                     {
                        label: "Impulse Response",
                        data: results.impulseResponse.data,
                        borderColor: "#42b983",
                        fill: false,
                     },
                  ],
               },
               frequencyResponse: {
                  labels: results.frequencyResponse.labels,
                  datasets: [
                     {
                        label: "Frequency Response",
                        data: results.frequencyResponse.data,
                        borderColor: "#f87979",
                        fill: false,
                     },
                  ],
               }
            };
         }
      },
      loadHandler(data) {
         console.log("Amp")
         this.results = data.data;
         this.printGraph(this.results)
      }
   },
};
function connectCOMPort(Port) {
   if (Port.toLowerCase() === 'simulate') {
      return { message: `Room testing device on Port: ${Port} connected!`, error: false };
   }
   else
      return { message: `Room testing device on Port: ${Port} can not be connected!`, error: true };
}
</script>

<style scoped>

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  width: 100%;
}

.header-text {
  margin: 0;
}

.image {
  cursor: pointer;
  margin: 0 auto;
  text-align: center;
}

</style>