const elements = {
  bootScreen: document.getElementById('loading-overlay'),
  textInput: document.getElementById('text-input'),
  analyzeBtn: document.getElementById('analyze-btn'),
  btnText: document.getElementById('btn-text'),
  btnSpinner: document.getElementById('btn-spinner'),
  outputSection: document.getElementById('output-section'),
  sentimentLabel: document.getElementById('sentiment-label'),
  confidencePercentage: document.getElementById('confidence-percentage'),
  ringFill: document.getElementById('ring-fill'),
  downloadPercentage: document.getElementById('download-percentage'),
  downloadProgressFill: document.getElementById('download-progress-fill'),
  downloadFileName: document.getElementById('download-file-name'),
  charCount: document.getElementById('char-count')
};

// Start Web Worker for non-blocking UI Logic
const worker = new Worker(new URL('./worker.js', import.meta.url), {
    type: 'module'
});

// Holographic Theme Colors
const themeMap = {
  positive: '#00FF88', // Bioluminescent Green
  negative: '#FF0055', // Laser Red
  neutral:  '#A1A1AA'  // Quartz
};

function getEmotionIntensity(label, score) {
   let base = 'Neutral';
   if (label.includes('positive')) base = 'Positive';
   else if (label.includes('negative')) base = 'Negative';

   if (base === 'Neutral') return { emotion: 'neutral', intensity: 'Absolute Neutral' };

   // Logic Art Directive applies nuance processing!
   let intensity = '';
   if (score >= 95) intensity = `Overwhelmingly ${base}`;
   else if (score >= 80) intensity = `Highly ${base}`;
   else if (score >= 60) intensity = `Moderately ${base}`;
   else intensity = `Slightly ${base}`;
   
   return { emotion: base.toLowerCase(), intensity };
}

worker.addEventListener('message', (event) => {
    const message = event.data;
    
    if (message.type === 'progress') {
        const x = message.data;
        if (x.status === 'initiate') {
            elements.downloadFileName.innerText = x.file;
        } else if (x.status === 'progress' && x.loaded && x.total) {
            const pct = Math.round((x.loaded / x.total) * 100);
            elements.downloadProgressFill.style.width = `${pct}%`;
            elements.downloadPercentage.innerText = `${pct}% ALLOCATED`;
            elements.downloadFileName.innerText = x.file;
        }
    } else if (message.type === 'ready') {
        // Fade out boot screen
        elements.bootScreen.classList.add('fade-out');
        
        // Enable Interaction
        setTimeout(() => {
            elements.analyzeBtn.disabled = false;
            elements.btnText.innerText = 'Engage Scan';
            elements.btnSpinner.classList.add('hidden');
        }, 1000); 
    } else if (message.type === 'result') {
        const result = message.output[0]; 
        const scoreVal = Math.round(result.score * 100);
        
        // Refined emotional mapping
        const { emotion, intensity } = getEmotionIntensity(result.label, scoreVal);
        const color = themeMap[emotion];
        
        // Apply Global Aesthetic changes cleanly
        document.documentElement.style.setProperty('--theme-color', color);
        elements.sentimentLabel.innerText = intensity;
        
        // Ensure typography accommodates nuance strings seamlessly
        elements.sentimentLabel.style.fontSize = intensity.length > 18 ? '2.3rem' : '3.8rem';
        elements.confidencePercentage.innerText = `${scoreVal}%`;
        
        setTimeout(() => {
            elements.outputSection.classList.remove('hidden');
            void elements.outputSection.offsetWidth; // Reflow
            elements.outputSection.classList.add('active');
            document.body.classList.add('result-active');
            
            const offset = 377 - (377 * (scoreVal / 100));
            elements.ringFill.style.strokeDashoffset = offset;
        }, 50);

        setTimeout(() => {
            elements.analyzeBtn.disabled = false;
            elements.btnText.innerText = 'Engage Scan';
            elements.btnSpinner.classList.add('hidden');
        }, 800);
        
    } else if (message.type === 'error') {
         console.error("Worker Error details:", message.error);
         elements.btnText.innerText = 'Neural Engine Failure';
         elements.btnSpinner.classList.add('hidden');
    }
});

// Typing Info
elements.textInput.addEventListener('input', (e) => {
  const bytes = new Blob([e.target.value]).size;
  elements.charCount.innerText = `${bytes} B`;
});

// Processing 
function handleAnalyze() {
  const text = elements.textInput.value.trim();
  if (!text) return;

  elements.analyzeBtn.disabled = true;
  elements.btnText.innerText = 'Computing';
  elements.btnSpinner.classList.remove('hidden');
  
  elements.outputSection.classList.remove('active');
  elements.outputSection.classList.add('hidden');
  document.body.classList.remove('result-active');
  elements.ringFill.style.strokeDashoffset = 377; // Reset ring SVG length
  
  // Offload to Web Worker thread so UI doesn't drop frames!
  worker.postMessage({ type: 'predict', text });
}

// 3D Spatial Tilt Effect (Desktop Only)
const panels = document.getElementsByClassName('spatial-panel');
document.addEventListener('mousemove', (e) => {
  if (window.innerWidth <= 768) return; 

  const xAxis = (window.innerWidth / 2 - e.pageX) / 60;
  const yAxis = (window.innerHeight / 2 - e.pageY) / 60;
  
  for(let i=0; i<panels.length; i++) {
     panels[i].style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
  }
});

const resetTilt = () => {
  for(let i=0; i<panels.length; i++) {
     panels[i].style.transform = `rotateY(0deg) rotateX(0deg)`;
  }
};

document.addEventListener('mouseleave', resetTilt);
window.addEventListener('resize', () => {
    if(window.innerWidth <= 768) resetTilt();
});

elements.analyzeBtn.addEventListener('click', handleAnalyze);
elements.textInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
    handleAnalyze();
  }
});

// Initialize model on load via the Worker
elements.btnText.innerText = "Initiating...";
worker.postMessage({ type: 'load' });
