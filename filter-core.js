const sliderIds = {
  grayscale: 'grayscale-range',
  sepia: 'sepia-range',
  invert: 'invert-range',
  brightness: 'brightness-range',
  contrast: 'contrast-range',
  exposure: 'exposure-range',
  saturation: 'saturation-range',
  hue: 'hue-range',
  blur: 'blur-range',
  opacity: 'opacity-range',
};

const presetValues = {
  original: {
    grayscale: 0,
    sepia: 0,
    invert: 0,
    brightness: 0,
    contrast: 0,
    exposure: 0,
    saturation: 0,
    hue: 0,
    blur: 0,
    opacity: 100,
  },
  vivid: {
    grayscale: 0,
    sepia: 5,
    invert: 0,
    brightness: 8,
    contrast: 18,
    exposure: 5,
    saturation: 35,
    hue: 8,
    blur: 0,
    opacity: 100,
  },
  cold: {
    grayscale: 0,
    sepia: 0,
    invert: 0,
    brightness: -4,
    contrast: 8,
    exposure: -10,
    saturation: -8,
    hue: 180,
    blur: 0,
    opacity: 100,
  },
  warm: {
    grayscale: 0,
    sepia: 22,
    invert: 0,
    brightness: 6,
    contrast: 10,
    exposure: 8,
    saturation: 12,
    hue: 20,
    blur: 0,
    opacity: 100,
  },
  dramatic: {
    grayscale: 15,
    sepia: 8,
    invert: 0,
    brightness: -12,
    contrast: 28,
    exposure: -10,
    saturation: 18,
    hue: 0,
    blur: 0,
    opacity: 100,
  },
  dark: {
    grayscale: 10,
    sepia: 0,
    invert: 0,
    brightness: -28,
    contrast: 20,
    exposure: -25,
    saturation: -12,
    hue: 0,
    blur: 0,
    opacity: 100,
  },
};

const canvasState = {
  canvas: null,
  context: null,
  placeholder: null,
  originalImage: null,
};

function getSliderElement(key) {
  return document.getElementById(sliderIds[key]);
}

function getSliderValues() {
  return {
    grayscale: Number(getSliderElement('grayscale')?.value || 0),
    sepia: Number(getSliderElement('sepia')?.value || 0),
    invert: Number(getSliderElement('invert')?.value || 0),
    brightness: Number(getSliderElement('brightness')?.value || 0),
    contrast: Number(getSliderElement('contrast')?.value || 0),
    exposure: Number(getSliderElement('exposure')?.value || 0),
    saturation: Number(getSliderElement('saturation')?.value || 0),
    hue: Number(getSliderElement('hue')?.value || 0),
    blur: Number(getSliderElement('blur')?.value || 0),
    opacity: Number(getSliderElement('opacity')?.value || 100),
  };
}

function buildCanvasFilter(values) {
  const brightnessBase = 100 + values.brightness;
  const exposureBase = 100 + values.exposure;
  const combinedBrightness = Math.max(0, Math.round((brightnessBase * exposureBase) / 100));
  const contrast = Math.max(0, 100 + values.contrast);
  const saturation = Math.max(0, 100 + values.saturation);

  return [
    `grayscale(${values.grayscale}%)`,
    `sepia(${values.sepia}%)`,
    `invert(${values.invert}%)`,
    `brightness(${combinedBrightness}%)`,
    `contrast(${contrast}%)`,
    `saturate(${saturation}%)`,
    `hue-rotate(${values.hue}deg)`,
    `blur(${values.blur}px)`,
    `opacity(${values.opacity}%)`,
  ].join(' ');
}

function setActivePreset(presetName) {
  const presetButtons = document.querySelectorAll('.preset-btn');
  presetButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.preset === presetName);
  });
}

function clearActivePreset() {
  const presetButtons = document.querySelectorAll('.preset-btn');
  presetButtons.forEach((button) => button.classList.remove('active'));
}

function setAllSliderValues(values) {
  Object.entries(values).forEach(([key, value]) => {
    const slider = getSliderElement(key);
    if (!slider) {
      return;
    }

    slider.value = String(value);
    setSliderProgress(slider);
  });
}

function resetAllSliders() {
  Object.values(sliderIds).forEach((sliderId) => {
    const slider = document.getElementById(sliderId);
    if (!slider) {
      return;
    }

    slider.value = slider.defaultValue;
    setSliderProgress(slider);
  });
}
