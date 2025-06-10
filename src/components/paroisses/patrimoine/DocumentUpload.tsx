import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Upload, X, Paperclip } from 'lucide-react';
import { uploadFileToStorage, deleteFileFromStorage } from '@/lib/storage-utils';
import { toast } from 'sonner';

interface DocumentUploadProps {
  initialUrls?: string[];
  onFilesChange: (urls: string[]) => void;
}

export const DocumentUpload = ({ initialUrls = [], onFilesChange }: DocumentUploadProps) => {
  const [documentUrls, setDocumentUrls] = useState<string[]>(initialUrls);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        // Vérifier la taille du fichier (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`Le fichier ${file.name} dépasse la limite de 10MB`);
          continue;
        }

        const url = await uploadFileToStorage(file);
        uploadedUrls.push(url);
      }

      const newUrls = [...documentUrls, ...uploadedUrls];
      setDocumentUrls(newUrls);
      onFilesChange(newUrls);
      toast.success("Documents téléchargés avec succès");
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement des documents");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveDocument = async (url: string, index: number) => {
    try {
      await deleteFileFromStorage(url);
      const newUrls = documentUrls.filter((_, i) => i !== index);
      setDocumentUrls(newUrls);
      onFilesChange(newUrls);
      toast.success("Document supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du document");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt,.rtf,.odt,.ods,.ppt,.pptx"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Téléchargement en cours..." : "Télécharger des documents"}
        </Button>
      </div>

      {documentUrls.length > 0 && (
        <div className="space-y-2">
          {documentUrls.map((url, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border rounded-md bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="truncate text-sm hover:underline text-blue-600"
                >
                  {decodeURIComponent(url.split('/').pop() || '')}
                </a>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveDocument(url, index)}
                className="shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};