<template>
   <div>
      <div style="display: flex;">
         <h1>Test audio by external file : </h1>
         <input class="form-control" type="file" id="formFile" @change="changeHandler">
      </div>
      <div>
         <div class="card">
            <div class="card-header">
               <h5 class="card-category">Impulse Response</h5>
               <h2 class="card-title">Impulse Response</h2>
            </div>
            <div class="card-body">
               <canvas id="logChartGraph" style="height: 400px;"></canvas>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import testAudio from '../TestScript/TestAudio.js';
import Chart from "chart.js";

export default {
   data() {
      return {
         file: null, // Change const to let
         audioContext: null,
         audioBuffer: null,
         testResults: null,
         chartOptions: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
               x: {
                  type: 'logarithmic',
                  display: true,
                  title: {
                     display: true,
                     text: 'Frequency (Hz)'
                  }
               },
               y: {
                  type: 'linear',
                  display: true,
                  title: {
                     display: true,
                     text: 'Amplitude'
                  }
               }
            }
         }
      }
   },
   methods: {
      async changeHandler(event) {
         const file = event.target.files[0];
         if (file) {
            let results = await testAudio("wave", file);
            console.log(results.wave.impulseResponse.labels)
            this.printGraph(results.wave);
         }
      },
      printGraph(results) {
         try {
            if (results) {
               let logChartCanvas = document.getElementById("logChartGraph").getContext("2d");
               if (logChartCanvas) {
                  this.testResults = new Chart(logChartCanvas, {
                     type: 'line',
                     data: {
                        labels: results.impulseResponse.labels,
                        datasets: [
                           {
                              label: "Impulse Response",
                              data: results.impulseResponse.data,
                              borderColor: "#42b983",
                              fill: false,
                              borderWidth: 1,
                           }
                        ],
                     },
                     options: {
                        responsive: true,
                        interaction: {
                           mode: 'index',
                           intersect: false,
                        },
                        stacked: false,
                        plugins: {
                           title: {
                              display: true,
                              text: 'fevfe',
                           },
                        },
                        scales: {
                           xAxes: [{
                              type: 'logarithmic',
                              display: true,
                              title: {
                                 display: true,
                                 text: 'Frequency (Hz)'
                              }
                           }],
                           yAxes: [{
                              type: 'linear',
                              display: true,
                              title: {
                                 display: true,
                                 text: 'Amplitude'
                              }
                           }]
                        },
                     },
                  });
               }
            }
         } catch (error) {
            console.log("Error rendering chart:", error)
         }

      }
   }
}
</script>