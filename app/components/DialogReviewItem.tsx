"use client";

import { parseAsInteger, useQueryState } from "nuqs";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useClientLocation } from "@/lib/use-translation/use-client-translation";
import { PrismaReviewGetPayload, ReviewCardItem } from "./ReviewCard";
import { useQuery } from "@tanstack/react-query";
import { getReview } from "@/server/review.action";
import { DialogClose } from "@radix-ui/react-dialog";

export const DialogReviewItem = () => {
  const [show_review, set_show_review] = useQueryState(
    "show_review",
    parseAsInteger.withDefault(0)
  );
  const locale = useClientLocation();
  const { data: review } = useQuery({
    queryKey: ["review"],
    queryFn: async () => {
      if (!show_review) return;
      return await getReview({ id: show_review })
        .then((res) => res[0])
        .catch(() => set_show_review(null));
    },
    enabled: !!show_review,
  });

  return (
    <Dialog
      open={!!show_review && !!review}
      onOpenChange={() => set_show_review(null)}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogClose className="inline md:hidden mb-2"> </DialogClose>

        {typeof review !== "undefined" ? (
          <ReviewCardItem
            review={review as PrismaReviewGetPayload}
            locale={locale}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
