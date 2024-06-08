<template>
   <div>
      <div style="display: flex;">
         <h1>Test audio by external file : </h1>
         <input class="form-control" type="file" id="formFile" @change="changeHandler">
      </div>
      <card type="chart" v-if="testResults">
         <template slot="header">
            <h5 class="card-category">Impulse Response</h5>
            <h2 class="card-title">Impulse Response</h2>
         </template>
         <div class="chart-area">
            <line-chart style="height: 100%" :chart-data="testResults.impulseResponse" :extra-options="chartOptions" />
         </div>
      </card>
   </div>
</template>

<script>
import LineChart from "@/components/Charts/LineChart";
import testAudio from '../TestScript/TestAudio';

export default {
   components: {
      LineChart
   },
   data() {
      return {
         file: null,
         audioContext: null,
         audioBuffer: null,
         testResults: null,
         chartOptions: {
            responsive: true,
            maintainAspectRatio: false,
         },
      }
   },
   methods: {
      async changeHandler(event) {
         const file = event.target.files[0];
         console.log(file)
         if (file) {
            let results = await testAudio("wave", file);
            console.log("res",results.wave)
            this.printGraph(results.wave)
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
               }
            }
         }
      }
   }
}
</script>
