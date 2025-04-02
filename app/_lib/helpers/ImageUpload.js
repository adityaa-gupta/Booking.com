import supabase from '../supabase'; // Ensure this is correctly configured and imported

const uploadImage = async (file) => {
  if (!file || !file.name) {
    console.error('Invalid file or file name is missing');
    return { error: 'Invalid file or file name is missing' };
  }

  try {
    const fileName = `${Date.now()}-${file.name}`; // Unique filename
    const { data, error } = await supabase.storage
      .from('USB') // Ensure the bucket name is correct
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false, // Avoid overwriting existing files
      });

    if (error) {
      console.error('Upload Error:', error.message);
      return { error: error.message };
    }

    // Get public URL of the uploaded image
    const { data: publicURLData, error: publicURLError } = supabase.storage
      .from('USB')
      .getPublicUrl(fileName);

    if (publicURLError) {
      console.error('Failed to retrieve public URL:', publicURLError.message);
      return { error: publicURLError.message };
    }

    if (!publicURLData || !publicURLData.publicUrl) {
      console.error('Public URL is missing in the response');
      return { error: 'Public URL is missing in the response' };
    }

    return { url: publicURLData.publicUrl };
  } catch (err) {
    console.error('Unexpected Error:', err.message);
    return { error: 'Unexpected error occurred during upload' };
  }
};

export default uploadImage;
