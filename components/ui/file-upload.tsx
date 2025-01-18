import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "./button";
import { CheckCheck, XIcon } from "lucide-react";
import { ImageUrlType } from "@/app/[locale]/dashboard/upload-images/types";
import { FileType, handleFileUpload } from "@/lib/images-uploader";
import { createId } from "@paralleldrive/cuid2";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  multiple = false,
  setLoading,
  setUrls,
}: {
  multiple?: boolean;
  setUrls?: (urls: ImageUrlType[]) => void;
  setLoading?: (loading: boolean) => void;
}) => {
  const [files, setFiles] = useState<FileType[]>([]);

  const handleDelete = (id: number | string) => {
    const filteredFiles = files.filter((file) => file.id !== id);
    setFiles(filteredFiles);
    setUrls && setUrls(filteredFiles.map((file) => file.urls!));
  };
  const handleFileChange = async (newFiles: File[]) => {
    let safeNewFiles = newFiles.filter(
      (newFile) =>
        !files.some(
          (file) =>
            file.file.name === newFile.name && file.file.size === newFile.size
        )
    );
    if (!multiple) {
      safeNewFiles = [safeNewFiles[0]];
      setFiles([]);
    }

    const filesToUpload = safeNewFiles.map((safeNewFile: File) => ({
      file: safeNewFile,
      id: createId(),
      uploaded: false,
      urls: null,
    }));

    setFiles((prev) => [...prev, ...filesToUpload]);

    setLoading && setLoading(true);
    const uploadedFiles = await handleFileUpload(filesToUpload);
    setLoading && setLoading(false);
    const Result: FileType[] = [
      ...uploadedFiles,
      ...files.filter((file) => !!file.uploaded),
    ];
    setFiles(Result);
    setUrls && setUrls(Result.map((file) => file.urls!));
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.error(error);
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div className="block relative p-10 rounded-lg w-full overflow-hidden group/file">
        <input
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
          multiple={multiple}
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          {
            // we can add Background Image here
          }
        </div>

        <div className="relative mx-auto mt-10 w-full max-w-xl">
          {files.length > 0 &&
            files.map((file, idx) => (
              <motion.div
                key={"file" + idx}
                layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                className={cn(
                  "relative overflow-hidden z-40 bg-transparent text-foreground border flex   items-start gap-4 justify-start md:min-h-24 p-4 mt-4 w-full mx-auto rounded-md shadow-sm flex-col md:flex-col",
                  "bg-secondary text-secondary-foreground border-secondary"
                )}
              >
                <Image
                  src={
                    file.urls?.webp
                      ? `${file.urls?.host}/${file.urls?.webp}`
                      : URL.createObjectURL(file.file)
                  }
                  alt={file.file.name}
                  placeholder={file.uploaded ? "blur" : "empty"}
                  blurDataURL={file.uploaded ? file.urls?.tumblr : ""}
                  fill
                  objectFit="cover"
                  className={cn("opacity-20", {
                    "opacity-30": file.uploaded,
                  })}
                />

                <div className="flex justify-between items-start gap-4 w-full">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className="flex items-center gap-2 max-w-xs text-base truncate"
                  >
                    <CheckCheck
                      className={cn("hidden min-w-10", {
                        inline: file.uploaded,
                      })}
                    />
                    <span className="max-w-xs text-ellipsis">
                      {file.file.name}
                    </span>
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className="flex flex-col flex-shrink-0 justify-center items-between items-end gap-4 shadow-input px-2 py-1 rounded-lg w-fit text-sm"
                  >
                    <i className="flex justify-end w-full">
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        className="z-40 rounded-md"
                        onClick={() => handleDelete(file.id)}
                      >
                        <XIcon />
                      </Button>
                    </i>
                    <span>
                      {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </motion.p>
                </div>

                <div className="flex flex-wrap justify-around md:justify-between items-start md:items-center gap-4 mt-2 w-full text-sm">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className={cn(
                      "bg-secondary px-2 py-1 rounded-md text-secondary-foreground",
                      {
                        "bg-primary text-primary-foreground": file.uploaded,
                      }
                    )}
                  >
                    {file.file.type}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                  >
                    {new Date(file.file.lastModified).toLocaleDateString()}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          <div className="relative">
            <motion.label
              htmlFor="file-upload-handle"
              whileHover="animate"
              layoutId="file-upload"
              variants={mainVariant}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="relative z-40 flex justify-center items-center bg-secondary shadow-[0px_10px_50px_rgba(0,0,0,0.1)] group-hover/file:shadow-2xl mx-auto mt-4 rounded-md w-full max-w-[8rem] h-32 text-secondary-foreground cursor-pointer"
            >
              {isDragActive ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  Drop files
                  <IconUpload className="bg-secondary w-4 h-4 text-secondary-foreground" />
                </motion.p>
              ) : (
                <IconUpload className="w-4 h-4 text-secondary-foreground" />
              )}
            </motion.label>

            <motion.div
              variants={secondaryVariant}
              className="z-30 absolute inset-0 flex justify-center items-center border-primary mx-auto border border-dashed rounded-md w-full max-w-[8rem] h-32"
            ></motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
