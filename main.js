document.addEventListener('DOMContentLoaded', () => {
    const recipientNameElem = document.getElementById('recipientName');
    const yearsElem = document.getElementById('years');

    const inputNameElem = document.getElementById('inputName');
    const inputYearsElem = document.getElementById('inputYears');
    const generateUrlButton = document.getElementById('generateUrlButton');
    const generatedUrlElem = document.getElementById('generatedUrl');
    const copyUrlButton = document.getElementById('copyUrlButton');
    const copyMessageElem = document.getElementById('copyMessage');
    const downloadPdfButton = document.getElementById('downloadPdfButton');

    // Function to update certificate from data object
    function updateCertificate(data) {
        const name = data.name || 'ERROR';
        const years = data.years || '0';

        recipientNameElem.textContent = name;
        yearsElem.textContent = years;
    }

    // Parse URL on load
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');

    if (encodedData) {
        try {
            // Decode Base64 and parse JSON
            const decodedString = atob(encodedData);
            const data = JSON.parse(decodedString);
            updateCertificate(data);

            // Pre-fill input fields if data was loaded from URL
            inputNameElem.value = data.name || '';
            inputYearsElem.value = data.years || '';

        } catch (e) {
            console.error("Error decoding or parsing URL data:", e);
            // Fallback to defaults if decoding fails
            updateCertificate({});
        }
    } else {
        // Set default values and pre-fill date input if no encoded data
        updateCertificate({});
    }

    // Event listener for generating URL
    generateUrlButton.addEventListener('click', () => {
        const data = {
            name: inputNameElem.value || 'ERROR',
            years: inputYearsElem.value || '0'
        };

        const jsonString = JSON.stringify(data);
        const encodedString = btoa(jsonString); // Base64 encode

        // Construct the new URL. Get base path (e.g., 'index.html' or just '/')
        const baseUrl = window.location.origin + window.location.pathname.split('?')[0];
        const newUrl = `${baseUrl}?data=${encodedString}`;
        generatedUrlElem.value = newUrl;

        // Update the certificate display live
        updateCertificate(data);
    });

    // Event listener for copying URL
    copyUrlButton.addEventListener('click', () => {
        generatedUrlElem.select();
        document.execCommand('copy');
        copyMessageElem.classList.remove('hidden');
        setTimeout(() => {
            copyMessageElem.classList.add('hidden');
        }, 2000);
    });

    // Event listener for PDF download
    downloadPdfButton.addEventListener('click', () => {
        const certificateElement = document.getElementById('certificate');
        // Clone the element to avoid modifying the displayed certificate for PDF generation
        const clonedElement = certificateElement.cloneNode(true);
        clonedElement.classList.add('hola'); // Add a class for specific styles if needed

        // Append cloned element to body temporarily to ensure correct rendering by html2canvas
        document.body.appendChild(clonedElement);

        let result = html2pdf().set({
            filename: 'CertificadoCantoria.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2, // Higher scale for better quality
                logging: true,
                scrollY: -window.scrollY, // Capture content that is off-screen correctly
                width: clonedElement.offsetWidth,
                height: clonedElement.offsetHeight,
                x: 0,
                windowWidth: clonedElement.offsetWidth,
                windowHeight: clonedElement.offsetHeight,
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        }).from(clonedElement).save().finally(() => {
            // Remove the cloned element after PDF generation
            document.body.removeChild(clonedElement);
        });

        console.log(result);
    });
});