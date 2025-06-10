
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface GenericFormDialogProps {
  title: string;
  description?: string;
  buttonLabel: string;
  buttonIcon?: React.ReactNode;
  buttonClassName?: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading?: boolean;
  isFormValid?: boolean;
  children: React.ReactNode;
}

export function GenericFormDialog({
  title,
  description,
  buttonLabel,
  buttonIcon,
  buttonClassName = "bg-cma-blue",
  onSubmit,
  isLoading = false,
  isFormValid = true,
  children,
}: GenericFormDialogProps) {
  const [open, setOpen] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(e);
      setOpen(false);
    } catch (error) {
      // Erreur gérée dans onSubmit
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={`flex items-center gap-2 ${buttonClassName}`}>
          {buttonIcon || <Plus className="w-4 h-4" />} {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {children}
          <DialogFooter>
            <Button type="submit" className="bg-cma-blue" disabled={isLoading || !isFormValid}>
              {isLoading ? "Traitement..." : "Enregistrer"}
            </Button>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Annuler
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
