import {React, useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';

const TOTAL_GAME_TIME = 10;

function getAllWords() {
  let receivedWords = ["vigorous","follow","gossip","safeguard","encrypt","skydiver","mummified","release","sharply","copious","footwear","steadier","purveyor","rewrap","stonewall","puzzling","implicate","sanitizer","gluten","amazingly","girdle","sandstone","outrage","paddling","sandbar","baking","plant","unaudited","lasso","perceive","carded","handcraft","stature","awning","causal","clapper","dumpling","stabilize","umbrella","snooper","passage","unneeded","ocelot","petticoat","dividing","cause","coexist","glorified","tucking","attribute","quench","gratitude","graveyard","rise","unpaid","reattach","aim","protract","squealing","absolute","superjet","gurgle","cubical","gloomily","skeleton","parlor","gondola","monthly","deserve","unaware","vacation","numerate","encircle","crummy","glutinous","citrus","statistic","absence","creatable","spouse","plating","broker","manger","spotted","boxy","imply","underwear","gauging","conjuror","exes","poison","uniformly","underline","sapling","chewable","friday","active","paramedic","basket","carried","suspend","proximity","mobilize","unmindful","stillness","conjoined","swear","dreadful","panoramic","snugly","crook","broadside","earring","staple","sedation","waking","nutmeg","bottom","jockey","arena","slicer","barometer","amino","unread","lustiness","shakable","uncolored","trowel","verbose","epilepsy","expulsion","dig","anatomy","stuck","thesis","satirical","scandal","blurry","nylon","monetary","posh","daughter","cobweb","sequester","pouring","expansion","skeptic","onion","matron","pentagram","delirium","hypnotic","stardust","dyslexia","stiffly","conduit","purify","chive","engraved","theater","deceiver","old","rabid","dubiously","unhitched","budding","gorged","perceive","legend","refried","emotion","flip","gravity","prototype","landowner","botany","preset","dollar","sequester","facing","subtype","tamale","uncloak","spud","stock","unharmed","commute","cupped","likewise","overall","mute","buffing","raven","undergrad","reanalyze","raving","cupid","backlands","ferment","spoiled","finishing","subsystem","lid","voting","drizzly","tricking","dubiously","mammogram","quaintly","effective","enticing","aerobics","chitchat","hydration","tried","drastic","slider","cruelness","relatable","statute","python","unsoiled","guy","eel","vitally","washstand","humorist","punctuate","glisten","varnish","scalding","strangle","patrol","computer","problem","defog","mandatory","scorer","cider","haunt","chatty","worsening","decode","luxurious","sugar","roundup","silk","untying","padded","serve","sardine","state","yoga","prenatal","bagged","conduit","enamel","exes","arson","banked","grub","hardwired","dart","preface","selective","armless","density","subplot","whenever","politely","thirteen","congress","epic","slimness","deviator","cozy","shrunk","plaster","annoying","strive","strained","yummy","squeak","affair","sporty","tiny","backup","program","coziness","pupil","backless","decade","nebula","stays","job","drowsily","reapprove","fraction","unmade","capricorn"];
  let wordState = receivedWords.map(word => {return {text: word, typed: null}});
  return wordState;
}

function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const [words, setWords] = useState(getAllWords);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [indexRange, setIndexRange] = useState(calcIndexRange(0));
  // const [indexRange, setIndexRange] = useState({startIndex: 0, lastIndex: 20});
  const [inputValue, setInputValue] = useState('');
  const [timerHasStarted, setTimerHasStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_GAME_TIME);
  const [gameHasEnded, setGameHasEnded] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

  function calcIndexRange(firstIndex) {
    const fontSize = 16;
    const rows = 2;
    const charsPerRow = ~~(width / 2 / fontSize);
    const totalChars = charsPerRow * rows;
    let lastIndex, chars = 1;
    for(lastIndex = firstIndex; lastIndex < words.length; lastIndex++) {
      chars += words[lastIndex].text.length + 1;
      if (chars >= totalChars)
        break;
    }
    // console.log(totalChars, {startIndex: firstIndex, lastIndex: lastIndex});
    return {startIndex: firstIndex, lastIndex: lastIndex};
  }

  function renderWords() {
    console.log("rendering words ", indexRange.startIndex, indexRange.lastIndex)
    return words.slice(indexRange.startIndex, indexRange.lastIndex + 1).map((word, index)=> {
      let classes = "word";
      if (index + indexRange.startIndex === selectedIndex) {
        classes = "word selectedWord";
      }
      if (word.typed) {
        classes += " " + word.typed + "TypedWord";
      }
      return <span key={index} className={classes}>{word.text}</span>
    })
  }

  function startTimer() {
    setTimeout(()=> {
      if(timeRemaining === 0){
        setGameHasEnded(true);
        setWords([]);
      } else {
        setTimeRemaining(timeRemaining-1);
      }
    }, 1000);
  }

  function onInputChange(e) {
    if (!timerHasStarted) {
      startTimer()
    }

    let text = e.target.value;
    if(text.endsWith(' ')) {
      let typedWord = text.trim();
      setInputValue('');
      if (words && words.length > 0) {
        let nextWords = words.slice();
        nextWords[selectedIndex].typed = typedWord == words[selectedIndex].text ? "correctly" : "incorrectly";
        setWords(nextWords);
        console.log({selectedIndex: selectedIndex, lastIndex: indexRange.lastIndex})
        if (selectedIndex == indexRange.lastIndex) {
          setIndexRange(calcIndexRange(indexRange.lastIndex + 1))
        }
        setSelectedIndex(selectedIndex + 1);
      }
    } else {
      setInputValue(text);
    }
  }

  function resetTheGame() {
    setSelectedIndex(0);
    setIndexRange(calcIndexRange(0));
    setInputValue('');
    setWords(getAllWords());
  }

  function renderStatusBox() {
    let typedWords = getAllWords().slice(0, selectedIndex).map(word => word.text.length).reduce((a,b) => {return a+b}, 0) / 5;
    return <p>{~~(typedWords * 60 / TOTAL_GAME_TIME)} WPM</p>
  }

  return (
    <div className="gameContainer">
      <div className="wordsBox">
        {renderWords()}
      </div>
      <div className="bottomRow">
        <div className="bottomRowInner">
        <input type="text" className="inputBox" onChange={onInputChange} value={inputValue}/>
        <input type="button" className="restartButton" value="R" onClick={resetTheGame}/>
        <div className="timeRemaining">{timeRemaining}s</div>
        {gameHasEnded && renderStatusBox()}
       </div>
      </div>
    </div>
  );
}

export default App;
