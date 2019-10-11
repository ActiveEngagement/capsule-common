export default function download(blob, filename) {
    return new Promise((resolve, reject) => {
        if(!(blob instanceof Blob)) {
            blob = new Blob([blob], {
                type: 'text/html'
            });
        }

        const element = document.createElement('a');

        element.setAttribute('href', URL.createObjectURL(blob));
        element.setAttribute('download', filename);
        element.style.display = 'none';

        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);

        resolve();
    });
}
