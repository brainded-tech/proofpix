// Add this function to your component for debugging
const debugExifData = (exifData) => {
  console.log("EXIF Data Extract:", exifData);
  
  // Verify key components
  console.log("Date/Time present:", Boolean(exifData.dateTime));
  console.log("GPS data present:", Boolean(exifData.gps));
  console.log("Camera info present:", Boolean(exifData.camera));
  
  // Output any errors
  if (exifData.error) {
    console.error("EXIF Extraction Error:", exifData.error);
  }
};