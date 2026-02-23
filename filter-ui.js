const filterStyles = `
.slider-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
}

.slider-row {
  display: grid;
  grid-template-columns: 110px 1fr;
  align-items: center;
  gap: 14px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.slider-row:last-child {
  border-bottom: none;
}

.slider-label {
  font-size: 13.5px;
  font-weight: 400;
  color: var(--text-label);
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.slider-track {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 3px;
  background: var(--track-bg);
  border-radius: 99px;
  outline: none;
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
}

.slider-track::-webkit-slider-runnable-track {
  height: 3px;
  border-radius: 99px;
  background: linear-gradient(
    to right,
    var(--accent) 0%,
    var(--accent) var(--value, 0%),
    var(--track-bg) var(--value, 0%),
    var(--track-bg) 100%
  );
}

.slider-track::-moz-range-track {
  height: 3px;
  border-radius: 99px;
  background: var(--track-bg);
}

.slider-track::-moz-range-progress {
  height: 3px;
  border-radius: 99px;
  background: var(--accent);
}

.slider-track::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent);
  border: none;
  cursor: pointer;
  margin-top: -5.5px;
  box-shadow: var(--thumb-shadow);
  transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
}

.slider-track::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent);
  border: none;
  cursor: pointer;
  box-shadow: var(--thumb-shadow);
  transition: transform 0.15s, box-shadow 0.15s;
}

.slider-track:hover::-webkit-slider-thumb,
.slider-track:focus::-webkit-slider-thumb {
  transform: scale(1.2);
  background: var(--accent-hover);
  box-shadow: 0 0 0 4px rgba(224, 48, 64, 0.3);
}

.slider-track:hover::-moz-range-thumb,
.slider-track:focus::-moz-range-thumb {
  transform: scale(1.2);
  background: var(--accent-hover);
  box-shadow: 0 0 0 4px rgba(224, 48, 64, 0.3);
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-top: 12px;
}

.preset-btn {
  -webkit-appearance: none;
  appearance: none;
  background: #202020;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-label);
  font-family: 'DM Sans', sans-serif;
  font-size: 11.5px;
  font-weight: 400;
  padding: 9px 4px;
  text-align: center;
  cursor: pointer;
  letter-spacing: 0.01em;
  transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preset-btn:hover {
  background: #2c2c2c;
  border-color: #3a3a3a;
  color: var(--text-primary);
}

.preset-btn:active {
  transform: scale(0.96);
}

.preset-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  font-weight: 500;
  box-shadow: 0 2px 10px rgba(224, 48, 64, 0.35);
}

.preset-btn.active:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.preset-btn:empty {
  background: transparent;
  border-color: transparent;
  pointer-events: none;
  cursor: default;
}

@media (max-width: 520px) {
  .slider-row {
    grid-template-columns: 90px 1fr;
    gap: 10px;
  }

  .preset-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
`;

function setSliderProgress(slider) {
  const min = Number(slider.min || 0);
  const max = Number(slider.max || 100);
  const value = Number(slider.value || 0);
  const percentage = ((value - min) * 100) / (max - min || 1);
  slider.style.setProperty('--value', `${percentage}%`);
}

function initFilterPanel() {
  const styleElement = document.createElement('style');
  styleElement.textContent = filterStyles;
  document.head.appendChild(styleElement);

  const sliders = document.querySelectorAll('.slider-track');
  sliders.forEach((slider) => {
    setSliderProgress(slider);
    slider.addEventListener('input', () => setSliderProgress(slider));
  });
}
