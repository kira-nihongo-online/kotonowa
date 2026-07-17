// ========================================
// Class Weapon
// panel.js (字幕表示対応版)
// ========================================

// ========================================
// 授業翻訳
// ========================================
let currentLanguage = "th";

async function translateText() {

  const text = document.getElementById("jpInput").value;
  const resultDiv = document.getElementById("translateResult");

  if (!text) {
   resultDiv.innerHTML = "";
   return;
  }

  const url =
   "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" + currentLanguage + "&dt=t&q=" +
    encodeURIComponent(text);

  const res = await fetch(url);
  const data = await res.json();
  const translated = data[0].map(t => t[0]).join("");

  // サイドパネル表示
  resultDiv.innerHTML = `<span class="translated">${translated}</span>`;

  // 翻訳後に自動再生
  Voice.speak(translated, currentLanguage);

  }

// ========================================
// 初期設定
// ========================================
document.addEventListener("DOMContentLoaded", function () { 

  Voice.init();


  const jpBtn = document.getElementById("jpBtn");
  const thBtn = document.getElementById("thBtn");
  const enBtn = document.getElementById("enBtn");

  function setLanguage(lang){

      currentLanguage = lang;

      jpBtn.classList.remove("active");
      thBtn.classList.remove("active");
      enBtn.classList.remove("active");

      if(lang === "ja"){
          jpBtn.classList.add("active");
      }

　    if(lang === "th"){
　      thBtn.classList.add("active");
　    }

　    if(lang === "en"){
　      enBtn.classList.add("active");
　    }

      if (recognition) {

        if (lang === "ja") {
          recognition.lang = "ja-JP";
        }

        if (lang === "th") {
          recognition.lang = "th-TH";
        }

        if (lang === "en") {
          recognition.lang = "en-US";
        }

      }

　  }

  const textarea = document.getElementById("jpInput");
  const resultDiv = document.getElementById("translateResult");
  document.getElementById("micBtn").addEventListener("click", function () {

    if (recognition) {
      recognition.start();
    }

  });

  // ===== 入力欄変更時に結果をクリア =====
  let inputTimer;

  textarea.addEventListener("input", function () {

    clearTimeout(inputTimer);

    if (!this.value) {

      resultDiv.innerHTML = "";
      return;

    }

    inputTimer = setTimeout(function () {

      translateText();

    }, 1000);

  });

  jpBtn.addEventListener("click", function () {
    setLanguage("ja");
  });

  thBtn.addEventListener("click", function () {
    setLanguage("th");
  });

  enBtn.addEventListener("click", function () {
    setLanguage("en");
  });

  setLanguage("th");

  // ===== ボタンイベント =====
  document.getElementById("translateBtn").addEventListener("click", function () {

  translateText();

});

  document.getElementById("clearBtn").addEventListener("click", function () {

    textarea.value = "";
    resultDiv.innerHTML = "";

  });

  document.getElementById("speakBtn").addEventListener("click", function () {

    const text =
      document.getElementById("translateResult").innerText.trim();

    if (!text) return;

    Voice.speak(text, currentLanguage);

  });

  // ===== Enterキーで実行 =====
  textarea.addEventListener("keydown", function(e) { if (e.key === "Enter") { e.preventDefault(); translateText(); }});

});

// ========================================
// Speech Recognition
// ========================================
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;

if (SpeechRecognition) {

  recognition = new SpeechRecognition();

  recognition.lang = "ja-JP";
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onresult = function (event) {

    const text = event.results[0][0].transcript;

    document.getElementById("jpInput").value = text;

    translateText();

  };

  recognition.onstart = function () {    

    const micBtn = document.getElementById("micBtn");

    micBtn.textContent = "🎙️";
    micBtn.classList.add("listening");

  };

  recognition.onend = function () {

    const micBtn = document.getElementById("micBtn");

    micBtn.textContent = "🎤";
    micBtn.classList.remove("listening");

  };

}

// ========================================
// Voice Controller
// ========================================
const Voice = (function () {

  let ready = false;
  let voiceJP = null;
  let voiceTH = null;
  let voiceEN = null;

  function init() {

    const setVoices = () => {

      const voices = speechSynthesis.getVoices();

      voiceJP =
        voices.find(v => v.name.includes("七海")) ||
        voices.find(v => v.lang === "ja-JP");

      voiceTH =
        voices.find(v => v.name.includes("เปรมวดี")) ||
        voices.find(v => v.lang === "th-TH");

      voiceEN =
        voices.find(v => v.name.includes("Jenny")) ||
        voices.find(v => v.lang.startsWith("en"));

      if (voiceJP || voiceTH || voiceEN) {
        ready = true;
      }

    };

    setVoices();
    speechSynthesis.onvoiceschanged = setVoices;

  }

  function speak(text, lang) {

    if (!ready || !text) return;

    const uttr = new SpeechSynthesisUtterance(text);

    if (lang === "ja") {
      uttr.lang = "ja-JP";
      if (voiceJP) uttr.voice = voiceJP;
    }

    if (lang === "th") {
      uttr.lang = "th-TH";
      if (voiceTH) uttr.voice = voiceTH;
    }

    if (lang === "en") {
      uttr.lang = "en-US";
      if (voiceEN) uttr.voice = voiceEN;
    }

    speechSynthesis.cancel();
    speechSynthesis.speak(uttr);

  }

  return {
    init,
    speak
  };

})();