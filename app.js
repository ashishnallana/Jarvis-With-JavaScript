// elements

const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");
const speakBtn = document.querySelector("#speak");
const time = document.querySelector("#time")
const battery = document.querySelector("#battery")
const internet = document.querySelector("#internet")
const turn_on = document.querySelector("#turn_on")
const msgs = document.querySelector(".messages")



document.querySelector("#start_jarvis_btn").addEventListener("click", () => {
  recognition.start()
})

// friday | jarvis commands

let fridayComs = []
fridayComs.push("hi friday");
fridayComs.push("what are your commands");
fridayComs.push("close this - to close opened popups");
fridayComs.push(
  "change my information - information regarding your acoounts and you"
);
fridayComs.push("whats the weather or temperature");
fridayComs.push("show the full weather report");
fridayComs.push("are you there - to check fridays presence");
fridayComs.push("shut down - stop voice recognition");
fridayComs.push("open google");
fridayComs.push('search for "your keywords" - to search on google ');
fridayComs.push("open whatsapp");
fridayComs.push("open youtube");
fridayComs.push('play "your keywords" - to search on youtube ');
fridayComs.push("close this youtube tab - to close opened youtube tab");
fridayComs.push("open firebase");
fridayComs.push("open netlify");
fridayComs.push("open twitter");
fridayComs.push("open my twitter profile");
fridayComs.push("open instagram");
fridayComs.push("open my instagram profile");
fridayComs.push("open github");
fridayComs.push("open my github profile");

// weather setup

function weather(location) {
  const weatherCont = document.querySelector(".temp").querySelectorAll("*");

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=48ddfe8c9cf29f95b7d0e54d6e171008`;
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function () {
    if (this.status === 200) {
      let data = JSON.parse(this.responseText);
      weatherCont[0].textContent = `Location : ${data.name}`;
      weatherCont[1].textContent = `Country : ${data.sys.country}`;
      weatherCont[2].textContent = `Weather type : ${data.weather[0].main}`;
      weatherCont[3].textContent = `Weather description : ${data.weather[0].description}`;
      weatherCont[4].src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      weatherCont[5].textContent = `Original Temperature : ${ktc(
        data.main.temp
      )}`;
      weatherCont[6].textContent = `feels like ${ktc(data.main.feels_like)}`;
      weatherCont[7].textContent = `Min temperature ${ktc(data.main.temp_min)}`;
      weatherCont[8].textContent = `Max temperature ${ktc(data.main.temp_max)}`;
      weatherStatement = `sir the weather in ${data.name} is ${data.weather[0].description
        } and the temperature feels like ${ktc(data.main.feels_like)}`;
    } else {
      weatherCont[0].textContent = "Weather Info Not Found";
    }
  };

  xhr.send();
}

// convert kelvin to celcius
function ktc(k) {
  k = k - 273.15;
  return k.toFixed(2);
}

// time setup

let date = new Date()
let hrs = date.getHours()
let mins = date.getMinutes()
let secs = date.getSeconds()

// autojarvis

function autoJarvis() {
  setTimeout(() => {
    recognition.start()
    
  }, 1000);
}

// onload (window)
window.onload = () => {
  // onstartup

  turn_on.play()
  turn_on.addEventListener("onend", () => {
    setTimeout(() => {
      autoJarvis()
      readOut("Ready To Go Sir")
      if(localStorage.getItem("jarvis_setup") === null){
        readOut("Sir, Kindly Fill Out the form")
      }
    }, 200);
  })

  // jarvis commands adding

  fridayComs.forEach((e) => {
    document.querySelector(".commands").innerHTML += `<p>#${e}</p><br/>`
  })

  // time - clock
  time.textContent = `${hrs} : ${mins} : ${secs}`
  setInterval(() => {
    let date = new Date()
let hrs = date.getHours()
let mins = date.getMinutes()
let secs = date.getSeconds()
time.textContent = `${hrs} : ${mins} : ${secs}`
  }, 1000);

  // battery setup
  let batteryPromise = navigator.getBattery()
  batteryPromise.then(batteryCallback)

  function batteryCallback(batteryObject) {
    printBatteryStatus(batteryObject)
    setInterval(() => {
    printBatteryStatus(batteryObject)
    }, 5000);
  }


  function printBatteryStatus(batteryObject){
    battery.textContent = `${batteryObject.level *100}%`
    if(batteryObject.charging = true){
      document.querySelector(".battery").style.width = "200px"
      battery.textContent = `${batteryObject.level *100}% Charging`
    }
    
  }

  // internet setup

  navigator.onLine ? (internet.textContent = "online") : (internet.textContent = "offline")


  setInterval(() => {
    
    // for internet
    navigator.onLine ? (internet.textContent = "online") : (internet.textContent = "offline")
  }, 60000);



}

// create a new chat
function createMsg(who, msg){
  let newmsg = document.createElement("p")
  newmsg.innerText = msg;
  newmsg.setAttribute("class", who)
  msgs.appendChild(newmsg)
}

// jarvis setup

if (localStorage.getItem("jarvis_setup") !== null) {
  weather(JSON.parse(localStorage.getItem("jarvis_setup")).location)
}

// jarvis information setup
const setup = document.querySelector(".jarvis_setup")
setup.style.display = "none"
if (localStorage.getItem("jarvis_setup") === null) {
  setup.style.display = "block"
  // setup.style.display = "flex"
  setup.querySelector("button").addEventListener("click", userInfo)
}

// userinfo func
function userInfo() {
  let setupInfo = {
    name: setup.querySelectorAll("input")[0].value,
    bio: setup.querySelectorAll("input")[1].value,
    location: setup.querySelectorAll("input")[2].value,
    instagram: setup.querySelectorAll("input")[3].value,
    twitter: setup.querySelectorAll("input")[4].value,
    github: setup.querySelectorAll("input")[5].value,
  }

  let testArr = []

  setup.querySelectorAll("input").forEach((e) => {
    testArr.push(e.value)
  })

  if (testArr.includes("")) {
    readOut("sir enter your complete infomation")
  } else {
    localStorage.clear()
    localStorage.setItem("jarvis_setup", JSON.stringify(setupInfo))
    setup.style.display = "none"
    weather(JSON.parse(localStorage.getItem("jarvis_setup")).location)
  }
}


// speech recognition setup

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.continuous = true

// sr start
recognition.onstart = function () {
  console.log("vr active");
};

// sr result

// arr of window
let windowsB = []

recognition.onresult = function (event) {
  let current = event.resultIndex;
  let transcript = event.results[current][0].transcript;
  transcript = transcript.toLowerCase();
  let userdata = localStorage.getItem("jarvis_setup")

  createMsg("usermsg", transcript)


  if (transcript.includes("hello friday")) {
    readOut("hello sir");
  }
  if (transcript.includes("tell me about yourself")) {
    readOut(
      "sir, i am a friday, a voice asistant made for browser using javascript by one of the Enthusiastic dev on the planet. I can do anything which can be done from a browser."
    );
  }
  if (transcript.includes("change my information")) {
    readOut("Opening the information tab sir");
    localStorage.clear();
    setup.style.display = "flex";
    setup.querySelector("button").addEventListener("click", userInfo);
  }
  if (transcript.includes("are you there")) {
    readOut("yes sir");
  }
  if (transcript.includes("shut down")) {
    readOut("Ok sir i will take a nap");
    recognition.stop();
  }
  if (
    transcript.includes("the weather") ||
    transcript.includes("temperature")
  ) {
    readOut(weatherStatement);
  }
  if (transcript.includes("full weather report")) {
    readOut("opening the weather report sir");
    window.open(
      `https://www.google.com/search?q=weather+in+${
        JSON.parse(localStorage.getItem("jarvis_setup")).location
      }`
    );
  }
  if (transcript.includes("what are your commands")) {
    readOut("sir, I follow the following commands");
    document.querySelector(".commands").style.display = "block"
  }
  if (transcript.includes("close this")) {
    readOut("closed")
    document.querySelector(".commands").style.display = "none"
    setup.style.display = "none"
  }
  if (transcript.includes("close all tabs")) {
    readOut("closing all tabs sir")
    windowsB.forEach((e) => {
      e.close()
    })

  }
  if (transcript.includes("open youtube")) {
    readOut("opening youtube sir");
    let a = window.open("https://www.youtube.com/");
    windowsB.push(a)
  }
  if (transcript.includes("open google")) {
    readOut("opening google sir");
    let a = window.open("https://www.google.com/");
    windowsB.push(a)
  }
  // google search

  if (transcript.includes("search for")) {
    readOut("here's the result");
    let input = transcript.split("");
    input.splice(0, 11);
    input.pop();
    input = input.join("").split(" ").join("+");
    console.log(input);
    window.open(`https://www.google.com/search?q=${input}`);
  }

  // if (
  //   transcript.includes("open firebase") ||
  //   transcript.includes("open fire base")
  // ) {
  //   readOut("opening firebase console");
  //   window.open("https://console.firebase.google.com/");
  // }
  // firebase with accounts feature
  if (transcript.includes("open fire base") && transcript.includes("account")) {
    readOut("opening firebase console");
    let accId = transcript;
    accId = accId.split("");
    accId.pop();
    accId = accId[accId.length - 1];
    console.log(`accId: ${accId}`);
    // https://console.firebase.google.com/u/0/
    window.open(`https://console.firebase.google.com/u/${accId}/`);
  }

  // github commands
  if (transcript.includes("open github")) {
    readOut("opening github sir")
    window.open("https://github.com/")
  }
  if (transcript.includes("open my github profile")) {
    readOut("opening your github profile sir")
    window.open(`https://github.com/${JSON.parse(userdata).github}`)
  }
    if (transcript.includes("open whatsapp")) {
    readOut("opening whatsapp");
    window.open("https://web.whatsapp.com/");
  }

  if (transcript.includes("open netlify")) {
    readOut("opening netlify");
    window.open("https://app.netlify.com/");
  }
  if (transcript.includes("play")) {
    let playStr = transcript.split("");
    playStr.splice(0, 5);
    let videoName = playStr.join("");
    playStr = playStr.join("").split(" ").join("+");
    readOut(`playing ${videoName}`);
    window.open(`https://www.youtube.com/search?q=${playStr}`);
  }
  
  if (transcript.includes("open my twitter profile")) {
    readOut("opening your twitter profile");
    window.open(`https://twitter.com/${JSON.parse(userData).twitter}`);
  }
  if (transcript.includes("open twitter")) {
    readOut("opening twitter sir");
    window.open(`https://twitter.com/`);
  }
  
  if (transcript.includes("open instagram")) {
    readOut("opening instagram sir");
    window.open("https://www.instagram.com");
  }
  if (transcript.includes("open my instagram profile")) {
    if (JSON.parse(userData).instagram) {
      readOut("opening your instagram profile");
      window.open(
        `https://www.instagram.com/${JSON.parse(userData).instagram}/`
      );
    } else {
      readOut("sir i didn't found your instagram information");
    

  if (transcript.includes("open spotify")) {
    readOut("opening spotify");
    window.open("https://open.spotify.com/");
  }
  if (transcript.includes("what's my name")) {
    readOut(`Sir, I know that you are ${JSON.parse(userData).name}`);
  }
  if (transcript.includes("what's my bio")) {
    readOut(`Sir, I know that you are ${JSON.parse(userData).bio}`);
  }
};

// sr stop
recognition.onend = function () {
  console.log("vr deactive");
};

// sr continuos
// recognition.continuous = true;

startBtn.addEventListener("click", () => {
  recognition.start();
});

stopBtn.addEventListener("click", () => {
  recognition.stop();
});

// friday speech
function readOut(message) {
  const speech = new SpeechSynthesisUtterance();
  //   different voices
  // const allVoices = speechSynthesis.getVoices();
  speech.text = message;
  // speech.voice = allVoices[0];
  speech.volume = 1;
  window.speechSynthesis.speak(speech);
  console.log("speaking out");
  createMsg("jmsg", message)
}

// example

speakBtn.addEventListener("click", () => {
  readOut("hello, my dear enthusiastic devs on the planet");
});
