declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'codesample code',
  toolbar: 'codesample code',
  content_css: '../../../../../js/tinymce/skins/contentImage/default/contentImage.css',
  height: 600
});

tinymce.init({
  selector: 'div.tinymce',
  inline: true,
  plugins: 'codesample code',
  toolbar: 'codesample code',
  content_css: '../../../../../js/tinymce/skins/contentImage/default/contentImage.css',
  height: 600
});

export {};
