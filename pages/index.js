import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'
import Counter from '../components/Counter'
import html2canvas from 'html2canvas';
import { Analytics } from '@vercel/analytics/react';
import ChromeDetection from '../components/ChromeDetection';
import Viz from '../components/Viz';

export default function Home() {

  const [question, setQuestion] = useState();
  const [answer, setAnswer] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [perms, setPerms] = useState(false);
  const [permsmsg, setPermsmsg] = useState();
  const [image, setImage] = useState(null);
  const [imgurlink, setImgurlink] = useState(null);
  const [audio, setAudio] = useState(null);
  const audioRef = useRef(null);
  const [tweet, setTweet] = useState();
  const recognitionRef = useRef(null);

  function capitializeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const playStartSound = () => {
    audioRef.current.play();
  };

  useEffect(() => {
    async function init() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setPerms(true);
        setPermsmsg('');
      } catch (error) {
        console.error('Microphone access not granted:', error);
        setPerms(false);
        setPermsmsg('Microphone access not granted');
      }
    }

    init();
  }, [])

  useEffect(() => {
    if (question && answer) {
      createImage();
    }
  }, [question, answer]);

  const createImage = async () => {
    console.log('createImage');
    html2canvas(document.body).then(canvas => {
      const imageData = canvas.toDataURL('image/png');
      setImage(imageData);
      uploadImage(imageData);
    });
  }

  const uploadImage = async (i) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "image": i
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    const data = await fetch("api/upload", requestOptions)
    const response = await data.json();
    console.log('imgurlink', response.link);
    setImgurlink(response.link);
  }

  const shareImageToTwitter = async () => {
    const maxTweetLength = 280;
    const url = "https://dadgippity.com"
    const encodedUrl = encodeURIComponent(url);
    let tweetText = question + '? ' + answer;

    if (tweetText.length > maxTweetLength) {
      tweetText = tweetText.slice(0, maxTweetLength - 36) + '... ' + url;
    } else {
      tweetText += ' ' + url;
    }

    setTweet(tweetText);

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank');
  }

  async function getAnswer(question) {
    setLoading(true);
    if (question.includes('joke')) {

      const joke = await fetch('https://icanhazdadjoke.com/', { headers: { 'Accept': 'application/json' } })
      const jokeResponse = await joke.json();
      console.log(jokeResponse.joke)
      setAnswer(jokeResponse.joke)
      setLoading(false);
      const speech = new SpeechSynthesisUtterance(jokeResponse.joke);
      window.speechSynthesis.speak(speech);

    }
    else {
      const request = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question })
      })

      const response = await request.json();
      console.log(response)
      const answer = response.answer;
      setAnswer(answer);
      setLoading(false);
      const speech = new SpeechSynthesisUtterance(answer);
      window.speechSynthesis.speak(speech);

    }
    // speakText(answer);
  }

  useEffect(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognitionRef.current = recognition;
    // recognition.interimResults = true;
    recognition.maxAlternatives = 10;
    recognition.continuous = false;
    recognition.lang = 'en-US';
  }, []);

  useEffect(() => {
    if (question) {
      getAnswer(question);
    }
  }, [question]);


  const start = () => {

    playStartSound();
    setAnswer('');
    setQuestion('');
    setRecording(true);

    const recognition = recognitionRef.current; // Get the instance from the ref

    recognition.onresult = async function (event) {
      const q = event.results[0][0].transcript
      setRecording(false);
      setQuestion(capitializeFirstLetter(q))
      // getAnswer(q)
      recognition.stop();

    }

    recognition.onerror = (event) => {
      setError('Error occurred in recognition: ' + event.error);
      recognition.stop();

    }

    recognition.onend = () => {
      recognition.stop();
      setRecording(false);

    }

    recognition.onspeechend = () => {
      console.log("Speech has stopped being detected");
      recognition.stop();
      setRecording(false);


    };

    recognition.start();
  }

  const stop = () => {
    playStartSound();
    const recognition = recognitionRef.current; // Get the instance from the ref
    recognition.stop();
    setRecording(false);
  }

  return (
    <div className={styles.container} >
      <Head>
        <title>DadGippity by Salim Karim</title>
        <meta name="description" content="When Dads not around to answer your questions" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@dadgippity" />
        <meta name="twitter:creator" content="@metasal_" />
        <meta property="twitter:title" content="Come talk to DadGippity" />
        <meta property="twitter:image" content={imgurlink ? `https://dadgippity.com/api/og?image=${imgurlink}` : 'https://dadgippity.com/api/og'} />
        <meta property="og:image" content={imgurlink ? `https://dadgippity.com/api/og?image=${imgurlink}` : 'https://dadgippity.com/api/og'} />
        <meta property="twitter:description" content="When dad is not around to answer questions you have" />
        <meta property="og:url" content="https://dadgippity.com" />
        <meta property="og:title" content="Come talk to DadGippity" />
        <meta property="og:description" content="When dad is not around to answer questions you have" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div id='og' className={styles.og}>
          <div className={styles.dad}>
            <Image className={styles.pixelate} src="/dad1.png" width={100} height={100} alt="Brown Dad" />
            <Image className={styles.pixelate} src="/dad2.png" width={100} height={100} alt="Old Dad" />
            <Image className={styles.pixelate} src="/dad3.png" width={100} height={100} alt="White Dad" />
          </div>
          <audio id="audio" ref={audioRef} src="start.mp3" hidden></audio>
          <h1 className={styles.title}>
            DadGippity
          </h1>
          <p className={styles.description}>
            Talk to DadGippity to answer your questions
          </p>
          {/* <Viz recording={recording} /> */}
          {recording && <button onClick={stop} className={styles.button}>🛑 Stop</button>}
          {!recording && <button onClick={start} className={styles.button}>🎙️ Start</button>}
          <div className={styles.container}>
            <div className={styles.loader} hidden={!loading}></div>
          </div>
        </div>
        <div>
          <Viz recording={recording} />

          <div>{error}</div>
          {!question ? <div className={styles.output}>{permsmsg}</div> : null}
          {question && <div className={styles.question}>{question}?</div>}
          <div className={styles.answer}>{answer}</div>
          {question && answer && <button className={styles.share} onClick={() => shareImageToTwitter()}>Share</button>}
          {/* {imgurlink} */}
        </div>
        <footer className={styles.footer}>
          <Counter />
          <ChromeDetection />
        </footer>
      </main >
      <Analytics />
    </div >
  )
}
