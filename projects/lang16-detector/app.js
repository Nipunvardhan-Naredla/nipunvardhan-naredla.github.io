/**
 * Language detection demo — runs the ONNX model entirely in the browser.
 * Uses onnxruntime-web (loaded from CDN in index.html).
 */
const MAX_LENGTH = 15;

let tokenizer = null;
let classes = null;
let session = null;
let modelReady = false;

const inputEl = document.getElementById("text-input");
const detectBtn = document.getElementById("detect-btn");
const resultEl = document.getElementById("result");
const statusEl = document.getElementById("status");
const confidenceEl = document.getElementById("confidence");

const LANGUAGE_NAMES = {
  ca: "Catalan",
  da: "Danish",
  de: "German",
  el: "Greek",
  en: "English",
  eo: "Esperanto",
  es: "Spanish",
  fi: "Finnish",
  fr: "French",
  hu: "Hungarian",
  it: "Italian",
  la: "Latin",
  nl: "Dutch",
  pt: "Portuguese",
  sv: "Swedish",
  zh: "Chinese",
};

async function loadVocab() {
  const res = await fetch("model/vocab.txt");
  if (!res.ok) {
    throw new Error(`Failed to load vocab.txt (${res.status})`);
  }
  const text = await res.text();
  const lines = text.split(/\r?\n/);
  // vocab.txt is 1-indexed: line 1 -> id 0
  const vocab = new Map();
  for (let i = 0; i < lines.length; i++) {
    const token = lines[i];
    if (token.length > 0) {
      vocab.set(token, i);
    }
  }
  return vocab;
}

async function loadClasses() {
  const res = await fetch("model/classes.json");
  if (!res.ok) {
    throw new Error(`Failed to load classes.json (${res.status})`);
  }
  return res.json();
}

async function loadModel() {
  const res = await fetch("model/language_detection_model.onnx");
  if (!res.ok) {
    throw new Error(`Failed to load model (${res.status})`);
  }
  const arrayBuffer = await res.arrayBuffer();
  session = await ort.InferenceSession.create(arrayBuffer, {
    executionProviders: ["wasm"],
  });
}

async function init() {
  try {
    statusEl.textContent = "Loading tokenizer…";
    const vocab = await loadVocab();
    tokenizer = new WordPieceTokenizer(vocab);

    statusEl.textContent = "Loading classes…";
    classes = await loadClasses();

    statusEl.textContent = "Loading model (this may take a moment)…";
    await loadModel();

    modelReady = true;
    statusEl.textContent = "Ready — enter text and click Detect Language.";
    detectBtn.disabled = false;
  } catch (err) {
    console.error(err);
    statusEl.textContent = `Error: ${err.message}`;
  }
}

async function detectLanguage() {
  const text = inputEl.value.trim();
  if (!text) {
    resultEl.textContent = "Please enter some text.";
    confidenceEl.textContent = "";
    return;
  }

  detectBtn.disabled = true;
  statusEl.textContent = "Detecting…";

  try {
    const ids = tokenizer.encode(text, MAX_LENGTH);
    const inputTensor = new ort.Tensor(
      "int64",
      BigInt64Array.from(ids, BigInt),
      [1, MAX_LENGTH]
    );

    const outputs = await session.run({ input_ids: inputTensor });
    const logits = outputs.logits.data; // Float32Array, shape [1, 16]

    let bestIdx = 0;
    for (let i = 1; i < logits.length; i++) {
      if (logits[i] > logits[bestIdx]) {
        bestIdx = i;
      }
    }

    const langCode = classes[String(bestIdx)];
    const name = LANGUAGE_NAMES[langCode] || langCode;

    // Softmax over logits for a confidence score
    const maxLogit = logits[bestIdx];
    let sum = 0;
    for (let i = 0; i < logits.length; i++) {
      sum += Math.exp(logits[i] - maxLogit);
    }
    const confidence = Math.exp(logits[bestIdx] - maxLogit) / sum;

    resultEl.textContent = `${name} (${langCode})`;
    confidenceEl.textContent = `Confidence: ${(confidence * 100).toFixed(1)}%`;
    statusEl.textContent = "Done.";
  } catch (err) {
    console.error(err);
    resultEl.textContent = "Detection failed.";
    confidenceEl.textContent = "";
    statusEl.textContent = `Error: ${err.message}`;
  } finally {
    detectBtn.disabled = false;
  }
}

detectBtn.addEventListener("click", detectLanguage);
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    detectLanguage();
  }
});

init();