import { useState, useRef, useEffect } from 'react';

const useWebSpeechAPI = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const fullTranscriptRef = useRef(''); // stores accumulated text

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        let finalText = '';
        let interimText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;
          if (result.isFinal) finalText += text;
          else interimText += text;
        }

        // When final text received, append to full transcript
        if (finalText) {
          fullTranscriptRef.current += ' ' + finalText.trim();
        }

        // Update combined transcript (old + current interim)
        const combined = (fullTranscriptRef.current + ' ' + interimText.trim()).trim();
        setTranscript(combined);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        switch (event.error) {
          case 'not-allowed':
            setError('Microphone access denied.');
            break;
          case 'audio-capture':
            setError('No microphone detected.');
            break;
          default:
            setError(event.error);
        }
        setIsListening(false);
      };

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        setTranscript('');
        fullTranscriptRef.current = ''; // reset stored speech text
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setError('Speech recognition not supported in this browser.');
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const startListening = () => {
    console.log("calling ===========")
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  return {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
  };
};

export default useWebSpeechAPI;
