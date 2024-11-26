document.getElementById('imageUpload').addEventListener('change', function(e) {
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function(event) {
      // Get the image element and set the source to the uploaded file's data URL
      const imgElement = document.getElementById('imagePreview');
      imgElement.style.display = 'block'; // Show the image preview
      imgElement.src = event.target.result; // Set the preview image source
    }

    reader.readAsDataURL(file); // Read the file as a data URL
  }
});

document.getElementById('submitButton').addEventListener('click', async () => {
  const fileInput = document.getElementById('imageUpload');
  const errorDiv = document.getElementById('error');
  const resultDiv = document.getElementById('extractedText');
  
  // Clear previous messages
  errorDiv.textContent = '';
  resultDiv.textContent = '';
  
  // Check if a file is selected
  if (!fileInput.files.length) {
    errorDiv.textContent = 'Please select an image file to upload.';
    return;
  }
  
  const file = fileInput.files[0];
  
  // Create FormData to send the image file
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    // Send POST request to upload the file and extract text
    const response = await fetch('http://localhost:3000/ocr/upload-image', {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error('Failed to upload image or extract text');
    }
  
    const result = await response.json();
  
    // Display the extracted text or an error message
    if (result.success) {
      resultDiv.textContent = result.extractedText;
    } else {
      errorDiv.textContent = 'Failed to extract text. Try another image.';
    }
  } catch (error) {
    console.error('Error:', error);
    errorDiv.textContent = 'An error occurred. Please try again later.';
  }
});
