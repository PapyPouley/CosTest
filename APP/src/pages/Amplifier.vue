<template>
   <div class="amplifier">
      <div class="header-row">
         <h1>Amplifier Test Results</h1>
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
            <div class="col-md-6 col-12">
               <card type="chart">
                  <template slot="header">
                     <h5 class="card-category">Impedance</h5>
                     <h2 class="card-title">Impedance</h2>
                  </template>
                  <div class="chart-area">
                     <line-chart style="height: 100%" :chart-data="testResults.impedance"
                        :extra-options="chartOptions" />
                  </div>
               </card>
            </div>
            <div class="col-md-6 col-12">
               <card type="chart">
                  <template slot="header">
                     <h5 class="card-category">Directivity</h5>
                     <h2 class="card-title">Directivity</h2>
                  </template>
                  <div class="chart-area">
                     <line-chart style="height: 100%" :chart-data="testResults.directivity"
                        :extra-options="chartOptions" />
                  </div>
               </card>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import LineChart from "@/components/Charts/LineChart";

export default {
   components: {
      LineChart,
   },
   data() {
      return {
         testResults: null,
         chartOptions: {
            responsive: true,
            maintainAspectRatio: false,
         },
      };
   },
   methods: {
      runTest() {
         // Simulate test results
         this.testResults = {
            impulseResponse: {
               labels: ["0ms", "1ms", "2ms", "3ms", "4ms", "5ms"],
               datasets: [
                  {
                     label: "Impulse Response",
                     data: [0, 10, 5, 2, 20, 30, 45],
                     borderColor: "#42b983",
                     fill: false,
                  },
               ],
            },
            frequencyResponse: {
               labels: ["20Hz", "50Hz", "100Hz", "200Hz", "500Hz", "1kHz", "2kHz", "5kHz", "10kHz", "20kHz"],
               datasets: [
                  {
                     label: "Frequency Response",
                     data: [20, 30, 45, 60, 70, 85, 95, 100, 90, 80],
                     borderColor: "#f87979",
                     fill: false,
                  },
               ],
            },
            impedance: {
               labels: ["20Hz", "50Hz", "100Hz", "200Hz", "500Hz", "1kHz", "2kHz", "5kHz", "10kHz", "20kHz"],
               datasets: [
                  {
                     label: "Impedance",
                     data: [8, 8.2, 8.5, 8.8, 9, 8.7, 8.5, 8.3, 8.1, 8],
                     borderColor: "#3498db",
                     fill: false,
                  },
               ],
            },
            directivity: {
               labels: ["0°", "30°", "60°", "90°", "120°", "150°", "180°"],
               datasets: [
                  {
                     label: "Directivity",
                     data: [100, 90, 80, 70, 60, 50, 40],
                     borderColor: "#9b59b6",
                     fill: false,
                  },
               ],
            },
         };
      },
   },
};
</script>

<style scoped>
.amplifier {
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