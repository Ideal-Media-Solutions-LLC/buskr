import React from 'react';
import ImageUploading from 'react-images-uploading';
import styles from '../../styles/ImageUploader.module.css';

export default function ImageUploader({ handleImage, handleGoBack }) {
  const [images, setImages] = React.useState([]);
  const maxNumber = 10;
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  return (
    <div className={styles.uploadImageViewContainer}>
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className={styles.uploadImageViewContainer}>
            <div className={styles.dragAreaAndButtonsContainer}>
              {images.length === 0
                ? <button className={isDragging ? styles.dragging : styles.clickOrDrag}
                    onClick={onImageUpload}{...dragProps}>
                    Click or Drop here
                  </button>
                : <button className={styles.dragged} onClick={onImageUpload}{...dragProps}>
                    <img className={styles.currentImage} src={images[images.length - 1].data_url} alt=''/>
                  </button>
              }
              &nbsp;
              <div className={styles.backRemoveButtonsContainer}>
                  <button className={styles.goBack} onClick={handleGoBack}>Go Back</button>
                  <button className={styles.removeImage} onClick={onImageRemoveAll}>
                    Remove Image
                  </button>
              </div>
              {/* GALLERY AT BOTTOM */}
              {/* {imageList.map((image, index) => (
                <div key={index} className="image-item">
                <img src={image.data_url} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                <button onClick={() => onImageUpdate(index)}>Update</button>
                <button onClick={() => onImageRemove(index)}>Remove</button>
                </div>
                </div>
              ))} */}
            </div>
            {images.length > 0 ? <button onClick={() => handleImage(images[images.length - 1].data_url)}className='master-button'>Add Image</button>
              : <button className={styles.addImageGreyedOut}>Add Image</button>
            }
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
