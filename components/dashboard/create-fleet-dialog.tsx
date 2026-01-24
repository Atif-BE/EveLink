"use client"

import { useActionState, useRef, useState } from "react"
import Image from "next/image"
import { Plus, Loader2, X } from "lucide-react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { eveImageUrl } from "@/types/eve"
import {
  createFleetAction,
  type ActionResult,
} from "@/app/(dashboard)/dashboard/fleets/actions"
import type { DoctrineWithShips, Character } from "@/types/db"

type CreateFleetDialogProps = {
  doctrines: DoctrineWithShips[]
  allianceMembers: Pick<Character, "id" | "name">[]
  trigger?: React.ReactNode
}

const initialState: ActionResult = { success: false }

export const CreateFleetDialog = ({
  doctrines,
  allianceMembers,
  trigger,
}: CreateFleetDialogProps) => {
  const [open, setOpen] = useState(false)
  const [fcSearch, setFcSearch] = useState("")
  const [selectedFc, setSelectedFc] = useState<{
    id: number
    name: string
  } | null>(null)
  const [showFcDropdown, setShowFcDropdown] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const filteredMembers = allianceMembers.filter((m) =>
    m.name.toLowerCase().includes(fcSearch.toLowerCase())
  )

  const wrappedAction = async (
    prevState: ActionResult,
    formData: FormData
  ): Promise<ActionResult> => {
    const result = await createFleetAction(prevState, formData)
    if (result.success) {
      setOpen(false)
      formRef.current?.reset()
      setSelectedFc(null)
      setFcSearch("")
    }
    return result
  }

  const [state, formAction, pending] = useActionState(wrappedAction, initialState)

  const handleSelectFc = (member: { id: number; name: string }) => {
    setSelectedFc(member)
    setFcSearch(member.name)
    setShowFcDropdown(false)
  }

  const handleClearFc = () => {
    setSelectedFc(null)
    setFcSearch("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 bg-eve-cyan text-eve-void hover:bg-eve-cyan/90">
            <Plus className="h-4 w-4" />
            Create Fleet
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="border-eve-border bg-eve-deep sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-eve-text">
            Create Fleet
          </DialogTitle>
          <DialogDescription className="text-eve-text-muted">
            Schedule a new fleet operation for your alliance.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-eve-text-secondary">
              Fleet Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Stratop: Defense Fleet"
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
              placeholder="Fleet details, objectives, etc..."
              rows={2}
              className="border-eve-border bg-eve-void text-eve-text placeholder:text-eve-text-muted focus-visible:ring-eve-cyan"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduledAt" className="text-eve-text-secondary">
              Scheduled Time
            </Label>
            <Input
              id="scheduledAt"
              name="scheduledAt"
              type="datetime-local"
              className="border-eve-border bg-eve-void text-eve-text focus-visible:ring-eve-cyan"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-eve-text-secondary">Fleet Commander</Label>
            <div className="relative">
              <div className="relative">
                {selectedFc && (
                  <Image
                    src={eveImageUrl.character(selectedFc.id, 32)}
                    alt=""
                    width={24}
                    height={24}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded"
                  />
                )}
                <Input
                  value={fcSearch}
                  onChange={(e) => {
                    setFcSearch(e.target.value)
                    setShowFcDropdown(true)
                    if (!e.target.value) setSelectedFc(null)
                  }}
                  onFocus={() => setShowFcDropdown(true)}
                  placeholder="Search alliance members..."
                  className={cn(
                    "border-eve-border bg-eve-void text-eve-text placeholder:text-eve-text-muted focus-visible:ring-eve-cyan",
                    selectedFc && "pl-10"
                  )}
                />
                {selectedFc && (
                  <button
                    type="button"
                    onClick={handleClearFc}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-eve-text-muted hover:text-eve-text"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {showFcDropdown && fcSearch && !selectedFc && (
                <div className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border border-eve-border bg-eve-deep shadow-lg">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.slice(0, 10).map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => handleSelectFc(member)}
                        className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-eve-void/50"
                      >
                        <Image
                          src={eveImageUrl.character(member.id, 32)}
                          alt=""
                          width={24}
                          height={24}
                          className="rounded"
                        />
                        <span className="text-sm text-eve-text">
                          {member.name}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-eve-text-muted">
                      No members found
                    </div>
                  )}
                </div>
              )}
            </div>
            <input type="hidden" name="fcCharacterId" value={selectedFc?.id ?? ""} />
            <input type="hidden" name="fcCharacterName" value={selectedFc?.name ?? ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctrineId" className="text-eve-text-secondary">
              Doctrine (optional)
            </Label>
            <Select name="doctrineId">
              <SelectTrigger className="border-eve-border bg-eve-void text-eve-text focus:ring-eve-cyan">
                <SelectValue placeholder="Select doctrine..." />
              </SelectTrigger>
              <SelectContent className="border-eve-border bg-eve-deep">
                {doctrines.map((doctrine) => (
                  <SelectItem
                    key={doctrine.id}
                    value={doctrine.id}
                    className="text-eve-text focus:bg-eve-void focus:text-eve-text"
                  >
                    {doctrine.name}
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
              disabled={pending || !selectedFc}
              className="bg-eve-cyan text-eve-void hover:bg-eve-cyan/90"
            >
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Fleet
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
