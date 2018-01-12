 //code for popups
 /*************** popUp Texts array ***************/
 let popUpTexts = [
     {
         text: "trainerInfo",
         url: "pages/popups/vocabTrainerInfo.html",
         top: "8%",
         left: "7%",
         borderColor: "rgba(0, 0, 0, 0.6)"
 },
     {
         text: "caseSensitive",
         url: "pages/popups/hint1.html",
         top: "8%",
         left: "7%",
         borderColor: "rgba(0, 0, 0, 0.6)"
  },
     {
         text: "article",
         url: "pages/popups/hint2.html",
         top: "8%",
         left: "7%",
         borderColor: "rgba(0, 0, 0, 0.6)"
  },
     {
         text: "account",
         url: "pages/popups/addAccount.html",
         top: "8%",
         left: "7%",
         borderColor: "rgba(0, 0, 0, 0.6)"
  },
     {
         text: "deleteAccount",
         url: "pages/popups/addAccount.html",
         top: "8%",
         left: "7%",
         borderColor: "rgba(0, 0, 0, 0.6)"
  },
     {
         text: "assignTime",
         url: "pages/popups/timerAddTime.html",
         top: "8%",
         left: "7%",
         borderColor: "rgba(0, 0, 0, 0.6)"
  },
     {
         text: "start",
         url: "pages/popups/startTimerTraining.html",
         top: "8%",
         left: "7%",
         borderColor: "rgba(0, 0, 0, 0.6)"
  },
     {
         text: "timerEnd",
         url: "pages/popups/TimerTrainingEnd.html",
         top: "8%",
         left: "7%",
         borderColor: "rgba(0, 0, 0, 0.6)"
  }


];

 /*************** Functions ***************/
 function setCSS(e, style) {
     for (let prop in style) {
         e.style[prop] = style[prop];
     }
 }

 function popUp(textNumber) {
     // Stop multiply instances of same popup
     let popUpName = popUpTexts[textNumber].text;
     if (document.querySelector("#" + popUpName) == null) {
         let popUpBox = document.createElement("div");
         popUpBox.setAttribute("class", "popUp");
         popUpBox.setAttribute("id", popUpName);
         let xhr = new XMLHttpRequest();
         xhr.onreadystatechange = function () {
             if (this.readyState == 4 && this.status == 200) {
                 popUpBox.innerHTML = this.response;
             }
         };
         xhr.open("POST", popUpTexts[textNumber].url, true);
         xhr.send(null);
         setCSS(popUpBox, {
             top: popUpTexts[textNumber].top,
             left: popUpTexts[textNumber].left,
             borderColor: popUpTexts[textNumber].borderColor
         });
         content.appendChild(popUpBox);
         if (popUpName != "trainerInfo") {
             setTimeout(popUpHide, 2000);
         }
     }
 }

 function popUpHide() {
     // deletes the first instance with class popup and not the one clicked on need to change this.
     if (document.querySelector(".popUp") != null) {
         document.querySelectorAll("#content").forEach(cross => {
             document.querySelector(".popUp").classList.add('popUpFadeOut')
             setTimeout(function () {
                 cross.removeChild(document.querySelector(".popUpFadeOut"));
             }, 2000);
             //timeout causes some console errors if person is impatient and double clicks on cross to close
         });
     }
 }
