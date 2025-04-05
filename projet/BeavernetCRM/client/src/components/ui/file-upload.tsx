import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface FileUploadProps {
  onUploadComplete: (fileUrl: string) => void;
  accept?: string;
  clientId?: number;
  documentType: string;
  label: string;
}

export function FileUpload({
  onUploadComplete,
  accept = "image/*",
  clientId,
  documentType,
  label,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", documentType);
      if (clientId) {
        formData.append("clientId", clientId.toString());
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Échec du téléchargement");
      }

      const data = await response.json();
      onUploadComplete(data.fileUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur s'est produite lors du téléchargement"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleUpload}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          disabled={isUploading}
          className="flex items-center space-x-2"
        >
          <Upload className="h-4 w-4" />
          <span>{isUploading ? "Téléchargement..." : label}</span>
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
