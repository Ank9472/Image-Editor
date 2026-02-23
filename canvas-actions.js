function drawImageOnCanvas(image) {
  const { canvas, context } = canvasState;
  if (!canvas || !context || !image) {
    return;
  }

  const container = canvas.parentElement;
  const maxWidth = Math.max(1, Math.floor(container.clientWidth - 40));
  const maxHeight = Math.max(1, Math.floor(container.clientHeight - 40));
  const ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
  const canvasWidth = Math.max(1, Math.floor(image.width * ratio));
  const canvasHeight = Math.max(1, Math.floor(image.height * ratio));

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
}

function renderCanvasWithFilters() {
  const { canvas, originalImage } = canvasState;
  if (!canvas || !originalImage) {
    return;
  }

  const values = getSliderValues();
  const filter = buildCanvasFilter(values);
  drawImageOnCanvas(originalImage);
  canvas.style.filter = filter;
}

function bindFilterEvents() {
  const sliders = document.querySelectorAll('.slider-track');
  sliders.forEach((slider) => {
    slider.addEventListener('input', () => {
      clearActivePreset();
      renderCanvasWithFilters();
    });
  });

  const presetButtons = document.querySelectorAll('.preset-btn');
  presetButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const presetName = button.dataset.preset;
      const preset = presetValues[presetName];
      if (!preset) {
        return;
      }

      setAllSliderValues(preset);
      setActivePreset(presetName);
      renderCanvasWithFilters();
    });
  });

  const resetButton = document.getElementById('reset-btn');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      resetAllSliders();
      setActivePreset('original');
      renderCanvasWithFilters();
    });
  }

  const downloadButton = document.getElementById('download-btn');
  if (downloadButton) {
    downloadButton.addEventListener('click', () => {
      const { canvas, originalImage } = canvasState;
      if (!canvas || !originalImage) {
        return;
      }

      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const exportContext = exportCanvas.getContext('2d');
      if (!exportContext) {
        return;
      }

      exportContext.filter = buildCanvasFilter(getSliderValues());
      exportContext.drawImage(originalImage, 0, 0, exportCanvas.width, exportCanvas.height);
      exportContext.filter = 'none';

      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
    });
  }

  window.addEventListener('resize', () => {
    renderCanvasWithFilters();
  });
}

function initCanvas() {
  const canvas = document.getElementById('editor-canvas');
  const imageInput = document.getElementById('image-input');
  const placeholder = document.querySelector('.placeholder');

  if (!canvas || !imageInput || !placeholder) {
    return;
  }

  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }

  canvasState.canvas = canvas;
  canvasState.context = context;
  canvasState.placeholder = placeholder;

  bindFilterEvents();

  imageInput.addEventListener('change', (event) => {
    const [file] = event.target.files || [];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const image = new Image();
      image.onload = () => {
        placeholder.style.display = 'none';
        canvas.style.display = 'block';
        canvasState.originalImage = image;
        setActivePreset('original');
        renderCanvasWithFilters();
      };
      image.src = loadEvent.target?.result;
    };
    reader.readAsDataURL(file);
  });
}
