"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function NewWorkbookDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New workbook</Button>
      </DialogTrigger>
      <DialogContent
        title="New workbook"
        description="This specimen does not create a workbook. There is no account, and nothing is saved."
      >
        <DialogClose asChild>
          <Button variant="secondary">Back to the sample</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
