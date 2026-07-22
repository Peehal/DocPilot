import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { api } from '@/lib/api';

export const ImageUpload = forwardRef(function ImageUpload({ editor }, ref) {
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => inputRef.current?.click(),
  }));

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !editor) return;

    setIsUploading(true);
    try {
      const { data: sig } = await api.get('/uploads/signature');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', sig.apiKey);
      formData.append('timestamp', sig.timestamp);
      formData.append('signature', sig.signature);
      formData.append('folder', sig.folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const uploaded = await res.json();

      if (uploaded.secure_url) {
        editor.chain().focus().setImage({ src: uploaded.secure_url }).run();
      } else {
        console.error('Cloudinary upload failed:', uploaded);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleChange}
      disabled={isUploading}
    />
  );
});
