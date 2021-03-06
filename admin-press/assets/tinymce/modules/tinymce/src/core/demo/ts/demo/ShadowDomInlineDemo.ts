declare let tinymce: any;

export default function (init: ShadowRootInit) {

  const shadowHost = document.getElementById('shadow-host');

  const shadow = shadowHost.attachShadow(init);

  let i = 0;
  const addSection = (): void => {
    const node = document.createElement('div');
    node.textContent = 'contentImage section ' + i++;
    shadow.appendChild(node);
    tinymce.init({
      target: node,
      inline: true
    });
  };

  addSection();
  addSection();
  addSection();
}
