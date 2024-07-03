function set_colour_key(imageData, r, g, b, threshold = 0) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        if (Math.abs(data[i] - r) <= threshold &&
            Math.abs(data[i + 1] - g) <= threshold &&
            Math.abs(data[i + 2] - b) <= threshold) {
        data[i + 3] = 0; // Alpha channel
        }
    }
}

export function load_assets(func) {
    const img = new Image();
    let processedImage = null;
    img.src = './Assets/boid.png';
    img.onload = function() {
        const offScreenCanvas = document.createElement('canvas');
        const offScreenContext = offScreenCanvas.getContext('2d');
        offScreenCanvas.width = img.width;
        offScreenCanvas.height = img.height;
        offScreenContext.drawImage(img, 0, 0);

        const imageData = offScreenContext.getImageData(0, 0, img.width, img.height);
        const colorKey = [255, 255, 255];
        set_colour_key(imageData, colorKey[0], colorKey[1], colorKey[2]);
        offScreenContext.putImageData(imageData, 0, 0);

        processedImage = new Image();
        processedImage.src = offScreenCanvas.toDataURL(); // canvas --> png

        processedImage.onload = function() {
            func(processedImage);
        };
    };
}

export function degrees_to_radians(degrees) {
    return degrees * (Math.PI / 180);
}