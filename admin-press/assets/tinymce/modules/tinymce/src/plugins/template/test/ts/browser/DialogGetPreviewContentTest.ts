import { Log, Pipeline, Step } from '@ephox/agar';
import { Assert, UnitTest } from '@ephox/bedrock-client';
import { TinyApis, TinyLoader } from '@ephox/mcagar';
import Env from 'tinymce/core/api/Env';
import TemplatePlugin from 'tinymce/plugins/template/Plugin';
import { getPreviewContent } from 'tinymce/plugins/template/ui/Dialog';
import SilverTheme from 'tinymce/themes/silver/Theme';

const metaKey = Env.mac ? 'e.metaKey' : 'e.ctrlKey && !e.altKey';

const noCorsNoStyle = '<!DOCTYPE html><html><head>' +
  '<base href="http://localhost:8000/">' +
  '<link type="text/css" rel="stylesheet" href="http://localhost:8000/project/tinymce/js/tinymce/skins/ui/oxide/contentImage.min.css">' +
  '<link type="text/css" rel="stylesheet" href="http://localhost:8000/project/tinymce/js/tinymce/skins/contentImage/default/contentImage.css">' +
  '<script>document.addEventListener && document.addEventListener("click", function(e) {for (var elm = e.target; elm; elm = elm.parentNode) {if (elm.nodeName === "A" && !(' +
  metaKey +
  ')) {e.preventDefault();}}}, false);</script> ' +
  '</head><body class=""></body></html>';

const corsNoStyle = '<!DOCTYPE html><html><head>' +
  '<base href=\"http://localhost:8000/\">' +
  '<link type=\"text/css\" rel=\"stylesheet\" href=\"http://localhost:8000/project/tinymce/js/tinymce/skins/ui/oxide/contentImage.min.css\" crossorigin=\"anonymous\">' +
  '<link type=\"text/css\" rel=\"stylesheet\" href=\"http://localhost:8000/project/tinymce/js/tinymce/skins/contentImage/default/contentImage.css\" crossorigin=\"anonymous\">' +
  '<script>document.addEventListener && document.addEventListener(\"click\", function(e) {for (var elm = e.target; elm; elm = elm.parentNode) {if (elm.nodeName === \"A\" && !(' +
  metaKey +
  ')) {e.preventDefault();}}}, false);</script> </head><body class=\"\"></body></html>';

const noCorsStyle = '<!DOCTYPE html><html><head>' +
  '<base href=\"http://localhost:8000/\">' +
  '<style type=\"text/css\">This is the style inserted into the document</style>' +
  '<link type=\"text/css\" rel=\"stylesheet\" href=\"http://localhost:8000/project/tinymce/js/tinymce/skins/ui/oxide/contentImage.min.css\">' +
  '<link type=\"text/css\" rel=\"stylesheet\" href=\"http://localhost:8000/project/tinymce/js/tinymce/skins/contentImage/default/contentImage.css\">' +
  '<script>document.addEventListener && document.addEventListener(\"click\", function(e) {for (var elm = e.target; elm; elm = elm.parentNode) {if (elm.nodeName === \"A\" && !(' +
  metaKey +
  ')) {e.preventDefault();}}}, false);</script> ' +
  '</head><body class=\"\"></body></html>';

const corsStyle = '<!DOCTYPE html><html><head>' +
  '<base href=\"http://localhost:8000/\">' +
  '<style type=\"text/css\">This is the style inserted into the document</style>' +
  '<link type=\"text/css\" rel=\"stylesheet\" href=\"http://localhost:8000/project/tinymce/js/tinymce/skins/ui/oxide/contentImage.min.css\" crossorigin=\"anonymous\">' +
  '<link type=\"text/css\" rel=\"stylesheet\" href=\"http://localhost:8000/project/tinymce/js/tinymce/skins/contentImage/default/contentImage.css\" crossorigin=\"anonymous\">' +
  '<script>document.addEventListener && document.addEventListener(\"click\", function(e) {for (var elm = e.target; elm; elm = elm.parentNode) {if (elm.nodeName === \"A\" && !(' +
  metaKey +
  ')) {e.preventDefault();}}}, false);</script> ' +
  '</head><body class=\"\"></body></html>';

const corsStyleAndContent = '<!DOCTYPE html><html><head>' +
  '<base href=\"http://localhost:8000/\">' +
  '<style type=\"text/css\">This is the style inserted into the document</style>' +
  '<link type=\"text/css\" rel=\"stylesheet\" href=\"http://localhost:8000/project/tinymce/js/tinymce/skins/ui/oxide/contentImage.min.css\" crossorigin=\"anonymous\">' +
  '<link type=\"text/css\" rel=\"stylesheet\" href=\"http://localhost:8000/project/tinymce/js/tinymce/skins/contentImage/default/contentImage.css\" crossorigin=\"anonymous\">' +
  '<script>document.addEventListener && document.addEventListener(\"click\", function(e) {for (var elm = e.target; elm; elm = elm.parentNode) {if (elm.nodeName === \"A\" && !(' +
  metaKey +
  ')) {e.preventDefault();}}}, false);</script> ' +
  '</head>' +
  '<body class=\"\">Custom contentImage which was provided</body></html>';

UnitTest.asynctest('browser.tinymce.plugins.template.Dialog.getPreviewContent', (success, failure) => {
  TemplatePlugin();
  SilverTheme();

  TinyLoader.setupLight((editor, onSuccess, onFailure) => {
    const tinyApis = TinyApis(editor);

    const sCheckPreview = (expected: string, html?: string) =>
      Step.sync(() =>
        Assert.eq('', expected, getPreviewContent(editor, html ? html : '')));

    Pipeline.async({}, [
      Log.stepsAsStep('TINY-6115', 'Dialog.getPreviewcontent: No CORS or contentImage style, no previous HTML', [
        sCheckPreview(noCorsNoStyle)
      ]),
      Log.stepsAsStep('TINY-6115', 'Dialog.getPreviewcontent: CORS but no contentImage style, no previous HTML', [
        tinyApis.sSetSetting('content_css_cors', true),
        sCheckPreview(corsNoStyle),
        tinyApis.sDeleteSetting('content_css_cors')
      ]),
      Log.stepsAsStep('TINY-6115', 'Dialog.getPreviewcontent: No CORS but contentImage style, no previous HTML', [
        tinyApis.sSetSetting('content_style', 'This is the style inserted into the document'),
        sCheckPreview(noCorsStyle),
        tinyApis.sDeleteSetting('content_style')
      ]),
      Log.stepsAsStep('TINY-6115', 'Dialog.getPreviewcontent: CORS and contentImage style, no previous HTML', [
        tinyApis.sSetSetting('content_style', 'This is the style inserted into the document'),
        tinyApis.sSetSetting('content_css_cors', true),
        sCheckPreview(corsStyle),
        tinyApis.sDeleteSetting('content_style'),
        tinyApis.sDeleteSetting('content_css_cors')
      ]),
      Log.stepsAsStep('TINY-6115', 'Dialog.getPreviewcontent: with provided contentImage', [
        tinyApis.sSetSetting('content_style', 'This is the style inserted into the document'),
        tinyApis.sSetSetting('content_css_cors', true),
        sCheckPreview(corsStyleAndContent, 'Custom contentImage which was provided'),
        tinyApis.sDeleteSetting('content_style'),
        tinyApis.sDeleteSetting('content_css_cors')
      ]),
      Log.stepsAsStep('TINY-6115', 'Dialog.getPreviewcontent: with provided html', [
        tinyApis.sSetSetting('content_style', 'This is the style inserted into the document'),
        tinyApis.sSetSetting('content_css_cors', true),
        sCheckPreview('<html>Custom contentImage here', '<html>Custom contentImage here'),
        tinyApis.sDeleteSetting('content_style'),
        tinyApis.sDeleteSetting('content_css_cors')
      ])
    ], onSuccess, onFailure);
  }, {
    theme: 'silver',
    plugins: 'template',
    toolbar: 'template',
    indent: false,
    base_url: '/project/tinymce/js/tinymce'
  }, success, failure);
});
