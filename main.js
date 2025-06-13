document.addEventListener('DOMContentLoaded', () => {
    const recipientNameElem = document.getElementById('recipientName');
    const courseNameElem = document.getElementById('courseName');
    const completionDateElem = document.getElementById('completionDate');

    const inputNameElem = document.getElementById('inputName');
    const inputCourseElem = document.getElementById('inputCourse');
    const inputDateElem = document.getElementById('inputDate');
    const generateUrlButton = document.getElementById('generateUrlButton');
    const generatedUrlElem = document.getElementById('generatedUrl');
    const copyUrlButton = document.getElementById('copyUrlButton');
    const copyMessageElem = document.getElementById('copyMessage');
    const downloadPdfButton = document.getElementById('downloadPdfButton');

    // Function to update certificate from data object
    function updateCertificate(data) {
        const name = data.name || 'ERROR';
        const course = data.course || 'Outstanding Program';
        const date = data.date || new Date().toISOString().slice(0, 10);

        recipientNameElem.textContent = name;
        // courseNameElem.textContent = course;
        // completionDateElem.textContent = new Date(date).toLocaleDateString('en-US', {
        //     year: 'numeric',
        //     month: 'long',
        //     day: 'numeric'
        // });
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
            inputCourseElem.value = data.course || '';
            inputDateElem.value = data.date || '';

        } catch (e) {
            console.error("Error decoding or parsing URL data:", e);
            // Fallback to defaults if decoding fails
            updateCertificate({});
        }
    } else {
        // Set default values and pre-fill date input if no encoded data
        updateCertificate({});
        inputDateElem.value = new Date().toISOString().slice(0, 10);
    }

    // Event listener for generating URL
    generateUrlButton.addEventListener('click', () => {
        const data = {
            name: inputNameElem.value || 'ERROR',
            course: inputCourseElem.value || 'Outstanding Program',
            date: inputDateElem.value || new Date().toISOString().slice(0, 10)
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

        // Append cloned element to body temporarily to ensure correct rendering by html2canvas
        document.body.appendChild(clonedElement);

        let result = html2pdf().set({
            filename: 'CertificadoCantoria.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 4, // Higher scale for better quality
                logging: true,
                scrollY: -window.scrollY // Capture content that is off-screen correctly
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        }).from(clonedElement).save().finally(() => {
            // Remove the cloned element after PDF generation
            document.body.removeChild(clonedElement);
        });

        console.log(result);
    });

    // Set default date for input field
    inputDateElem.value = new Date().toISOString().slice(0, 10);
});