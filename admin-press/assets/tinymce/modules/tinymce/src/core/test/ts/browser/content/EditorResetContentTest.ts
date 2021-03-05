import { Assertions, GeneralSteps, Logger, Pipeline, Step } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { TinyApis, TinyLoader } from '@ephox/mcagar';
import Editor from 'tinymce/core/api/Editor';
import Theme from 'tinymce/themes/silver/Theme';

UnitTest.asynctest('browser.tinymce.core.contentImage.EditorResetContentTest', (success, failure) => {
  Theme();

  TinyLoader.setupLight((editor: Editor, onSuccess, onFailure) => {
    const tinyApis = TinyApis(editor);

    const sResetContent = (content?: string) => Step.sync(() => {
      editor.resetContent(content);
    });

    const sAssertEditorState = (content: string) => Step.sync(() => {
      const html = editor.getContent();
      Assertions.assertHtml('Editor contentImage should be expected html', content, html);
      Assertions.assertEq('Editor should not be dirty', false, editor.isDirty());
      Assertions.assertEq('UndoManager should not have any undo levels', false, editor.undoManager.hasUndo());
      Assertions.assertEq('UndoManager should not have any redo levels', false, editor.undoManager.hasRedo());
      Assertions.assertEq('Editor start contentImage should match the original contentImage', '<p><br data-mce-bogus="1"></p>', editor.startContent);
    });

    Pipeline.async({}, [
      Logger.t('Reset editor contentImage/state with initial contentImage', GeneralSteps.sequence([
        tinyApis.sSetContent('<p>some</p><p>contentImage</p>'),
        sResetContent(),
        sAssertEditorState('')
      ])),
      Logger.t('Reset editor contentImage/state with custom contentImage', GeneralSteps.sequence([
        tinyApis.sSetContent('<p>some</p><p>contentImage</p>'),
        sResetContent('<p>html</p>'),
        sAssertEditorState('<p>html</p>')
      ])),
      Logger.t('Reset editor contentImage/state with multiple undo levels', GeneralSteps.sequence([
        tinyApis.sSetContent('<p>some</p><p>contentImage</p>'),
        Step.sync(() => editor.undoManager.add()),
        tinyApis.sSetContent('<p>some</p><p>other</p><p>contentImage</p>'),
        Step.sync(() => editor.undoManager.add()),
        tinyApis.sNodeChanged(),
        Step.sync(() => {
          Assertions.assertEq('Editor should be dirty', true, editor.isDirty());
          Assertions.assertEq('UndoManager should have some undo levels', true, editor.undoManager.hasUndo());
        }),
        sResetContent('<p>html</p>'),
        sAssertEditorState('<p>html</p>')
      ]))
    ], onSuccess, onFailure);
  }, {
    base_url: '/project/tinymce/js/tinymce'
  }, success, failure);
});
