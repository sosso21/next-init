import { Dialog, DialogContent } from "@/components/ui/dialog";

import { GalleryEditor } from "./gallery-editor";
import { createOrUpdateGalleryType } from "../[locale]/dashboard/create-gallery/types";

export function EditGallery({
  galley,
  handleClose,
}: {
  galley?: createOrUpdateGalleryType | null;
  handleClose: () => void;
}) {
  return (
    <Dialog defaultOpen={false} onOpenChange={handleClose} open={!!galley?.id}>
      <DialogContent>
        <GalleryEditor defaultValue={galley ?? undefined} />
      </DialogContent>
    </Dialog>
  );
}
