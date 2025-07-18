import React from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

const Editor = ({ value, onEditorChange }) => {
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  return (
    <TinyMCEEditor
      apiKey={apiKey}
      value={value}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | image | help',
        images_upload_handler: (blobInfo) => new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blobInfo.blob());
        }),
      }}
      onEditorChange={onEditorChange}
    />
  );
};

export default Editor;
