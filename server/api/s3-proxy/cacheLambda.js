import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client();

export const lambda_handler = async (event) => {
  const contentType = event.headers['content-type'];
  if (!contentType || !contentType.startsWith('multipart/form-data')) {
    return {
      statusCode: 400,
      body: 'Invalid content type. Expected multipart/form-data'
    };
  }

  const formData = parseFormData(event.body);

  if (!formData.files || !formData.files.image) {
    return {
      statusCode: 400,
      body: 'Image file not found in form data'
    };
  }

  const image = formData.files.image;

  // Generate a unique filename for the image
  const filename = `image_${Date.now()}.jpg`;

  const params = {
    Bucket: 'your-s3-bucket-name',
    Key: filename,
    Body: image.data,
    ContentType: image.type
  };

  try {
    const command = new PutObjectCommand(params);
    const uploadResult = await s3Client.send(command);
    console.log('Image uploaded successfully:', uploadResult.Location);
    return {
      statusCode: 200,
      body: 'Image uploaded successfully'
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      statusCode: 500,
      body: 'Error uploading image'
    };
  }
};

function parseFormData(body) {
  const formData = {};
  const lines = body.split('\r\n');

  let currentField = null;
  let currentFile = null;

  for (const line of lines) {
    if (line.startsWith('Content-Disposition')) {
      const matches = line.match(/name="([^"]+)"/);
      if (matches) {
        const fieldName = matches[1];
        if (line.includes('filename')) {
          currentFile = { data: '', type: '' };
          currentField = null;
          formData.files = formData.files || {};
          formData.files[fieldName] = currentFile;
        } else {
          currentField = { value: '' };
          formData[fieldName] = currentField;
        }
      }
    } else if (line.startsWith('Content-Type') && currentFile) {
      const matches = line.match(/([^;]+)/);
      if (matches) {
        currentFile.type = matches[1].trim();
      }
    } else if (line !== '' && currentField) {
      currentField.value += line + '\n';
    } else if (line !== '' && currentFile) {
      currentFile.data += line + '\n';
    }
  }

  return formData;
}