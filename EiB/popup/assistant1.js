window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const synth = window.speechSynthesis;
const recognition = new SpeechRecognition();
document.getElementById("listen").addEventListener("click", listen);

var gif = document.getElementById("listen")
// let paragraph = document.createElement('p');
// let container = document.querySelector('.text-box');
// container.appendChild(paragraph);

function listen() {
    recognition.start();
    recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        alert(speechToText);

        // paragraph.textContent = speechToText;
        var speechToTextLower = speechToText.toLowerCase();
        alert(speechToTextLower);
        if(speechToTextLower.includes("google")){
            speak("Opening Google");
            chrome.tabs.create({'url': "https://www.google.com", 'selected': false});
        }
        if(speechToTextLower.includes("youtube")){
            speak("Opening Youtube");
            chrome.tabs.create({'url': "https://www.youtube.com", 'selected': false});
        }
        if(speechToTextLower.includes("close")){
            chrome.windows.getAll({ populate: true }, function(windowList) {
                tabs = {};
                tabIds = [];
                for (var i = 0; i < windowList.length; i++) {
                  for (var j = 0; j < windowList[i].tabs.length; j++) {
                    tabIds[tabIds.length] = windowList[i].tabs[j].url;
                    tabs[windowList[i].tabs[j].id] = windowList[i].tabs[j];
                  }
                }
                alert(tabs);
                alert(tabIds);
              });
            // for(i = 0; i < tabs.length; i++){
            //     listTabs = chrome.Window.tabs
            // }
        }
        
        if(speechToTextLower.includes("hello")){
            xmlHttp = new XMLHttpRequest();
            xmlHttp.responseType = "document"
            xmlHttp.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200){
                    // this.responseType = "document"
                    var documentHTML = this.response;
                    console.log(documentHTML);
                    // console.log(documentHTML.div.r[0].href);
                    rList = documentHTML.getElementsByClassName('r');
                    console.log(rList[0].firstChild.href);
                }
            };
            xmlHttp.open("GET","https://www.google.com/search?client=firefox-b-d&q=geeksforgeeks");
            xmlHttp.send();
        }
        // speak(speechToText);
    }
}

const speak = (text) => {
	var utterThis = new SpeechSynthesisUtterance(text);
	synth.speak(utterThis);
};