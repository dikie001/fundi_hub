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
import { Image as ImageIcon } from "lucide-react"

type AddPortfolioDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  newPortfolioTitle: string
  setNewPortfolioTitle: (val: string) => void
  newPortfolioCategory: string
  setNewPortfolioCategory: (val: string) => void
  portfolioFile: File | null
  setPortfolioFile: (val: File | null) => void
  isPortfolioUploading: boolean
  portfolioProgress: number
  onSubmit: (e: React.FormEvent) => void
}

export function AddPortfolioDialog({
  open,
  onOpenChange,
  newPortfolioTitle,
  setNewPortfolioTitle,
  newPortfolioCategory,
  setNewPortfolioCategory,
  portfolioFile,
  setPortfolioFile,
  isPortfolioUploading,
  portfolioProgress,
  onSubmit,
}: AddPortfolioDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-foreground">
            Add Portfolio Work
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Showcase pictures of jobs you did recently to attract clients.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="mt-2 space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="port-title"
              className="text-sm font-semibold text-foreground"
            >
              Project Title
            </Label>
            <Input
              id="port-title"
              value={newPortfolioTitle}
              onChange={(e) => setNewPortfolioTitle(e.target.value)}
              placeholder="e.g. Master kitchen plumbing"
              required
              className="h-10 rounded-lg text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="port-cat"
              className="text-sm font-semibold text-foreground"
            >
              Work Category
            </Label>
            <select
              id="port-cat"
              value={newPortfolioCategory}
              onChange={(e) => setNewPortfolioCategory(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-hidden dark:bg-card"
            >
              <option value="Wiring">Electrical Wiring</option>
              <option value="Installation">Equipment Installation</option>
              <option value="Repair">Trouble Repair</option>
              <option value="Piping">Plumbing Piping</option>
              <option value="General">Other Works</option>
            </select>
          </div>
          <div className="rounded-lg border border-dashed border-border/40 bg-muted/15 p-5 text-center">
            <input
              type="file"
              id="portfolio-upload-file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setPortfolioFile(e.target.files?.[0] || null)}
            />
            <label
              htmlFor="portfolio-upload-file"
              className="block cursor-pointer"
            >
              <ImageIcon className="mx-auto mb-1.5 h-7 w-7 text-primary" />
              <p className="text-sm font-semibold text-foreground">
                {portfolioFile
                  ? portfolioFile.name
                  : "Select photo of your work"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {portfolioFile
                  ? `${(portfolioFile.size / 1024 / 1024).toFixed(2)} MB`
                  : "PNG, JPG up to 5MB"}
              </p>
            </label>
          </div>
          <DialogFooter className="flex items-center justify-end gap-2 border-t border-border/30 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="h-10 cursor-pointer rounded-lg px-4 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 cursor-pointer rounded-lg px-4 text-sm font-semibold"
              disabled={isPortfolioUploading}
            >
              {isPortfolioUploading
                ? `Uploading ${portfolioProgress}%`
                : "Save Work"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
