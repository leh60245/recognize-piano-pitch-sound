import * as tf from "@tensorflow/tfjs";

const MODEL_PATH = 'https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4';
let movenet = undefined;

export async function loadAndRunModel() {
    movenet = await tf.loadGraphModel(MODEL_PATH);

    let exampleInputTensor = tf.zeros([1, 192, 192, 3], 'int32');

    let tensorOutput = movenet.predict(exampleInputTensor);
    let arrayOutput = await tensorOutput.array();

    console.log(arrayOutput);
}
