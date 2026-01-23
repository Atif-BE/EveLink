"use client"

import { useActionState, useRef, useState } from "react"
import { Plus, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  createDoctrineAction,
  type ActionResult,
} from "@/app/(dashboard)/dashboard/doctrines/actions"

type CreateDoctrineDialogProps = {
  trigger?: React.ReactNode
}

const initialState: ActionResult = { success: false }

export const CreateDoctrineDialog = ({ trigger }: CreateDoctrineDialogProps) => {
  const [open, setOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const wrappedAction = async (
    prevState: ActionResult,
    formData: FormData
  ): Promise<ActionResult> => {
    const result = await createDoctrineAction(prevState, formData)
    if (result.success) {
      setOpen(false)
      formRef.current?.reset()
    }
    return result
  }

  const [state, formAction, pending] = useActionState(wrappedAction, initialState)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 bg-eve-cyan text-eve-void hover:bg-eve-cyan/90">
            <Plus className="h-4 w-4" />
            Add Doctrine
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="border-eve-border bg-eve-deep sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-eve-text">
            Create Doctrine
          </DialogTitle>
          <DialogDescription className="text-eve-text-muted">
            Create a new doctrine for your alliance. You can add ships after
            creating it.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-eve-text-secondary">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Fleet Doctrine Alpha"
              className="border-eve-border bg-eve-void text-eve-text placeholder:text-eve-text-muted focus-visible:ring-eve-cyan"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-eve-text-secondary">
              Description (optional)
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Primary shield fleet doctrine for large engagements..."
              rows={3}
              className="border-eve-border bg-eve-void text-eve-text placeholder:text-eve-text-muted focus-visible:ring-eve-cyan"
            />
          </div>

          {state.error && <p className="text-sm text-eve-red">{state.error}</p>}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-eve-text-secondary hover:bg-eve-void hover:text-eve-text"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="bg-eve-cyan text-eve-void hover:bg-eve-cyan/90"
            >
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
