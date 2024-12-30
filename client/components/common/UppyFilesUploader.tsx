// "use client";

// import React, { useEffect, useMemo, useRef } from "react";
// import Uppy from "@uppy/core";
// import { Dashboard } from "@uppy/react";
// import Audio from "@uppy/audio";
// import ImageEditor from "@uppy/image-editor";
// import GoogleDrive from "@uppy/google-drive";
// import Dropbox from "@uppy/dropbox";
// import Instagram from "@uppy/instagram";
// import Url from "@uppy/url";
// import Webcam from "@uppy/webcam";
// import Unsplash from "@uppy/unsplash";
// import GooglePhotosPicker from "@uppy/google-photos-picker";
// import OneDrive from "@uppy/onedrive";
// import ProgressBar from "@uppy/progress-bar";
// import StatusBar from "@uppy/status-bar";
// import ScreenCapture from "@uppy/screen-capture";
// import XHR from "@uppy/xhr-upload";
// import { COMPANION_URL, COMPANION_ALLOWED_HOSTS } from "@uppy/transloadit";
// import "@uppy/core/dist/style.min.css";
// import "@uppy/dashboard/dist/style.min.css";
// import "@uppy/image-editor/dist/style.css";
// import "@uppy/audio/dist/style.min.css";
// import "@uppy/webcam/dist/style.min.css";
// import "@uppy/progress-bar/dist/style.min.css";
// import "@uppy/status-bar/dist/style.min.css";
// import { toast } from "@/hooks/use-toast";
// import { WithDropdown } from "./WithDropdown";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { useTheme } from "next-themes";

// interface UppyFilesUploaderProps {
//   onFilesUploaded: (files: any) => void;
// }

// const UppyFilesUploader: React.FC<UppyFilesUploaderProps> = ({
//   onFilesUploaded,
// }) => {
//   const { theme } = useTheme();
//   const uppy = useMemo(() => {
//     return (
//       new Uppy({
//         restrictions: {
//           maxFileSize: 30 * 1024 * 1024, // 30 MB
//           maxNumberOfFiles: 10,
//           allowedFileTypes: ["image/*", "video/*", "application/pdf", "audio/*"],
//         },
//         autoProceed: false,
//         debug: true,
//         onBeforeUpload: (file) => { //after hit upload button
//           return file;
//         },
//         onBeforeFileAdded(currentFile, files) { //onchange files

//           return currentFile
//         },
//       })
//         .use(Audio)
//         .use(Webcam)

//         .use(ScreenCapture)
//         .use(Url, {
//           companionUrl: COMPANION_URL,
//           companionAllowedHosts: COMPANION_ALLOWED_HOSTS,
//         })
//         .use(Unsplash, {
//           companionUrl: COMPANION_URL,
//           companionAllowedHosts: COMPANION_ALLOWED_HOSTS,
//         })

//         //     .use(Tus, {
//         //         endpoint: "https://tusd.tusdemo.net/files/", onAfterResponse: (response) => {
//         //       console.log(response)

//         //   }})
//         .use(ImageEditor)
//         .use(GoogleDrive, {
//           companionUrl: COMPANION_URL,
//           companionAllowedHosts: COMPANION_ALLOWED_HOSTS,
//           // companionKeysParams: {
//           //     key: TRANSLOADIT_KEY,
//           //     credentialsName: "",
//           // },
//         })
//         .use(GooglePhotosPicker, {
//           companionUrl: COMPANION_URL,
//           companionAllowedHosts: COMPANION_ALLOWED_HOSTS,
//           clientId: "From Google Developer Console",
//         })
//         // .use(Dropbox, {
//         //   companionUrl: COMPANION_URL,
//         //   companionAllowedHosts: COMPANION_ALLOWED_HOSTS,
//         // })
//         .use(OneDrive, {
//           companionUrl: COMPANION_URL,
//           companionAllowedHosts: COMPANION_ALLOWED_HOSTS,
//         })
//         .use(Instagram, {
//           companionUrl: COMPANION_URL,
//           companionAllowedHosts: COMPANION_ALLOWED_HOSTS,
//         })

//         .use(XHR, {
//           endpoint: process.env.NEXT_PUBLIC_API_URL + "/upload/multiple",
//           formData: true,
//           fieldName: "files",
//           method: "POST",
//           withCredentials: true,
//           allowedMetaFields: ["*"],
//           bundle: true, // send all files in one request

//         })
//     );
//   }, []);

//   useEffect(() => {
//     uppy.on("upload-success", (file, response) => {
//       if (onFilesUploaded) {
//         console.log({
//           file,
//           response,
//         });
//         onFilesUploaded(file);
//         toast({
//           title: "Files uploaded successfully",
//           description: "Files uploaded successfully",
//         });
//       }
//     });
//   }, [uppy, onFilesUploaded]);

//   return (
//     <>
//       <Dashboard
//         className="h-full w-full rounded-xl"
//         theme={theme as any}
//         uppy={uppy}
//         showProgressDetails
//         proudlyDisplayPoweredByUppy={false}
//       />
//     </>
//   );
// };

// export default UppyFilesUploader;
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Audio from "@uppy/audio";
import ImageEditor from "@uppy/image-editor";
import GoogleDrive from "@uppy/google-drive";
import Dropbox from "@uppy/dropbox";
import Instagram from "@uppy/instagram";
import Url from "@uppy/url";
import Webcam from "@uppy/webcam";
import Unsplash from "@uppy/unsplash";
import GooglePhotosPicker from "@uppy/google-photos-picker";
import OneDrive from "@uppy/onedrive";
import ScreenCapture from "@uppy/screen-capture";
import XHR from "@uppy/xhr-upload";
import { COMPANION_URL, COMPANION_ALLOWED_HOSTS } from "@uppy/transloadit";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/image-editor/dist/style.css";
import "@uppy/audio/dist/style.min.css";
import "@uppy/webcam/dist/style.min.css";
import "@uppy/progress-bar/dist/style.min.css";
import "@uppy/status-bar/dist/style.min.css";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
interface UppyFilesUploaderProps {
  onFilesUploaded: (files: any) => void;
}

const UppyFilesUploader: React.FC<UppyFilesUploaderProps> = ({ onFilesUploaded }) => {
  const { theme } = useTheme();
  const uppy = useMemo(() => {
    return new Uppy({
      restrictions: {
        maxFileSize: 30 * 1024 * 1024, // 30 MB
        maxNumberOfFiles: 10,
        allowedFileTypes: ["image/*", "video/*", "application/pdf", "audio/*"],
      },
      autoProceed: false,
      debug: true,
      allowMultipleUploadBatches: true,
      locale: {
        pluralize: (n: number) => n,
        strings: {
          cancel: "Cancel",
          pause: "Pause",
          resume: "Resume",
          retry: "Retry",
          start: "Start",
          stop: "Stop",
          remove: "Remove",
        },
      },
    })
     
      .use(Audio)
      .use(Webcam)
      .use(ScreenCapture)

      .use(Url, {
        companionUrl: COMPANION_URL,
        companionAllowedHosts: COMPANION_ALLOWED_HOSTS,
      })
      .use(Unsplash, {
        companionUrl: COMPANION_URL,
        companionAllowedHosts: COMPANION_ALLOWED_HOSTS,
      })
      .use(ImageEditor)
      .use(GoogleDrive, {
        companionUrl: COMPANION_URL,
        companionAllowedHosts: COMPANION_ALLOWED_HOSTS,
      })
      .use(GooglePhotosPicker, {
        companionUrl: COMPANION_URL,
        companionAllowedHosts: COMPANION_ALLOWED_HOSTS,
        clientId: "From Google Developer Console",
      })
      .use(OneDrive, {
        companionUrl: COMPANION_URL,
        companionAllowedHosts: COMPANION_ALLOWED_HOSTS,
      })
      .use(Instagram, {
        companionUrl: COMPANION_URL,
        companionAllowedHosts: COMPANION_ALLOWED_HOSTS,
      })

      .use(Dropbox, {
        companionUrl: COMPANION_URL,
        companionAllowedHosts: COMPANION_ALLOWED_HOSTS,
      })
      .use(XHR, {
        endpoint: process.env.NEXT_PUBLIC_API_URL + "/upload/multiple",
        formData: true,
        fieldName: "files",
        method: "POST",
        withCredentials: true,
      });
  }, []);
  useEffect(() => {
    uppy.on("upload", () => {
      // setUploading(true);
      // setButtonText("Uploading...");
    });

    uppy.on("upload-success", (file, response) => {
      if (onFilesUploaded) {
        onFilesUploaded(response);
        toast({
          title: "Files uploaded successfully",
          description: "Files uploaded successfully",
          duration: 1000,
        });
        //  const dashboard = uppy.getPlugin("Dashboard");
        //  if (dashboard && typeof dashboard.closeModal === "function") {
        //    dashboard.closeModal(); // Close the modal after the upload is complete
        //  }
      }
    });

    uppy.on("upload-error", () => {});

    uppy.on("upload-progress", (file, progress) => {});
  }, [uppy, onFilesUploaded]);

  return (
    <>
      <Dashboard
        className="h-full w-full rounded-xl"
        theme={theme as any}
        uppy={uppy}
        showProgressDetails
        proudlyDisplayPoweredByUppy={false}
        // hideUploadButton
        hideProgressAfterFinish
        showNativePhotoCameraButton
        onRequestCloseModal={() => { }}
        
      />
      {/* <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => uppy.upload()}
        disabled={uploading}
      >
        {buttonText}
      </button>
      <input ref={fileInputRef}></input>
      {uploading && <p>Upload progress: {uploadProgress.toFixed(2)}%</p>} */}
    </>
  );
};

export default UppyFilesUploader;
