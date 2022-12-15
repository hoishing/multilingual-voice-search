var recognition;
var lang_select = document.getElementById('lang_select');
var store = chrome.storage.sync;
var default_lang = 'yue-Hant-HK';
var mic_img = document.getElementById('mic_img');

var alert_str =
  'Caution: microphone permission required.\n\
Please click on the red cross in address bar to allow it.';

lang_select.addEventListener('change', change_lang);

store.get('lang', function (data) {
  if (isEmpty(data)) {
    store.set({ lang: default_lang });
    lang_select.value = default_lang;
  } else {
    lang_select.value = data.lang;
  }
});

detect_mic_and_recognize();

function detect_mic_and_recognize() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(recognize)
    .catch(function (err) {
      mic_img.src = 'vs_still.gif';
      alert(alert_str);
    });
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function recognize() {
  var query_str;
  if (recognition != null) {
    recognition.abort();
  }
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  mic_img.src = 'vs.gif';

  recognition.onresult = function (event) {
    var result = event.results[event.results.length - 1];
    query_str = result[result.length - 1].transcript;
  };

  // speech error handling
  recognition.onerror = function (event) {
    console.log('error', event);
  };

  recognition.onend = function () {
    // console.log("end recognition");
    if (query_str != null) {
      var url =
        'https://www.google.com/search?q=' + encodeURIComponent(query_str);
      chrome.tabs.update(null, { url: url });
    }
  };

  recognition.lang = lang_select.value;
  recognition.start();
}

function change_lang() {
  store.set({ lang: lang_select.value });
  detect_mic_and_recognize();
}
