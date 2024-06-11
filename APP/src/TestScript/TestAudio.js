var convolutionType = 'noise'; // 'sine' or 'noise'

export default async function testAudio(equipmentType, file) {
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

var audioCtx = null;
var audioOut;

async function loadWave(file) {
   getMetadataForFileList(file);
   load_file_into_audio(file, "base_audio");
   load_file_into_audio(file, "IR");
   return await createCtx();
}

async function createReverb() {
   let convolver = audioCtx.createConvolver();

   let IR_URL = document.querySelector("audio[id='IR']").src;
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
   //audioOut.connect(audioCtx.destination);

   // Load the white noise processor
   await audioCtx.audioWorklet.addModule("whiteNoise.js");

   const whiteNoise = new AudioWorkletNode(audioCtx, 'white-noise-processor');

   const oscillator = audioCtx.createOscillator();
   oscillator.type = "sine";
   oscillator.frequency.setValueAtTime(400, audioCtx.currentTime); // value in hertz

   const audioElement = document.querySelector("audio[id='base_audio']");
   const track = audioCtx.createMediaElementSource(audioElement);

   var reverb = await createReverb();
   reverb.connect(audioOut);

   switch (convolutionType) {
      case "sine":
         oscillator.connect(reverb);
         oscillator.start();
         break;

      case "file":
         track.connect(reverb);
         break;

      case "noise":
         whiteNoise.connect(reverb);
         break;
   }

   let data = await spawn_analyser();
   return data;
}

function getMetadataForFileList(file) {
   const name = file.name ? file.name : 'NOT SUPPORTED';
   const type = file.type ? file.type : 'NOT SUPPORTED';
   const size = file.size ? file.size : 'NOT SUPPORTED';
   console.log({ file, name, type, size });
}

function load_file_into_audio(fl, audio_id) {
   const myFileURL = window.URL.createObjectURL(fl);

   try {
      document.querySelector("audio[id='" + audio_id + "']").remove();
   } catch {
      console.log("nothing to remove");
   }
   var audioElement = document.createElement("audio");
   audioElement.setAttribute("src", myFileURL);
   audioElement.setAttribute("id", audio_id);
   document.body.appendChild(audioElement);
}

async function spawn_analyser() {
   return new Promise((resolve, reject) => {
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const sampleRate = audioCtx.sampleRate;

      audioOut.connect(analyser);

      const sums = {};
      const counts = {};

      const data = [];
      const frequencies = [];
      function captureData() {
         analyser.getByteFrequencyData(dataArray);
         const y = Array.from(dataArray);
         const x = Array.from({ length: bufferLength }, (_, i) => i);

         for (let i = 0; i < bufferLength; i++) {
            const frequency = i * (sampleRate / (2*bufferLength));
            frequencies.push(frequency);
         }

         for (let i = 0; i < x.length; i++) {
            if (!sums[x[i]]) {
               sums[x[i]] = 0;
               counts[x[i]] = 0;
            }
            sums[x[i]] += y[i];
            counts[x[i]]++;
         }

         data.push({ labels: x, data: frequencies });
      }

      const interval = setInterval(captureData, 100);

      setTimeout(() => {
         clearInterval(interval);

         const averagedY = [];
         for (let label in sums) {
            averagedY.push(sums[label] / counts[label]);
         }
         console.log(frequencies)
         const averagedData = [];
         for (let i = 0; i < Object.keys(sums).length; i++) {
            averagedData.push({ 
               x: frequencies[i], 
               y: averagedY[i] 
            });
         }
         //console.log(averagedY)

         resolve(averagedData);
      }, 1000);
   });
}
