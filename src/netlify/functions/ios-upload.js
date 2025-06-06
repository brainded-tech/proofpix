// netlify/functions/ios-upload.js
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Parse the multipart form data
    const contentType = event.headers['content-type'];
    if (!contentType.includes('multipart/form-data')) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Invalid content type' }) 
      };
    }

    // For now, just acknowledge receipt
    // In production, you'd process and store this data
    const uploadId = Date.now().toString();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        uploadId: uploadId,
        viewUrl: `https://upload.proofpixapp.com/view/${uploadId}`
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Upload failed' })
    };
  }
};