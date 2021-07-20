window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const synth = window.speechSynthesis;
const recognition = new SpeechRecognition();
document.getElementById("listen").addEventListener("click", listen);

var gif = document.getElementById("listen");
var speechHistory;

var tab = ['first','second','third','iv','v','vi','seventh','eighth','9th','10th','eleventh','twelfth','13th','14th','15th','16th','17th','18th','xix','xx']

chrome.storage.local.get({history: []}, function(result) {
    speechHistory = result.history;
    console.log(speechHistory);
    for (i = speechHistory.length-1; i >= 0; i--){
        var item = document.createElement("div");
        item.id = "history-item";
        var textnode = document.createTextNode(speechHistory[i]);
        item.appendChild(textnode);
        document.getElementById("history").appendChild(item);
    }
});

function listen() {
    synth.cancel();
    document.getElementById("click").src = "img/listen.gif";
    recognition.start();
    recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;

        console.log(speechHistory);
        speechHistory.push(speechToText);

        chrome.storage.local.set({history: speechHistory}, function() {
            if (chrome.runtime.error) {
                console.log("Runtime error.");
            } else{
                console.log("storing data")
            }
        });

        var item = document.createElement("div");
        item.id = "history-item";
        var textnode = document.createTextNode(speechToText);
        item.appendChild(textnode);
        document.getElementById("history").insertBefore(item, document.getElementById("history").childNodes[0]);
       
        var speechToTextLower = speechToText.toLowerCase();
        if(speechToTextLower.includes("open")){
            var txt = speechToTextLower.split("and");
            var text = txt.join("");
            txt = text.split(" ");
            for(var i = 0;i<txt.length;i++){
                if(txt[i] != 'open' && txt[i] != ""){
                    open(txt[i],speechToTextLower);
                }
            }
        }
        else if(speechToTextLower.includes("close") || speechToTextLower.includes("book")){
            var tabs = {};
            var tabIds = [];
            var tabUrls = [];
            chrome.windows.getAll({ populate: true }, function(windowList) {
                for (var i = 0; i < windowList.length; i++) {
                  for (var j = 0; j < windowList[i].tabs.length; j++) {
                    tabUrls[tabUrls.length] = windowList[i].tabs[j].url;
                    tabIds[tabIds.length] = windowList[i].tabs[j].id;
                    tabs[windowList[i].tabs[j].id] = windowList[i].tabs[j];
                  }
                }
                var words = speechToTextLower.split(" ");
                var len = words.length;
                var word = words[len-2];
                var index = tab.indexOf(word);
                if(speechToTextLower.includes("book") && speechToTextLower.includes("all")){
                    speak("Bookmarking all the tabs");
                    for(var i = 0;i<tabUrls.length;i++){
                        var id = tabUrls[i];
                        chrome.bookmarks.create({'url': ""+id});
                    }
                }
                else if(speechToTextLower.includes("book")){
                    speak("Bookmarking the mentioned tab");
                    var id = tabUrls[index];
                    chrome.bookmarks.create({'url': ""+id});
                }
                if(speechToTextLower.includes("close") && (speechToTextLower.includes("browser") || speechToTextLower.includes("all"))){
                    for(var i=0;i<tabIds.length;i++){
                        var id = tabIds[i];
                        chrome.tabs.remove(id);
                    }
                }
                else if(speechToTextLower.includes("close") && speechToTextLower.includes("current")){
                    window.close();
                }
                else if(speechToTextLower.includes("close")){
                    var id = tabIds[index];
                    chrome.tabs.remove(id);
                }
            });
        }
        else if(speechToTextLower.includes("play")){
            var speechmusic = speechToTextLower;
            var words2 = speechmusic.substring(5);
            speak("Playing " + words2 + " on youtube");
            $.get(
                "https://www.googleapis.com/youtube/v3/search", {
                part: 'snippet, id',
                q: words2,
                type: 'video',
                key: "AIzaSyAcs1k_I1W1OcErEOJypzx97vW2Pc7N2rE"},
                function(data){
                    chrome.tabs.create({'url': "https://www.youtube.com/watch?v="+data.items[0].id.videoId, 'selected': false});
                }
            );
        }

        

        else if(speechToTextLower.includes("weather")){
            var apikey= "11095b06efd4976167c14107eef15c03";
            var city=speechToTextLower.substring(11);
            $.get(
                "http://api.openweathermap.org/data/2.5/weather", {
                    q: city,
                    appid: apikey },
                    function(data) {
                    var a=data.main.temp-273.15;
                    var b=data.main.temp_max-273.15;
                    var c=data.main.temp_min-273.15;
                    var d=data.wind.speed;
                    console.log(data);
                    var speakString = city+" temperature is "+a.toFixed(2)+" degree celsius, maximum temperature is "+b.toFixed(2)+" degree celsius, minimum temperature is "+c.toFixed(2)+" degree celsius, and wind speed is "+d.toFixed(2)
                    speak(speakString);
                    console.log(speakString);
                }
            );
        }
        else if(speechToTextLower.includes("meaning of")){
            searchString = speechToTextLower.slice(11);
            xmlHttp = new XMLHttpRequest();
            xmlHttp.responseType = "json";
            xmlHttp.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200){
                    var wordDesc = jQuery.parseJSON(JSON.stringify(this.response));
                    console.log(this.responseTest)
                    var meaning = wordDesc[0].def[0].sseq[0][0][1].dt[0][1];
                    var synonyms = wordDesc[0].meta.syns[0];
                    speak(searchString+" is " + meaning)
                    speak(" and a few synonyms are ");
                    for(i = 0; i < synonyms.length; i++) speak(synonyms[i]);
                }
            };
            xmlHttp.open("GET", "https://dictionaryapi.com/api/v3/references/thesaurus/json/" + searchString + "?key=71810ae0-a16f-45b8-94bb-91f19148b345");
            xmlHttp.send();
        }
        else{
            if(speechToTextLower.includes("search")){
                var speech = speechToTextLower;
                var word = speech.substring(7);
                speak("Searching for "+word);
                for(var i = 0;i<word.length;i++){
                    if(word[i]==" "){
                        word[i] = '+';
                    }
                }
                chrome.tabs.create({'url': "https://www.google.com/search?client=firefox-b-d&q="+word, 'selected': false});
            }
            else{
                speak("Searching for "+speechToTextLower);
                chrome.tabs.create({'url': "https://www.google.com/search?client=firefox-b-d&q="+speechToTextLower, 'selected': false});
            }
        }
        document.getElementById("click").src = "img/click.gif";
    }
}

function open(txt,speechToTextLower){
    speak("Opening " + txt);
    xmlHttp = new XMLHttpRequest();
    xmlHttp.responseType = "document"
    xmlHttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
            var documentHTML = this.response;
            rList = documentHTML.getElementsByClassName('r');
            console.log(rList[0].firstChild.href);
            chrome.tabs.create({'url': ""+rList[0].firstChild.href, 'selected': false});
        }
    };
    xmlHttp.open("GET","https://www.google.com/search?client=firefox-b-d&q="+txt);
    xmlHttp.send();
}

const speak = (text) => {
    var utterThis = new SpeechSynthesisUtterance(text);
    synth.speak(utterThis);
};