import path from 'path';
import fs from 'fs';
import { storage } from '../storage';

interface UploadedFile {
  path: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
}

/**
 * Traite un fichier téléchargé et l'associe à un client et un type de document
 */
export async function uploadFile(
  file: UploadedFile,
  documentType: string,
  clientId?: number
): Promise<string> {
  try {
    // Vérifier si le répertoire uploads existe, sinon le créer
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Définir le nom du fichier et le chemin
    const timestamp = Date.now();
    const fileExt = path.extname(file.originalname).toLowerCase();
    const safeOriginalName = path.basename(file.originalname, fileExt).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const newFilename = `${documentType}_${clientId || 'temp'}_${timestamp}${fileExt}`;
    const destinationPath = path.join(uploadsDir, newFilename);
    
    // Copier le fichier temporaire vers le chemin final
    fs.copyFileSync(file.path, destinationPath);
    
    // Supprimer le fichier temporaire
    fs.unlinkSync(file.path);
    
    // URL relative pour l'accès au fichier
    const fileUrl = `/uploads/${newFilename}`;
    
    // Si un client est spécifié, enregistrer le document dans la base de données
    if (clientId) {
      const documentData = {
        client_id: clientId,
        type: documentType,
        nom: file.originalname,
        chemin: fileUrl,
        statut: 'valide',
        metadonnees: {
          size: file.size,
          mimetype: file.mimetype,
          originalname: file.originalname
        }
      };
      
      await storage.addDocumentToClient(clientId, documentData);
      
      // Si le document est un permis ou une carte grise, mettre à jour les informations correspondantes
      if (documentType === 'permis') {
        const permis = await storage.getPermisByClientId(clientId);
        if (permis) {
          await storage.updatePermis(permis.id, {
            ...permis,
            document_url: fileUrl
          });
        }
      } else if (documentType === 'carte_grise') {
        const vehicules = await storage.getVehiculesByClientId(clientId);
        if (vehicules.length > 0) {
          await storage.updateVehicule(vehicules[0].id, {
            ...vehicules[0],
            document_url: fileUrl
          });
        }
      }
      
      // Mettre à jour le statut des documents du client
      const client = await storage.getClientById(clientId);
      if (client) {
        const documents = await storage.getDocumentsByClientId(clientId);
        // Si le client a au moins un document de chaque type essentiel
        const hasPermis = documents.some(d => d.type === 'permis');
        const hasCarteGrise = documents.some(d => d.type === 'carte_grise');
        const hasIdentite = documents.some(d => d.type === 'identite');
        
        if (hasPermis && hasCarteGrise && hasIdentite) {
          await storage.updateClient(clientId, {
            ...client,
            documents_complets: true
          });
        }
      }
    }
    
    return fileUrl;
  } catch (error) {
    console.error('Erreur lors du traitement du fichier uploadé:', error);
    throw new Error('Échec du traitement du fichier');
  }
}

/**
 * Vérifie si un fichier existe
 */
export function fileExists(filePath: string): boolean {
  try {
    const absolutePath = path.join(process.cwd(), filePath.replace(/^\//, ''));
    return fs.existsSync(absolutePath);
  } catch (error) {
    return false;
  }
}

/**
 * Récupère le type MIME d'un fichier
 */
export function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Supprime un fichier
 */
export function deleteFile(filePath: string): boolean {
  try {
    const absolutePath = path.join(process.cwd(), filePath.replace(/^\//, ''));
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error);
    return false;
  }
}
