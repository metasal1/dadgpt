import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'
import Counter from '../components/Counter'
import html2canvas from 'html2canvas';
import { Analytics } from '@vercel/analytics/react';

export default function Home() {

  const [question, setQuestion] = useState();
  const [answer, setAnswer] = useState();
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioloading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [perms, setPerms] = useState(false);
  const [permsmsg, setPermsmsg] = useState();
  const [recognition, setRecognition] = useState();
  const [image, setImage] = useState(null);
  const [imgurlink, setImgurlink] = useState(null);
  const [audio, setAudio] = useState(null);

  const mp3Ref = useRef(null);
  const audioRef = useRef(null);

  function handleUserAction() {
    mp3Ref.current.play();
  }
  function capitializeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const playStart = () => {
    // audioRef.current.play();
    // mp3.play();
  };

  useEffect(() => {
    async function init() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setPerms(true);
        setPermsmsg('Press START to begin');
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
      downloadImage();
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

  useEffect(() => {
    setAudioloading(true);
    if (answer) {
      createMp3(answer);
    }
    setAudioloading(false);
  }, [answer]);

  useEffect(() => {
    handleUserAction();
  }, []);

  const createMp3 = async (a) => {
    console.log('createMp3');

    const url = await fetch('api/voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answer: a })
    })
    const response = await url.json();
    console.log(response);
    setAudio(response.url);
  }

  const downloadImage = async (i) => {
    console.log('downloadImage');
    if (i) {
      const link = document.createElement('a');
      link.href = image;
      link.download = 'heytoly.png';
      link.click();
    }
  }

  const uploadImage = async (i) => {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    console.log(i);
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
    console.log(response);
    setImgurlink(response.link);
    console.log(imgurlink);
  }

  const shareImageToTwitter = async (text) => {
    const maxTweetLength = 280;
    const url = 'https://dadgpt.vercel.app';
    const encodedUrl = encodeURIComponent(url);
    let tweetText = text + ' ' + url;

    if (tweetText.length > maxTweetLength) {
      tweetText = imgurlink + text.substring(0, maxTweetLength - encodedUrl.length - 5) + '...' + ' #dadgpt ' + url; // -4 for ellipsis and space
    }

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText + " " + imgurlink)}`;
    window.open(tweetUrl, '_blank');
  }

  async function getAnswer(question) {
    setLoading(true);
    const request = await fetch('/api/toly', {
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

  }

  function start() {

    playStart();
    setAnswer('');
    setQuestion('');
    setRecording(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onerror = function (event) {
      console.error('An error occurred: ' + event.error);
    };

    recognition.start();

    recognition.onresult = async function (event) {
      const q = event.results[0][0].transcript
      setRecording(false);
      setQuestion(capitializeFirstLetter(q))
      getAnswer(q)
    }

    setRecognition(recognition);
  }

  function stop() {
    playStart();
    recognition.stop();
    setRecording(false);
  }

  return (
    <div className={styles.container} >
      <Head>
        <title>Hey Toly!</title>
        <meta name="description" content="When Dads not around to answer your questions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.dad}>
          {/* <Image className={styles.pixelate} src="/dad1.png" width={100} height={100} alt="Brown Dad" />
          <Image className={styles.pixelate} src="/dad2.png" width={100} height={100} alt="Old Dad" />
          <Image className={styles.pixelate} src="/dad3.png" width={100} height={100} alt="White Dad" /> */}
        </div>
        <h1 className={styles.title}>
          Hey Toly!
        </h1>

        <p className={styles.description}>
          What is up Solana ppl!?
        </p>

        <div className={styles.grid}>
          <button onClick={start} className={styles.button} disabled={recording}>🎙️ Start</button>
          <button onClick={stop} className={styles.button} disabled={!recording}>🛑 Stop</button>
          <audio id="audio" ref={audioRef} src="start.mp3" hidden></audio>
          <div className={styles.container}>
            <div className={styles.recording} hidden={!recording}></div>
            <div className={styles.loader} hidden={!loading}></div>
          </div>
        </div>
        <div>
          {!question ? <div className={styles.output}>{permsmsg}</div> : null}
          {question && <div className={styles.question}>{question}?</div>}
          <div className={styles.answer}>{answer}</div>
          {/* {question && answer && <button onClick={() => shareToTwitter(question + "? " + answer)}>Share to X</button>} */}
          {question && answer && <button onClick={() => shareImageToTwitter(question + "? ")}>Share</button>}
          {/* <button onClick={createImage}>Create Image</button> */}
          {/* <button onClick={downloadImage}>Download Image</button> */}
          {/* <button onClick={uploadImage}>Upload Image</button>/ */}
          {/* {image && <Image src={image} alt="Dad" width={"100"} height={"50"} />} */}
          {/* {imgurlink} */}
        </div>
        <audio ref={mp3Ref} controls src={audio}></audio>
        {audioLoading ? <div className={styles.loader}></div> : null}
        <footer className={styles.footer}>
          <Counter />
        </footer>
      </main >
      <Analytics />
    </div >
  )
}
