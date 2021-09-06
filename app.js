// vars and elements
const turn_on = document.querySelector("#turn_on");
const jarvis_intro = document.querySelector("#j_intro");
const time = document.querySelector("#time");
const machine = document.querySelector(".machine");
// const msgs = document.querySelector(".messages");
// whether the recognition is stopiing on my command or automatically
let stopingR = false;
// friday's commands
let fridayComs = [];
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

// youtube window
let ytbWindow;

// create a new message
// function createMsg(who, msg) {
//   let newmsg = document.createElement("p");
//   newmsg.innerText = msg;
//   newmsg.setAttribute("class", who);
//   msgs.appendChild(newmsg);
// }

// show a warn to check for all the commands
console.warn('*to check for the commands speak "what are your commands"');

// date and time
let date = new Date();
let hrs = date.getHours();
let mins = date.getMinutes();
let secs = date.getSeconds();

// this is what friday tells about weather
let weatherStatement = "";

window.onload = () => {
  turn_on.play();
  turn_on.addEventListener("ended", () => {
    setTimeout(() => {
      // autoJarvis();
      readOut("Ready to go sir");
      if (localStorage.getItem("jarvis_setup") === null) {
        readOut(
          "Sir, kindly fill out the form on your screen so that you could access most of my features and if you want to see my commands see a warning in the console"
        );
      }
    }, 200);
  });

  fridayComs.forEach((e) => {
    document.querySelector(".commands").innerHTML += `<p>#${e}</p><br />`;
  });
  // battery
  let batteryPromise = navigator.getBattery();
  batteryPromise.then(batteryCallback);

  // internet connectivity
  navigator.onLine
    ? (document.querySelector("#internet").textContent = "online")
    : (document.querySelector("#internet").textContent = "offline");

  setInterval(() => {
    navigator.onLine
      ? (document.querySelector("#internet").textContent = "online")
      : (document.querySelector("#internet").textContent = "offline");
  }, 60000);

  function batteryCallback(batteryObject) {
    printBatteryStatus(batteryObject);
    setInterval(() => {
      printBatteryStatus(batteryObject);
    }, 5000);
  }
  function printBatteryStatus(batteryObject) {
    document.querySelector("#battery").textContent = `${
      batteryObject.level * 100
    }%`;
    if (batteryObject.charging === true) {
      document.querySelector(".battery").style.width = "200px";
      document.querySelector("#battery").textContent = `${
        (batteryObject.level * 100).toFixed(2)
      }% Charging`;
    }
  }

  // timer
  setInterval(() => {
    let date = new Date();
    let hrs = date.getHours();
    let mins = date.getMinutes();
    let secs = date.getSeconds();
    time.textContent = `${hrs} : ${mins} : ${secs}`;
  }, 1000);
};

// auto friday

function autoJarvis() {
  setTimeout(() => {
    recognition.start();
  }, 1000);
}

// 
// start jarvis with btn
document.querySelector("#start_jarvis_btn").addEventListener("click", () => {
  recognition.start();
})

// show waether
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
      weatherStatement = `sir the weather in ${data.name} is ${
        data.weather[0].description
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

if (localStorage.getItem("jarvis_setup") !== null) {
  weather(JSON.parse(localStorage.getItem("jarvis_setup")).location);
}

// friday information setup

const setup = document.querySelector(".jarvis_setup");
setup.style.display = "none";
if (localStorage.getItem("jarvis_setup") === null) {
  setup.style.display = "flex";
  setup.querySelector("button").addEventListener("click", userInfo);
}

function userInfo() {
  let setupInfo = {
    name: setup.querySelectorAll("input")[0].value,
    bio: setup.querySelectorAll("input")[1].value,
    location: setup.querySelectorAll("input")[2].value,
    instagram: setup.querySelectorAll("input")[3].value,
    twitter: setup.querySelectorAll("input")[4].value,
    github: setup.querySelectorAll("input")[5].value,
  };

  let testArr = [];

  setup.querySelectorAll("input").forEach((e) => {
    testArr.push(e.value);
  });

  if (testArr.includes("")) {
    readOut("sir enter your complete information");
  } else {
    localStorage.clear();
    localStorage.setItem("jarvis_setup", JSON.stringify(setupInfo));
    setup.style.display = "none";
    weather(JSON.parse(localStorage.getItem("jarvis_setup")).location);
  }
}

// speech recognition

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = true;

recognition.onstart = function () {
  console.log("voice recognition activated");
};

// arr of window
let windowsB = []

recognition.onresult = function (event) {
  let current = event.resultIndex;
  let transcript = event.results[current][0].transcript;
  transcript = transcript.toLowerCase();
  let userData = localStorage.getItem("jarvis_setup");
  // createMsg("usermsg", transcript);
  // commands
  // hi - hello
  if (transcript.includes("hi jarvis")) {
    readOut("hello sir");
  }
  // jarvis commands
  if (transcript.includes("what are your commands")) {
    readOut("sir here's the list of commands i can follow");
    if(window.innerWidth <= 400 ){
      window.resizeTo(screen.width,screen.height)
    }
    document.querySelector(".commands").style.display = "block";
  }
  // jarvis bio
  if (transcript.includes("Tell about yourself")) {
    readOut(
      "sir, i am a jarvis, a voice asistant made for browsers using javascript by one of the Enthusiastic dev on the planet. I can do anything which can be done from a browser."
    );
  }

  // close popups
  if (transcript.includes("close this")) {
    readOut("closing the tab sir");
    document.querySelector(".commands").style.display = "none";
    setup.style.display = "none";
  }

  // info change
  if (transcript.includes("change my information")) {
    readOut("Opening the information tab sir");
    localStorage.clear();
    
    if(window.innerWidth <= 400 ){
      window.resizeTo(screen.width,screen.height)
    }
    setup.style.display = "flex";
    setup.querySelector("button").addEventListener("click", userInfo);
  }

  
  // weather report
  if (
    transcript.includes("the weather") ||
    transcript.includes("temperature")
  ) {
    readOut(weatherStatement);
  }

  if (transcript.includes("full weather report")) {
    readOut("opening the weather report sir");
    let a = window.open(
      `https://www.google.com/search?q=weather+in+${
        JSON.parse(localStorage.getItem("jarvis_setup")).location
      }`
    );
    windowsB.push(a)
  }
  // availability check
  if (transcript.includes("are you there")) {
    readOut("yes sir");
  }
  // close voice recognition
  if (transcript.includes("shut down")) {
    readOut("Ok sir i will take a nap");
    stopingR = true;
    recognition.stop();
  }

// whatsapp
  if (transcript.includes("open whatsapp")) {
    readOut("opening whatsapp");
    let a = window.open("https://web.whatsapp.com/");
    windowsB.push(a)
  }
// netlify
  if (transcript.includes("open netlify")) {
    readOut("opening netlify");
    let a = window.open("https://app.netlify.com/");
    windowsB.push(a)
  }
// spotify
  if (transcript.includes("open spotify")) {
    readOut("opening spotify");
    let a = window.open("https://open.spotify.com/");
    windowsB.push(a)
  }


  // firebase

  if (transcript.includes("open fire base") && transcript.includes("account")) {
    readOut("opening firebase console");
    let accId = transcript;
    accId = accId.split("");
    accId.pop();
    accId = accId[accId.length - 1];
    console.log(`accId: ${accId}`);
    // https://console.firebase.google.com/u/0/
    let a = window.open(`https://console.firebase.google.com/u/${accId}/`);
    windowsB.push(a)
  }

  // canva

  if (transcript.includes("open my canva designs")) {
    readOut("opening canva designs");
    window.open("https://www.canva.com/folder/all-designs");
  }

  if (transcript.includes("open canva") || transcript.includes("open camera")) {
    readOut("opening canva");
    window.open("https://www.google.com/");
  }

  // userdata access commands

  if (transcript.includes("what's my name")) {
    readOut(`Sir, I know that you are ${JSON.parse(userData).name}`);
  }
  if (transcript.includes("what's my bio")) {
    readOut(`Sir, I know that you are ${JSON.parse(userData).bio}`);
  }

  // google

  if (transcript.includes("open google")) {
    readOut("opening google");
    let a = window.open("https://www.google.com/");
    windowsB.push(a)
  }

  if (transcript.includes("search for")) {
    readOut("here's your result");
    let input = transcript.split("");
    input.splice(0, 11);
    input.pop();
    input = input.join("").split(" ").join("+");
    let a = window.open(`https://www.google.com/search?q=${input}`);
    windowsB.push(a)
  }

  // youtube
  if (transcript.includes("open youtube")) {
    readOut("opening youtube sir");
    let a = window.open("https://www.youtube.com/");
    windowsB.push(a)
  }

  // if (transcript.includes("play")) {
  //   let playStr = transcript.split("");
  //   playStr.splice(0, 5);
  //   console.log(playStr);
  //   let videoName = playStr.join("");
  //   console.log(videoName);
  //   playStr = playStr.join("").split(" ").join("+");
  //   console.log(playStr);
  //   readOut(`playing ${videoName}`);
  //   et a = window.open(`https://www.youtube.com/search?q=${playStr}`
  //   );
  //   windowsB.push(a)
  // }

  /*
  * When window.open is called from a handler that was triggered though a user action (e.g. onclick event), it will behave similar as <a target="_blank">, which by default opens in a new tab. However if window.open is called elsewhere, Chrome ignores other arguments and always opens a new window with a non-editable address bar.
  * This looks like some kind of security measure, although the rationale behind it is not completely clear.
  */


  // instagram
  if (transcript.includes("open instagram")) {
    readOut("opening instagram sir");
    let a =window.open("https://www.instagram.com");
    windowsB.push(a)
  }
  if (transcript.includes("open my instagram profile")) {
    if (JSON.parse(userData).instagram) {
      readOut("opening your instagram profile");
      let a =window.open(
        `https://www.instagram.com/${JSON.parse(userData).instagram}/`
      );
      windowsB.push(a)
    } else {
      readOut("sir i didn't found your instagram information");
    }
  }
  // twitter
  if (transcript.includes("open my twitter profile")) {
    readOut("opening your twitter profile");
    let a=window.open(`https://twitter.com/${JSON.parse(userData).twitter}`);
    windowsB.push(a)
  }
  if (transcript.includes("open twitter")) {
    readOut("opening twitter sir");
    let a = window.open(`https://twitter.com/`);
    windowsB.push(a)
  }

  // github
  if (transcript.includes("open my github profile")) {
    readOut("opening your github profile");
    let a = window.open(`https://github.com/${JSON.parse(userData).github}`);
    windowsB.push(a)
  }
  if (transcript.includes("open github")) {
    readOut("opening github");
    let a = window.open("https://github.com/");
    windowsB.push(a)
  }

  // close all opened tabs
  if (transcript.includes("close all tabs")) {
    readOut("closing all tabs sir")
    windowsB.forEach((e) => {
      e.close()
    })

  }

}




recognition.onend = function () {
  if (stopingR === false) {
    setTimeout(() => {
      recognition.start();
    }, 500);
  } else if (stopingR === true) {
    recognition.stop();
  }
};

// speak out



function readOut(message) {
const speech = new SpeechSynthesisUtterance();
  speech.text = message;
  speech.volume = 1;
  window.speechSynthesis.speak(speech);
  console.log("Speaking out");
  // createMsg("jmsg", message);
}


// small jarvis
const smallJarvis = document.querySelector("#small_jarvis")

smallJarvis.addEventListener("click", () => {
  window.open(`${window.location.href}`,"newWindow","menubar=true,location=true,resizable=false,scrollbars=false,width=200,height=200,top=0,left=0")
  window.close()
})



document.querySelector("#jarvis_start").addEventListener("click", () => {
  recognition.start()
})



