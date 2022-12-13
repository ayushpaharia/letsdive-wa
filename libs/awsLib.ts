import { Storage } from "aws-amplify"

export const s3Upload = async (file: File, filename: string) => {
  // setup s3 bucket with aws-amplify
  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type,
  })
  return stored.key
}
