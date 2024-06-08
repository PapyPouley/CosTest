export default testAudio;

var convolutionType = 'sine'; // 'sine' or 'noise'

function testAudio(equipmentType, file) {
   return new Promise((resolve, reject) => {
      let results = {};

      switch (equipmentType.toLowerCase()) {
         case 'amplifier':
            results.amplifier = {
               impulseResponse: impulseResponse(),
               frequencyResponse: frequencyResponse(),
               impedance: impedance(),
               directivity: directivity()
            }
            resolve(results);
            break;
         case 'speaker':
            results.speaker = {
               impulseResponse: impulseResponse(),
               frequencyResponse: frequencyResponse(),
               impedance: impedance(),
               directivity: directivity()
            }
            resolve(results);
            break;
         case 'room':
            results.room = {
               impulseResponse: impulseResponse(),
               frequencyResponse: frequencyResponse(),
            }
            resolve(results);
            break;
         case 'microphone':
            results.microphone = {
               impulseResponse: impulseResponse(),
               frequencyResponse: frequencyResponse(),
               impedance: impedance(),
               directivity: directivity()
            }
            resolve(results);
            break;
         case 'wave':
            (async () => {
               results.wave = { impulseResponse: await loadWave(file) };
               console.log(results.wave)
               resolve(results);
            })();
            break;
         default:
            reject(new Error('Unknown equipment type'));
            break;
      }
   });
}

function impulseResponse() {
   let labels = ["0ms", "1ms", "2ms", "3ms", "4ms", "5ms"];
   let data = Array.from({ length: labels.length }, () => Math.floor(Math.random() * 50));
   return { labels, data };
}

function frequencyResponse() {
   let labels = ["20Hz", "50Hz", "100Hz", "200Hz", "500Hz", "1kHz", "2kHz", "5kHz", "10kHz", "20kHz"];
   let data = Array.from({ length: labels.length }, () => Math.floor(Math.random() * 50));
   return { labels, data };
}

function impedance() {
   let labels = ["20Hz", "50Hz", "100Hz", "200Hz", "500Hz", "1kHz", "2kHz", "5kHz", "10kHz", "20kHz"];
   let data = Array.from({ length: labels.length }, () => (Math.random() * (9.5 - 7.5) + 7.5).toFixed(1));
   return { labels, data };
}

function directivity() {
   let labels = ["0°", "30°", "60°", "90°", "120°", "150°", "180°"];
   let data = Array.from({ length: labels.length }, () => Math.floor(Math.random() * 100));
   return { labels, data };
}

var audioCtx = null
var audioOut;

async function loadWave(file) {
   console.log(file);
   getMetadataForFileList(file);
   load_file_into_audio(file, "base_audio");
   load_file_into_audio(file, "IR");
   return await createCtx();
}


async function createReverb() {
   let convolver = audioCtx.createConvolver();

   let IR_URL = document.querySelector("audio[id='IR']").src
   console.log(document.querySelector("audio[id='IR']"))
   // load impulse response from file
   let response = await fetch(IR_URL);
   let arraybuffer = await response.arrayBuffer();
   convolver.buffer = await audioCtx.decodeAudioData(arraybuffer);

   return convolver;
}



async function createCtx() {

   if (audioCtx) {
      audioCtx.close();
   }
   audioCtx = new (window.AudioContext || window.webkitAudioContext)();
   audioOut = audioCtx.createGain();
   audioOut.connect(audioCtx.destination);

   // WHITE NOISE ===========================
   var bufferSize = 4096;
   var whiteNoise = audioCtx.createScriptProcessor(bufferSize, 1, 1);
   whiteNoise.onaudioprocess = function (e) {
      var output = e.outputBuffer.getChannelData(0);
      for (var i = 0; i < bufferSize; i++) {
         output[i] = Math.random() * 2 - 1;
      }
   }

   // SINE =================================
   const oscillator = audioCtx.createOscillator();
   oscillator.type = "sine";
   oscillator.frequency.setValueAtTime(400, audioCtx.currentTime); // value in hertz

   // FILE =====================================
   const audioElement = document.querySelector("audio[id='base_audio']");
   const track = audioCtx.createMediaElementSource(audioElement);

   // IR ===============================
   var reverb = await createReverb(); //await
   reverb.connect(audioOut);


   switch (convolutionType) {
      case "sine":
         oscillator.connect(reverb);
         oscillator.start();
         break;

      case "file":
         track.connect(reverb);
         //audioElement.play();
         break;

      case "noise":
         whiteNoise.connect(reverb);
         break;
   }

   let data = await spawn_analyser();
   console.log(data);
   return data;
}

function getMetadataForFileList(file) {
   // Not supported in Safari for iOS.
   const name = file.name ? file.name : 'NOT SUPPORTED';
   // Not supported in Firefox for Android or Opera for Android.
   const type = file.type ? file.type : 'NOT SUPPORTED';
   // Unknown cross-browser support.
   const size = file.size ? file.size : 'NOT SUPPORTED';
   console.log({ file, name, type, size });

}



function load_file_into_audio(fl, audio_id) {


   const myFileURL = window.URL.createObjectURL(fl);
   console.log(myFileURL);

   //const audioElement = document.querySelector("audio");

   try { document.querySelector("audio[id='" + audio_id + "']").remove(); } catch { console.log("nothing to remove"); }
   var audioElement = document.createElement("audio");
   audioElement.setAttribute("src", myFileURL);
   audioElement.setAttribute("id", audio_id);
   document.body.appendChild(audioElement);

}



// ======================================================== ANALYSER

async function spawn_analyser() {
   return new Promise((resolve, reject) => {

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const sampleRate = audioCtx.sampleRate;

      // Connect the source to be analysed
      //const audioElement = document.querySelector("audio[id='base_audio']");
      //track = audioCtx.createMediaElementSource(audioElement);
      audioOut.connect(analyser);

      // Créer un objet pour stocker temporairement les sommes et les comptages pour chaque x (label)
      const sums = {};
      const counts = {};

      // Récupération des données et stockage dans un tableau
      const data = [];
      function captureData() {
         analyser.getByteFrequencyData(dataArray);
         const y = Array.from(dataArray);
         const x = Array.from({ length: bufferLength }, (_, i) => i);

         const frequencies = [];
         for (let i = 0; i < bufferLength; i++) {
            const frequency = i * (sampleRate / bufferLength) + 'hz';
            frequencies.push(frequency);
         }

         // Mettre à jour les sommes et les comptages pour chaque x (label)
         for (let i = 0; i < x.length; i++) {
            if (!sums[x[i]]) {
               sums[x[i]] = 0;
               counts[x[i]] = 0;
            }
            sums[x[i]] += y[i];
            counts[x[i]]++;
         }

         // Ajouter les données non moyennées au tableau de données
         data.push({ labels: x, data: frequencies });
      }

      // Capturer les données à intervalles réguliers
      const interval = setInterval(captureData, 100); // Capturer toutes les 100 millisecondes, par exemple

      // Arrêt de la capture après un certain temps (par exemple, 1 seconde)
      setTimeout(() => {
         clearInterval(interval);

         // Calculer les moyennes pour chaque x (label)
         const averagedY = [];
         for (let label in sums) {
            averagedY.push(sums[label] / counts[label]);
         }

         // Créer les données moyennées
         const averagedData = {
            labels: Object.keys(sums).map(label => label * (sampleRate / bufferLength) + 'hz'),
            data: averagedY
         };

         resolve(averagedData); // Renvoyer les données moyennées
      }, 1000);
   });
}




/*
// Fonction pour charger un fichier audio WAV
function loadAudioFile(file, callback) {
   var reader = new FileReader();
   reader.onload = function (event) {
      var audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContext.decodeAudioData(event.target.result, function (buffer) {
         callback(buffer);
      });
   };
   reader.readAsArrayBuffer(file);
}

// Trouver la puissance de deux la plus proche
function nearestPowerOfTwo(n) {
   return Math.pow(2, Math.ceil(Math.log2(n)));
}

// Fonction pour convoluer le signal audio avec un sinus ou du bruit
function convolveAudio(buffer, type, callback) {
   var audioContext = new (window.AudioContext || window.webkitAudioContext)();
   var convolver = audioContext.createConvolver();
   var impulseResponse;

   var length = nearestPowerOfTwo(buffer.length);
   var sampleRate = audioContext.sampleRate;
   impulseResponse = new Float32Array(length);

   if (type === 'sine') {
      for (var i = 0; i < length; i++) {
         impulseResponse[i] = Math.sin(2 * Math.PI * i * 440 / sampleRate);
      }
   } else if (type === 'noise') {
      impulseResponse = generateWhiteNoise(length);
   }

   // Créer un AudioBuffer pour l'impulsion
   var impulseBuffer = audioContext.createBuffer(1, length, sampleRate);
   impulseBuffer.copyToChannel(impulseResponse, 0);

   convolver.buffer = impulseBuffer;
   var source = audioContext.createBufferSource();
   source.buffer = buffer;
   source.connect(convolver);
   convolver.connect(audioContext.destination);
   source.start();

   // Attendre la fin de la convolution
   source.onended = function () {
      var convolvedBuffer = audioContext.createBuffer(1, convolver.buffer.length, audioContext.sampleRate);
      convolvedBuffer.copyToChannel(convolver.buffer.getChannelData(0), 0);
      callback(convolvedBuffer.getChannelData(0));
   };
}

// Fonction pour calculer la FFT
function calculateFFT(data) {
   var fftSize = nearestPowerOfTwo(data.length);
   var fft = new FFT(fftSize);
   var output = fft.createComplexArray();
   fft.realTransform(output, data);
   fft.completeSpectrum(output);

   var frequencies = Array.from({ length: fftSize / 2 }, (_, i) => i);
   var magnitudes = Array.from({ length: fftSize / 2 }, (_, i) => {
      var real = output[2 * i];
      var imag = output[2 * i + 1];
      return 20*Math.log10( Math.sqrt(real * real + imag * imag));
   });

   return { data: magnitudes, labels: frequencies };
}

function generateWhiteNoise(length) {
   var whiteNoise = new Float32Array(length);
   for (var i = 0; i < length; i++) {
       var u1 = Math.random();
       var u2 = Math.random();
       var z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
       var z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
       whiteNoise[i] = z1; // Utilisez z2 si vous préférez
   }
   return whiteNoise;
}
*/