<template>
   <div class="room">
      <div class="header-row">
         <h1>Room Test Results</h1>
         <div class="image" @click="runTest">
            <div class="di">
               <img src="@/assets/icons/Run.png" class="img" />
            </div>
            <p>Run</p>
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

export default {
   components: {
      LineChart,
   },
   data() {
      return {
         type: ["", "info", "success", "warning", "danger"],
         testResults: null,
         chartOptions: {
            responsive: true,
            maintainAspectRatio: false,
         },
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
      runTest() {
         let resConnection = connectCOMPort(this.$globals.Port);
         if (resConnection.error) {
            this.notifyVue('top', 'center', resConnection.message);
         } else {
            let results = testAudio("room");
            //  Print the results
            this.testResults = {
               impulseResponse: {
                  labels: results.room.impulseResponse.labels,
                  datasets: [
                     {
                        label: "Impulse Response",
                        data: results.room.impulseResponse.data,
                        borderColor: "#42b983",
                        fill: false,
                     },
                  ],
               },
               frequencyResponse: {
                  labels: results.room.frequencyResponse.labels,
                  datasets: [
                     {
                        label: "Frequency Response",
                        data: results.room.frequencyResponse.data,
                        borderColor: "#f87979",
                        fill: false,
                     },
                  ],
               }
            };
         }
      },
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
.room {
   text-align: center;
}

.header-row {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 20px;
}

.image {
   cursor: pointer;
}

button {
   margin: 20px 0;
}
</style>