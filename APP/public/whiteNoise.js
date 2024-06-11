// white-noise-processor.js
class WhiteNoiseProcessor extends AudioWorkletProcessor {
   process(inputs, outputs, parameters) {
       const output = outputs[0];
       for (let channel = 0; channel < output.length; ++channel) {
           const outputChannel = output[channel];
           for (let i = 0; i < outputChannel.length; ++i) {
               outputChannel[i] = Math.random() * 2 - 1;
           }
       }
       return true;
   }
}

registerProcessor('white-noise-processor', WhiteNoiseProcessor);
