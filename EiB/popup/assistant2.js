window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const synth = window.speechSynthesis;
const recognition = new SpeechRecognition();
document.getElementById("listen").addEventListener("click", listen);

var gif = document.getElementById("listen")
// let paragraph = document.createElement('p');
// let container = document.querySelector('.text-box');
// container.appendChild(paragraph);

                        //      youtube     //


function listen() {
    recognition.start();
    recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        alert(speechToText);

        // paragraph.textContent = speechToText;
        var speechToTextLower = speechToText.toLowerCase();
        alert(speechToTextLower);
        var txt = speechToTextLower.split("and");
        var text = txt.join("");
        //console.log(text);
        txt = text.split(" ");
        if(speechToTextLower.includes("open")){
           
           for(var i = 0;i<txt.length;i++){
               if(txt[i] != 'open' && txt[i] != ""){
                   open(txt[i],speechToTextLower);
               }
           }
           //open(txt);
           //chrome.tabs.create({'url': "https://www.google.com", 'selected': false});
        }
        function open(txt,speechToTextLower) {
            speak("Opening " + txt);
            xmlHttp = new XMLHttpRequest();
            xmlHttp.responseType = "document"
            xmlHttp.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200){
                    // this.responseType = "document"
                    var documentHTML = this.response;
                    console.log(documentHTML);
                    // console.log(documentHTML.div.r[0].ref);
                    rList = documentHTML.getElementsByClassName('r');
                    chrome.tabs.create({'url': ""+rList[0].firstChild.href, 'selected': false});
                }
            };
            xmlHttp.open("GET","https://www.google.com/search?client=firefox-b-d&q="+txt);
            xmlHttp.send();
        }

        if(speechToTextLower.includes("meaning of")){
            searchString = speechToTextLower.slice(11);
            xmlHttp = new XMLHttpRequest();
            xmlHttp.responseType = "json";
            xmlHttp.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200){
                    // this.responseType = "document"
                    var wordDesc = jQuery.parseJSON(JSON.stringify(this.response));
                    console.log(this.responseTest)
                    var meaning = wordDesc[0].def[0].sseq[0][0][1].dt[0][1];
                    var synonyms = wordDesc[0].meta.syns[0];
                    // alert(meaning);
                    speak(searchString+" is " + meaning)
                    speak(" and a few synonyms are ");
                    for(i = 0; i < synonyms.length; i++) speak(synonyms[i]);
                    // console.log(wordDesc);
                }
            };
            xmlHttp.open("GET", "https://dictionaryapi.com/api/v3/references/thesaurus/json/" + searchString + "?key=71810ae0-a16f-45b8-94bb-91f19148b345");
            xmlHttp.send();
        }

        if(speechToTextLower.includes("youtube")){
            $.get(
                "https://www.googleapis.com/youtube/v3/search", {
                    part:  'snippet, id',
                    q: "Ride",
                    type: 'video',
                    key: "AIzaSyAcs1k_I1W1OcErEOJypzx97vW2Pc7N2rE"},
                    function(data){
                        alert(data.items[0].id.videoId);
                        chrome.tabs.create({'url': "https://www.youtube.com/watch?v="+data.items[0].id.videoId, 'selected': false});
                    }
            );
        }
    }
}
const speak = (text) => {
    var utterThis = new SpeechSynthesisUtterance(text);
    synth.voice = (synth.getVoices())[0];
    synth.speak(utterThis);
};