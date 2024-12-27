import React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ConfirmationModalProps = {
  isOpen: boolean
  onClose: () => void
  text1: string
  text2: string
  btn1Text: string
  btn2Text: string
  btn1Handler: () => void
  btn2Handler: () => void
}

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
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{text1}</DialogTitle>
        <DialogDescription>{text2}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="destructive" onClick={btn1Handler}>
          {btn1Text}
        </Button>
        <Button variant="outline" onClick={btn2Handler}>
          {btn2Text}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export default ConfirmationModal
