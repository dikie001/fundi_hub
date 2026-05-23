"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,   
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const FUNDI_TRADES = [
  "Plumber",
  "Electrician",
  "Carpenter",
  "Painter",
  "Mason",
  "Welder",
  "Appliance Repair",
  "HVAC Tech",
  "Cleaner",
  "Gardener",
]

type EditProfileDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editName: string
  setEditName: (val: string) => void
  editTitle: string
  setEditTitle: (val: string) => void
  editTrades: string[]
  setEditTrades: React.Dispatch<React.SetStateAction<string[]>>
  editYearsExp: string
  setEditYearsExp: (val: string) => void
  editArea: string
  setEditArea: (val: string) => void
  editDesc: string
  setEditDesc: (val: string) => void
  preferredContact: string
  setPreferredContact: (val: string) => void
  skillsInputValue: string
  handleSkillsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isUpdating: boolean
  onSubmit: (e: React.FormEvent) => void
}

export function EditProfileDialog({
  open,
  onOpenChange,
  editName,
  setEditName,
  editTitle,
  setEditTitle,
  editTrades,
  setEditTrades,
  editYearsExp,
  setEditYearsExp,
  editArea,
  setEditArea,
  editDesc,
  setEditDesc,
  preferredContact,
  setPreferredContact,
  skillsInputValue,
  handleSkillsChange,
  isUpdating,
  onSubmit,
}: EditProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[95vw]  max-w-6xl overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">
            Edit Profile Details
          </DialogTitle>
          <DialogDescription className="text-base">
            Update your professional information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-8 pt-6">
          {/* Basic Info - 2 Columns on Large Screens */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2.5">
              <Label htmlFor="edit-name" className="text-base">
                Full Name
              </Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your full name"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="edit-title" className="text-base">
                Professional Title
              </Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="e.g. Electrician Expert"
                className="h-11"
                required
              />
            </div>
          </div>

          {/* Trade Categories - Full Width */}
          <div className="space-y-2.5">
            <Label className="text-base">Trade Categories</Label>
            <Select
              onValueChange={(value) => {
                if (!editTrades.includes(value)) {
                  setEditTrades([...editTrades, value])
                }
              }}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Add a trade..." />
              </SelectTrigger>
              <SelectContent>
                {FUNDI_TRADES.map((trade) => (
                  <SelectItem key={trade} value={trade}>
                    {trade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {editTrades.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {editTrades.map((trade) => (
                  <Badge
                    key={trade}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm"
                  >
                    {trade}
                    <button
                      type="button"
                      onClick={() =>
                        setEditTrades(editTrades.filter((t) => t !== trade))
                      }
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Select one or more trades that appear on your profile
            </p>
          </div>

          {/* Years of Experience & Service Area - 2 Columns */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2.5">
              <Label htmlFor="edit-exp" className="text-base">
                Years of Experience
              </Label>
              <Input
                id="edit-exp"
                type="number"
                value={editYearsExp}
                onChange={(e) => setEditYearsExp(e.target.value)}
                placeholder="10"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="edit-area" className="text-base">
                Service Coverage Area
              </Label>
              <Input
                id="edit-area"
                value={editArea}
                onChange={(e) => setEditArea(e.target.value)}
                placeholder="e.g. Nairobi, Westlands, Kilimani"
                className="h-11"
                required
              />
            </div>
          </div>

          {/* Preferred Contact & Specializations - 2 Columns */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2.5">
              <Label htmlFor="edit-contact" className="text-base">
                Preferred Contact Method
              </Label>
              <Select
                value={preferredContact}
                onValueChange={setPreferredContact}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select contact method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="edit-skills" className="text-base">
                Specializations (comma-separated)
              </Label>
              <Input
                id="edit-skills"
                value={skillsInputValue}
                onChange={handleSkillsChange}
                placeholder="e.g. Pipe Leak Repair, Drainage Installation"
                className="h-11"
              />
            </div>
          </div>

          {/* Professional Bio - Full Width */}
          <div className="space-y-2.5">
            <Label htmlFor="edit-desc-dialog" className="text-base">
              Professional Biography
            </Label>
            <textarea
              id="edit-desc-dialog"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="Describe your expertise, experience, and what makes you stand out..."
              rows={5}
              className="flex w-full resize-none rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            />
          </div>

          <DialogFooter className="gap-2 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 px-6"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating} className="h-11 px-6">
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
