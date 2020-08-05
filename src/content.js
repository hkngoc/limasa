import _ from 'lodash';
import DMP from 'diff-match-patch';

import Elements from './utils';

const dmp = new DMP();

function isNear(path, otherPath) {
  // console.log(path, otherPath);

  if (path == otherPath) {
    return true;
  }

  // magical
  let diff = dmp.diff_main(path, otherPath);
  dmp.diff_cleanupSemantic(diff);

  if (diff && diff.length == 4) {
    const [ head, origin, change, tail ] = diff;
    if (head[0] == 0 && tail[0] == 0 && origin[0] == -1 && change[0] == 1) {
      return true;
    }
  }

  return false;
}

function findNearImage(url) {
  const img = document.querySelector(`img[src="${url}"]`);
  const { className } = img;

  const classes = className.split(" ").filter(c => !!c).join(".");

  let nears = document.querySelectorAll(`img.${classes}`);

  // console.log(nears);

  const mainXPath = Elements.DOMPath.xPath(img, false);
  nears = _(nears)
    .filter(near => {
      return isNear(mainXPath, Elements.DOMPath.xPath(near, false));
    })
    // .orderBy(near => Elements.DOMPath.xPath(near, false))
    .map(near => near.src)
    .filter(src => !!src)
    .value();

  const index = _.findIndex(nears, src => src == img.src);

  return [ nears, index];
}

function showImage(id, url) {
  const [ srcs, index ] = findNearImage(url);

  let dialog = document.querySelector("#limasa-dialog");
  if (!dialog) {
    const modal = document.createElement('dialog');
    modal.id = "limasa-dialog";
    modal.style.cssText = `
      position: fixed;
      height: 100%;
      width: 100%;
      z-index: 1;
      background-color: transparent;
      border: unset;
      padding: unset;
    `;
    modal.innerHTML = `
      <iframe id="limasa-viewer" style="height:100%; width: 100%;">
      </iframe>
    `;
    document.body.appendChild(modal);
    dialog = document.querySelector("#limasa-dialog");

    document.body.style.overflowY = "hidden";
    document.body.style.overflowX = "hidden";
  }

  dialog.showModal();
  const iframe = document.getElementById("limasa-viewer");
  const params = [ index, ...srcs ].join("#");

  iframe.src = chrome.extension.getURL(`index.html#${params}`);
  iframe.frameBorder = 0;
}

chrome.runtime.onMessage.addListener(request => {
  const { type } = request;

  if (type == "showImage") {
    const { id, url } = request;
    showImage(id, url);
  }
});
