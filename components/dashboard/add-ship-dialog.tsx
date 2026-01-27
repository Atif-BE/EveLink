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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SHIP_ROLES, type ShipRole } from "@/types"
import {
  addShipAction,
  type ActionResult,
} from "@/app/(dashboard)/dashboard/doctrines/[id]/actions"

type AddShipDialogProps = {
  doctrineId: string
  trigger?: React.ReactNode
}

const initialState: ActionResult = { success: false }

export const AddShipDialog = ({ doctrineId, trigger }: AddShipDialogProps) => {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState<ShipRole>("DPS")
  const formRef = useRef<HTMLFormElement>(null)

  const wrappedAction = async (
    prevState: ActionResult,
    formData: FormData
  ): Promise<ActionResult> => {
    const result = await addShipAction(prevState, formData)
    if (result.success) {
      setOpen(false)
      setRole("DPS")
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
            Add Ship
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="border-eve-border bg-eve-deep sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-eve-text">
            Add Ship
          </DialogTitle>
          <DialogDescription className="text-eve-text-muted">
            Paste an EFT fitting from the game. The ship and fit name will be
            parsed automatically.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-4">
          <input type="hidden" name="doctrineId" value={doctrineId} />
          <input type="hidden" name="role" value={role} />

          <div className="space-y-2">
            <Label htmlFor="eft" className="text-eve-text-secondary">
              EFT Fitting
            </Label>
            <Textarea
              id="eft"
              name="eft"
              placeholder={`[Machariel, Fleet DPS]
Damage Control II
Gyrostabilizer II
...`}
              rows={10}
              className="font-mono text-xs border-eve-border bg-eve-void text-eve-text placeholder:text-eve-text-muted focus-visible:ring-eve-cyan"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-eve-text-secondary">
              Role
            </Label>
            <Select value={role} onValueChange={(v) => setRole(v as ShipRole)}>
              <SelectTrigger className="border-eve-border bg-eve-void text-eve-text focus:ring-eve-cyan">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-eve-border bg-eve-deep">
                {SHIP_ROLES.map((r) => (
                  <SelectItem
                    key={r}
                    value={r}
                    className="text-eve-text focus:bg-eve-cyan/10 focus:text-eve-cyan"
                  >
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              Add Ship
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
