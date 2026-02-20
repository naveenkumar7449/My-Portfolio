// Initialize AOS animations
AOS.init({
  duration: 1000,
  once: false,
  offset: 100,
  easing: 'ease-in-out-cubic',
  mirror: true
});

// Parallax effect for geometric sphere
window.addEventListener('scroll', () => {
  const sphere = document.querySelector('.geometric-sphere');
  
  if (sphere) {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.5;
    const rotate = scrolled * 0.1;
    
    sphere.style.transform = `translateY(${rate}px) rotateZ(${rotate}deg)`;
  }
});

// Text-to-Speech for About Me with word highlighting
const speakBtn = document.getElementById('speak-btn');
const aboutText = document.getElementById('about-text');
let speech = null;

if (speakBtn && aboutText) {
  const originalText = aboutText.textContent.trim();
  const words = originalText.split(/\s+/);
  
  speakBtn.addEventListener('click', () => {
    if ('speechSynthesis' in window) {
      // Stop if already speaking
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        speakBtn.classList.remove('speaking');
        aboutText.innerHTML = `<span>${originalText}</span>`;
        return;
      }
      
      // Create HTML with individual word spans
      const wordsHTML = words.map((word, index) => 
        `<span class="word" data-index="${index}">${word}</span>`
      ).join(' ');
      aboutText.innerHTML = wordsHTML;
      
      const wordElements = aboutText.querySelectorAll('.word');
      let currentWordIndex = 0;
      
      // Create speech
      speech = new SpeechSynthesisUtterance(originalText);
      speech.rate = 0.85;
      speech.pitch = 1.1;
      speech.volume = 1;
      speech.lang = 'en-US';
      
      // Select a softer, more natural voice
      const voices = speechSynthesis.getVoices();
      const preferredVoices = voices.filter(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') ||
        voice.name.includes('Zira') ||
        voice.lang === 'en-US'
      );
      if (preferredVoices.length > 0) {
        speech.voice = preferredVoices[0];
      }
      
      speakBtn.classList.add('speaking');
      
      // Use boundary event for accurate word tracking
      speech.onboundary = (event) => {
        if (event.name === 'word') {
          // Remove highlight from previous word
          wordElements.forEach(el => el.classList.remove('highlight'));
          
          // Highlight current word
          if (currentWordIndex < wordElements.length) {
            wordElements[currentWordIndex].classList.add('highlight');
            currentWordIndex++;
          }
        }
      };
      
      speech.onend = () => {
        speakBtn.classList.remove('speaking');
        wordElements.forEach(el => el.classList.remove('highlight'));
        setTimeout(() => {
          aboutText.innerHTML = `<span>${originalText}</span>`;
        }, 500);
      };
      
      speechSynthesis.speak(speech);
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  });
  
  // Load voices
  speechSynthesis.getVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }
}

// Add scroll-triggered scale effect
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
    
    if (isVisible) {
      section.style.opacity = '1';
      section.style.transform = 'scale(1)';
    }
  });
});