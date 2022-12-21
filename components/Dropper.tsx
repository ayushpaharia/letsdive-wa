import React, { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { FileArrowUp, FileX } from "phosphor-react"
import Image from "next/image"

export default function S3ImageUploader() {
  // const [uploading, setUploading] = useState(false)
  // const [files, setFiles] = useState<{ name: string; preview: string }[]>([])
  // const [uploadProgress, setUploadProgress] = useState(0)

  // const { getRootProps, getInputProps } = useDropzone({
  //   accept: "image/*" as any,
  //   onDrop: async (acceptedFiles) => {
  //     setUploading(true)
  //     const file = acceptedFiles[0]

  //     // Generate unique filename
  //     const filename = `${uuidv4()}${file.name.replace(/\s/g, "-")}`

  //     // Upload file to S3
  //     const uploadedFile = await s3Upload(file, filename)
  //     //@ts-ignore
  //     setFiles((prevFiles: any[]) => [...prevFiles, uploadedFile])
  //     setUploading(false)
  //     setUploadProgress(0)
  //   },
  //   onDropRejected: () => {
  //     console.log("File rejected")
  //   },
  //   onDragEnter: () => {
  //     console.log("File accepted")
  //   },
  // })

  // const removeFile = async (filename: string) => {
  //   setFiles((prevFiles) => prevFiles.filter((file) => file.name !== filename))
  //   await Storage.remove(filename)
  // }

  return (
    <>
      <div
        // {...getRootProps()}
        className="flex flex-col items-center m-4 dropzone"
      >
        {/* <input {...getInputProps()} /> */}
        <FileArrowUp size={100} color="#8247E5" weight="regular" />
        <div className="text-lg font-medium text-center">
          Drop files or click to upload
        </div>
      </div>
      <div>
        {/* {files.map((file) => (
          <div key={file.name} className="file-item">
            <Image src={file.preview} width={100} height={100} alt="preview" />
            <button
              className="bg-red-200"
              onClick={() => removeFile(file.name)}
            >
              <FileX size={32} weight="bold" />
            </button>
          </div>
        ))} */}
      </div>
      {/* {uploading && uploadProgress} */}
    </>
  )
}
