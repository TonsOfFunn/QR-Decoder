const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const resultArea = document.getElementById('result-area');
const payloadContent = document.getElementById('payload-content');
const errorMsg = document.getElementById('error-msg');
const vtContainer = document.getElementById('vt-container');
const vtLink = document.getElementById('vt-link');

// Utils
const showError = (msg) => {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
    resultArea.classList.remove('active');
};

const hideError = () => {
    errorMsg.style.display = 'none';
};

const isValidUrl = (string) => {
    try {
        const url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
        return false;
    }
};

const generateVtIdentifier = (url) => {
    // 1. URL string to UTF-8 encoded string
    const utf8Str = unescape(encodeURIComponent(url));
    // 2. Base64 Encode
    const b64 = btoa(utf8Str);
    // 3. Replace + with - and / with _
    const urlSafe = b64.replace(/\+/g, '-').replace(/\//g, '_');
    // 4. Strip trailing padding =
    return urlSafe.replace(/=+$/, '');
};

const processImage = (imageSource) => {
    hideError();
    resultArea.classList.remove('active');
    vtContainer.style.display = 'none';

    const img = new Image();
    
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // Decode
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
            payloadContent.textContent = code.data;
            resultArea.classList.add('active');

            if (isValidUrl(code.data)) {
                const identifier = generateVtIdentifier(code.data);
                vtLink.href = `https://www.virustotal.com/gui/url/${identifier}/detection`;
                vtContainer.style.display = 'block';
            }
        } else {
            showError("No QR code found in the image.");
        }
    };

    img.onerror = () => {
        showError("Invalid image file.");
    };

    img.src = imageSource;
};

const readFiles = (files) => {
    if (files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
        showError("Please upload a valid image file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => processImage(e.target.result);
    reader.readAsDataURL(file);
};

// Event Listeners

// Click to upload
dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    readFiles(e.target.files);
    fileInput.value = ''; // Reset
});

// Drag & Drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    readFiles(e.dataTransfer.files);
});

// Paste
document.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            readFiles([blob]);
            break;
        }
    }
});
