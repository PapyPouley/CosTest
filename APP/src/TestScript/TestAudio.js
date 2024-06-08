
export default testAudio;

function testAudio(equipmentType){
   let results = {
   };

   let resultFormat = {
      labels: [],
      data: [],
      type: '',
   }
   switch (equipmentType.toLowerCase()) {
      case 'amplifier':
         results.amplifier = {
            impulseResponse: impulseResponse(),
            frequencyResponse: frequencyResponse(),
            impedance: impedance(),
            directivity: directivity()
         }
         break;
      case 'speaker':
         results.speaker = {
            impulseResponse: impulseResponse(),
            frequencyResponse: frequencyResponse(),
            impedance: impedance(),
            directivity: directivity()
         }
         break;
      case 'room':
         results.room = {
            impulseResponse: impulseResponse(),
            frequencyResponse: frequencyResponse(),
         }
         break;  
      case 'microphone':
         results.microphone = {
            impulseResponse: impulseResponse(),
            frequencyResponse: frequencyResponse(),
            impedance: impedance(),
            directivity: directivity()
         }
         break; 
      default:
         break;
   }
   return results;
}

function impulseResponse() {
   let labels = ["0ms", "1ms", "2ms", "3ms", "4ms", "5ms"];
   let data = Array.from({length: labels.length}, () => Math.floor(Math.random() * 50));
   return {labels, data};
}

function frequencyResponse() {
   let labels = ["20Hz", "50Hz", "100Hz", "200Hz", "500Hz", "1kHz", "2kHz", "5kHz", "10kHz", "20kHz"];
   let data = Array.from({length: labels.length}, () => Math.floor(Math.random() * 50));
   return {labels, data};
}

function impedance() {
   let labels = ["20Hz", "50Hz", "100Hz", "200Hz", "500Hz", "1kHz", "2kHz", "5kHz", "10kHz", "20kHz"];
   let data = Array.from({length: labels.length}, () => (Math.random() * (9.5 - 7.5) + 7.5).toFixed(1));
   return {labels, data};
}

function directivity() {
   let labels = ["0°", "30°", "60°", "90°", "120°", "150°", "180°"];
   let data = Array.from({length: labels.length}, () => Math.floor(Math.random() * 100));
   return {labels, data};
}
