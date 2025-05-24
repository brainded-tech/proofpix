// utils/fileUtils.js
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Not a valid image file' };
  }
  
  if (file.size > 50 * 1024 * 1024) {
    return { valid: false, error: 'File size exceeds 50MB limit' };
  }
  
  return { valid: true };
};