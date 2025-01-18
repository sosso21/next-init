import { getPicture } from "@/lib/getPicture";
import { cn } from "@/lib/utils";
import { IconUpload } from "@tabler/icons-react";
import Image from "next/image";

export function ProfilePictureUploader({
  setFile = () => {},
  url = null,
  author = "",
  createPlaceholder = false,
  className,
  required = false,
}: {
  setFile?: (file: File) => void;
  url?: string | null;
  author?: string;
  createPlaceholder?: boolean;
  className?: string;
  required?: boolean;
}) {
  return (
    <div className="mx-auto w-64 text-center">
      <div className="relative w-64 h-64">
        <Image
          className={cn("rounded-full object-cover", className)}
          src={
            createPlaceholder
              ? getPicture({ author: author ?? "", url: url })
              : url ?? ""
          }
          alt={`${author}${author ? "'s profile picture" : ""}`}
          fill
        />
        <label
          htmlFor="profile-picture-uploader"
          className="absolute flex justify-center items-center opacity-10 hover:opacity-90 hover:backdrop-blur-md rounded-full hover:ring-200 w-64 h-64 transition duration-500 cursor-pointer group"
        >
          <IconUpload className="w-24 h-24 text-white" />
        </label>
      </div>
      <input
        type="file"
        id="profile-picture-uploader"
        accept="image/*"
        onChange={(e) => setFile(e.target.files![0])}
        className="hidden"
        required={required}
      />
    </div>
  );
}
