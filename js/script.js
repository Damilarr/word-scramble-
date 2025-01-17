'use strict'
let wordArr = ['timeline','terminal','hidden','prevent','undo','sleep','love','clean','many','boring', 'document','live','click','game','count','master','bell','word','guard','grand','final','view','altercation','psuedo','delete','fold','dated','frugal','camera','node','skype']
let randomNo = ''
let scrambledWord=''
let mp3,timeCheck, word,originalWord,min,sec,pausedMin,pausedSec,tUpdate;
let previous=[]
let count = 3
let progress = 0

//
const staticBackdrop = document.querySelector('#staticBackdrop');
const nameInp = document.getElementById('nameInp')
const progressBar = document.querySelector('.progress-bar')
const time = document.getElementById('time')
const difficulty = document.getElementById('difficulty')

//
modalDoneBtn.addEventListener('click',changeDisp)
startBtn.addEventListener('click',startCounting)
submitBtn.addEventListener('click',submit)
function countDown(){
    if(count>=0){
        setTimeout(() => {
            startCount.style.display='flex'
            // debugger
            countNumb.innerHTML = count
            count--
            countDown()
        }, 2000);
    } else{
        setTimeout(() => {
            startCounting()
            count=3
        }, 1000);
        
    }
    if (count == 1) {
        setTimeout(() => {
            welcome()
        }, 1000);
    }
}
function start(){
    document.querySelector('.video-wrapper').style.display='flex'
    document.querySelector('.main').hidden=true
   staticBackdrop.classList.add('show','disp')
   staticBackdrop.setAttribute('role','dialog')
   staticBackdrop.setAttribute('aria-modal','true')

   staticBackdrop.hidden=false
    document.querySelector('#modalB').hidden=false
    document.querySelector('#body').classList.add('modal-open')
    document.querySelector('.modal-backdrop').addEventListener('click',()=>{
       staticBackdrop.classList.add('modal-static')
       staticBackdrop.style.overflow='hidden'
    })
}
start()
generate()
function generate(){
    randomNo = Math.floor(Math.random() * wordArr.length) 
}
function changeDisp(){
   if (nameInp.value !== ''){
    staticBackdrop.classList.remove('show','disp')
    document.querySelector('#modalB').hidden=true
    staticBackdrop.style.display='none'
    playerName.innerHTML = nameInp.value.toUpperCase()
    document.querySelector('.video-wrapper').style.display='none'
    document.querySelector('.main').hidden=false
   } 
}
function submit(){
    if(unScrambledWordInp.value){
        let inp = unScrambledWordInp.value.toLowerCase()
        let correctword = wordArr.find(element => {
            return element == inp
        });
        console.log(`correctword`,correctword);
        if (correctword){
            scrambledWord=''
            progress += 10
            setProgress()
            if (progress==100){
                // contentbx.innerHTML = `<h2>🥇Perfect!!!</h2 <p>Score::${progress}%</p>`
            } else{
                generate()
                scrambleWords()
            }
        }else if(!correctword){
            pausedMin = min
            pausedSec = sec
            // debugger
            clearTimeout(tUpdate)
            time.innerHTML=`${pausedMin}:${pausedSec}`
            contentbx.style.display='flex'
            contentbx.innerHTML =`<h2>Oops</h2><p>Incorrect answer entered correct word is ${originalWord}</p><button class="btn btn-light" onclick="resume()">OK</button>`
        } else{
            scrambledWord=''
            generate()
            scrambleWords()
        }
    }else{
        console.log('false');
    }
}
function resume(){
    contentbx.style.display='none'
    scrambledWord=''
    generate()
    timer(pausedMin,pausedSec)
    scrambleWords()
    

}
function setProgress(){
    progressBar.style.width=`${progress}%`
    progressBar.innerHTML =`${progress}%` 
}
function startCounting(){
    if (count >= 0){
       countDown()
    } else{
        startCount.style.display='none'
        if (startBtn.innerHTML=='<b>NEW GAME</b>'){
            setTimeout(() => {
                progress=0
                setProgress()
                level()
                startBtn.setAttribute('disabled','disabled')
                scrambleWords()
                timeCheck = setInterval(() => {
                    check()
                }, 1000);
                submitBtn.removeAttribute('disabled','disabled')
                
            }, 1400);
        }else{
            setTimeout(() => {
                scrambleWords()
                level()
                startBtn.setAttribute('disabled','disabled')
            }, 1600);
        }
    }
}
function level(){
    if (difficulty.value == 'easy') {
        min=2
        sec=30
       return timer(min,sec)
    } else if(difficulty.value == 'medium') {
        min=2
        sec=0
       return timer(min,sec)
    } else if (difficulty.value == 'hard'){
        min=1
        sec=30
       return timer(min,sec)
    } else if(difficulty.value == 'insane'){
        min=1
        sec=0
       return timer(min,sec)
    }
}
function scrambleWords(){
    if (previous.includes(randomNo)) {
        generate()
        scrambleWords()
    } else {
        previous.push(randomNo)
        scramble()
    }
}
function scramble(){
    word = wordArr[randomNo]
    originalWord = wordArr[randomNo]
        console.log(`starting`,word);
        for (let i = 0;word.length>0; i++) {
            let rand = Math.floor(Math.random()*word.length)
            scrambledWord += word.charAt(rand)
            word = word.slice(0,rand) + word.slice(rand+1)   
        }
        console.log(scrambledWord);
        scrambledWordInp.value = scrambledWord
        unScrambledWordInp.value=''
}
function welcome(){
    mp3 = new Audio('./audio/welcome_voice.mp3')
    mp3.play()
}
function timer(minute,second){
    if (minute >= 0 && second>= 0) {
       time.style.color='black'
       if (minute==0 && second <=46) {
           time.style.color='red'
       }
       time.innerHTML =`${minute}:${second}`
       tUpdate = setTimeout(() => {
        if(second==0 && minute >=1){
            minute--
            second= 60
            second--
            timer(minute,second)
        } else if(progress==100){
            return
        } else{
            second--
            timer(minute,second)
        }
       }, 1000);
           min=minute
           sec= second
    } else{
        console.log('done');
        contentbx.style.display='flex'
        contentbx.innerHTML = `<h2>Time Up⌛!!!</h2><p><strong>Score::${progress}%</strong></p><button class="btn btn-light" onclick="restartGame()" id="timeUpBtn">OK</button>`
    }
}
function check(){
    if (time.innerHTML=='0:0'){
        reset()
        clearInterval(timeCheck)
    }
    if(progress==100){
        contentbx.style.display='flex'
        contentbx.innerHTML = `<h2>🥇Perfect!!!</h2 <p><b>Score::${progress}%</b></p><button class="btn btn-light" onclick="restartGame()">OK</button>`
        reset()
        clearInterval(timeCheck)
        min = 0
        sec = 0
        time.innerHTML=''
    }
}
timeCheck = setInterval(() => {
    check()
}, 1000);

function reset(){
    submitBtn.setAttribute('disabled','disabled')
    startBtn.removeAttribute('disabled')
    startBtn.innerHTML ='<b>NEW GAME</b>'
    scrambledWord =''
    previous=''
    previous=[]
}
function restartGame(){
    progress=0
    setProgress()
    contentbx.style.display='none'
    document.querySelector('#unScrambledWordInp').value=''
}