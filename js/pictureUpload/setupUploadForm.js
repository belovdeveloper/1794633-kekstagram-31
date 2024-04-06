import { isEscapeKey } from '../utils/commonUtils.js';
import {
  isValidByPristine,
  resetPristineValidation,
} from './validateUploadForm.js';
import { setupScalingForUploadedPicture, resetScalingForUploadedPicture } from './previewScaling.js';
import { setupEffectsForUploadedPicture } from './effects/setupSlider.js';
import { resetEffectOnPrevewNode } from './effects/applySettings.js';
import { sendData } from '../persistence/fetchApi.js';

const pictureUploadFormNode = document.querySelector('#upload-select-image');
const fileUploadInputNode = pictureUploadFormNode.querySelector('#upload-file');
const pictureEditContainerNode = pictureUploadFormNode.querySelector(
  '.img-upload__overlay',
);
const pictureEditCancelButtonNode = pictureEditContainerNode.querySelector(
  '.img-upload__cancel',
);

const onDocumentEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closePictureEditForm();
  }
};

function setupSubmitActionForUploadForm() {
  pictureUploadFormNode.addEventListener('submit', (evt) => {
    evt.preventDefault();
    // console.log('Форма ', isValidByPristine() ? 'валидна' : 'не валидна');

    if (isValidByPristine()) {
      sendData(new FormData(evt.target))
        .then(() => {
          closePictureEditForm();
          // addSuccessMessage();
        })
        .catch(() => {
          // addErrorMessage();
        });
    }
  });
}

function showPicturePreview() {
  const FILE_TYPES = ['jpg', 'jpeg', 'png', 'webp'];
  const picturePreview = document.querySelector('.img-upload__preview img');
  const effectsPreview = document.querySelectorAll('.effects__preview');

  const file = fileUploadInputNode.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((elem) => fileName.endsWith(elem));

  if (matches) {
    picturePreview.src = URL.createObjectURL(file);
    effectsPreview.forEach((elem) => {
      elem.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
    });
  }
}

function closePictureEditForm() {
  pictureEditContainerNode.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentEscKeydown);

  pictureUploadFormNode.reset();
  resetEffectOnPrevewNode();
  resetScalingForUploadedPicture();
  resetPristineValidation();
}

function openEditPictureForm() {
  pictureEditContainerNode.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentEscKeydown);

  showPicturePreview();
}

export default function setupPictureUploadForm() {
  fileUploadInputNode.addEventListener('change', () => openEditPictureForm());

  pictureEditCancelButtonNode.addEventListener('click', (evt) => {
    evt.preventDefault();
    closePictureEditForm();
  });

  setupScalingForUploadedPicture();
  setupEffectsForUploadedPicture();
  setupSubmitActionForUploadForm();
}