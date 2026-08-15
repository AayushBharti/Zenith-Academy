import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import type React from "react";

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  text1: string;
  text2: string;
  btn1Text: string;
  btn2Text: string;
  btn1Handler: () => void;
  btn2Handler: () => void;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  text1,
  text2,
  btn1Text,
  btn2Text,
  btn1Handler,
  btn2Handler,
}) => (
  <Dialog onOpenChange={onClose} open={isOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{text1}</DialogTitle>
        <DialogDescription>{text2}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button onClick={btn1Handler} variant="destructive">
          {btn1Text}
        </Button>
        <Button onClick={btn2Handler} variant="outline">
          {btn2Text}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ConfirmationModal;
