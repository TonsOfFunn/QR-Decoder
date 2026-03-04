# QR Code Payload Decoder

A small, client-side tool that decodes QR codes from images and shows the raw payload. If the payload is a URL, you can open it on VirusTotal to check it before visiting—no data is sent to any server.

## Features

- **Three ways to supply an image:** drag-and-drop onto the drop zone, click to open the file picker, or paste from clipboard (e.g. Ctrl+V).
- **Decoded payload** shown in a clear area below the upload zone. Works for any QR encoding (numeric, alphanumeric, byte, etc.).
- **Error handling:** shows a message if no QR is found or the image is invalid.
- **VirusTotal link:** when the decoded payload is an `http://` or `https://` URL, a button opens that URL’s VirusTotal report in a new tab. The link is built client-side (base64url path segment); no VirusTotal API or backend is used.
- **Dark theme** and single-page layout.

## Run locally

1. Clone or download this repo.
2. Ensure `index.html` and `app.js` are in the same folder.
3. Open `index.html` in a browser, or serve the folder with a local server (e.g. `npx serve .` or your editor’s Live Server).

No build step or backend required.

## Tech

- **Decoding:** [jsQR](https://github.com/cozmo/jsQR) (loaded from jsdelivr).
- **Stack:** One HTML file (`index.html`) and one JavaScript file (`app.js`). All processing runs in the browser.

## Privacy and security

- Decoding and link construction happen entirely in your browser. Images and decoded content are not sent to this project’s host or any third party.
- When you click “Check on VirusTotal,” only your browser requests VirusTotal; the decoder page does not send the URL to a backend.
- Use at your own discretion. This tool does not store or log your data.

## License

Use and modify as you like. No warranty.
