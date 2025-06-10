import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export async function uploadFileToStorage(
  file: File,
  bucket: string = "patrimoine_documents"
): Promise<string> {
  try {
    // Générer un nom de fichier unique
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Télécharger le fichier
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error);
    throw error;
  }
}

export async function deleteFileFromStorage(
  fileUrl: string,
  bucket: string = "patrimoine_documents"
): Promise<void> {
  try {
    // Extraire le nom du fichier de l'URL
    const fileName = fileUrl.split('/').pop();
    if (!fileName) throw new Error("URL de fichier invalide");

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) throw error;
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    throw error;
  }
}