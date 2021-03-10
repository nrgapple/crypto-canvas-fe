import React, { useCallback, useState } from "react";
import { useDropArea } from "react-use";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "reactstrap";
//@ts-ignore
import PixelBitmap from "pixel-bmp";

type Props = ModalProps & { close: () => void };

const UploadModal = ({ close, ...rest }: Props) => {
  const [file, setFile] = useState<File | undefined>(undefined);

  const onFiles = async (files: File[]) => {
    const mainFile = files[0];
    try {
      const images = await PixelBitmap.parse(mainFile);
      if (images && images[0]) {
        const mainImage = images[0];
        console.log(mainImage);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const [bond, state] = useDropArea({
    onFiles,
  });

  return (
    <Modal {...rest}>
      <ModalHeader>Upload Image</ModalHeader>
      <ModalBody>
        <div className="flex-c-center-center">
          {file ? (
            <div>{file.name}</div>
          ) : (
            <div {...bond} className="flex-c-center-center border-sm m8 p8">
              <h5>Drop Bitmap file here</h5>
              <p>The image will be placed at the selected pixel.</p>
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="button" onClick={close}>
          Cancel
        </div>
        {file && (
          <div className="button" onClick={close}>
            Upload
          </div>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default UploadModal;
