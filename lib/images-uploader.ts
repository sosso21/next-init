import { ImageUrlType } from "@/app/[locale]/dashboard/upload-images/types";

export type FileType ={
  id: number | string;
  uploaded: boolean;
  file: File;
  urls?: ImageUrlType | null;
} ;

export const handleFileUpload = async (
  filesToUpload: FileType[]
): Promise<FileType[]> => {
  if (filesToUpload.length === 0) return [];
  const uploadedFiles: FileType[] = [];

  for (const file of filesToUpload.filter((file) => !file.uploaded)) {
    const formData = new FormData();
    formData.append("file", file.file);

    try {
      const response = await fetch(`${process.env.IMAGE_UPLOAD_URL}/upload/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json().then((res): ImageUrlType => {
        return {
          original: res.original,
          webp: res.webp,
          tumblr: res.tumblr,
          host: res.host,
        };
      });
      uploadedFiles.push({
        ...file,
        uploaded: true,
        urls: data,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }
  return uploadedFiles;
};
