import { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DocumentData, getDocumentData, addDocumentData, deleteDocumentData } from '@/lib/store';
import { FileText, Image, File, Upload, Trash2, Eye, Download, Search, Plus } from 'lucide-react';
import { toast } from 'sonner';

const DocumentPage = () => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewDoc, setPreviewDoc] = useState<DocumentData | null>(null);
  const [deletingDoc, setDeletingDoc] = useState<DocumentData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setDocuments(getDocumentData());
  };

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-12 h-12 text-destructive" />;
      case 'jpg':
      case 'png':
        return <Image className="w-12 h-12 text-primary" />;
      default:
        return <File className="w-12 h-12 text-muted-foreground" />;
    }
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Hanya file JPG, PNG, dan PDF yang diperbolehkan');
      return;
    }

    const type = file.type === 'application/pdf' ? 'pdf' : 
                 file.type === 'image/png' ? 'png' : 'jpg';

    const reader = new FileReader();
    reader.onload = () => {
      const newDoc: DocumentData = {
        id: `DOC${String(documents.length + 1).padStart(3, '0')}`,
        name: file.name,
        type: type as DocumentData['type'],
        url: reader.result as string,
        uploadDate: new Date().toISOString().split('T')[0],
      };
      addDocumentData(newDoc);
      loadData();
      toast.success('Dokumen berhasil diupload');
    };
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (doc: DocumentData) => {
    setDeletingDoc(doc);
  };

  const confirmDelete = () => {
    if (deletingDoc) {
      deleteDocumentData(deletingDoc.id);
      loadData();
      toast.success('Dokumen berhasil dihapus');
    }
    setDeletingDoc(null);
  };

  const handleDownload = (doc: DocumentData) => {
    if (doc.url === '#') {
      toast.error('File demo tidak dapat didownload');
      return;
    }
    const a = document.createElement('a');
    a.href = doc.url;
    a.download = doc.name;
    a.click();
    toast.success('Download dimulai');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dokumen</h1>
          <p className="text-muted-foreground">Kelola dokumen AC (JPG, PNG, PDF)</p>
        </div>
        <Button variant="gradient" onClick={handleUpload}>
          <Upload className="w-4 h-4 mr-2" /> Upload Dokumen
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
        />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari dokumen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Document Grid */}
      {filteredDocs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <File className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Tidak ada dokumen ditemukan</p>
            <Button variant="outline" className="mt-4" onClick={handleUpload}>
              <Plus className="w-4 h-4 mr-2" /> Upload Dokumen Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocs.map((doc) => (
            <Card key={doc.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-3 relative overflow-hidden">
                  {doc.type !== 'pdf' && doc.url !== '#' ? (
                    <img 
                      src={doc.url} 
                      alt={doc.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getFileIcon(doc.type)
                  )}
                  <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      size="icon" 
                      variant="secondary"
                      onClick={() => setPreviewDoc(doc)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="destructive"
                      onClick={() => handleDelete(doc)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium truncate" title={doc.name}>{doc.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {doc.type.toUpperCase()} • {doc.uploadDate}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewDoc?.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {previewDoc?.type === 'pdf' ? (
              <div className="bg-muted rounded-lg p-8 text-center">
                <FileText className="w-20 h-20 mx-auto text-destructive mb-4" />
                <p className="text-muted-foreground">Preview PDF tidak tersedia</p>
                <Button className="mt-4" onClick={() => previewDoc && handleDownload(previewDoc)}>
                  <Download className="w-4 h-4 mr-2" /> Download untuk melihat
                </Button>
              </div>
            ) : previewDoc?.url !== '#' ? (
              <img 
                src={previewDoc?.url} 
                alt={previewDoc?.name}
                className="w-full rounded-lg"
              />
            ) : (
              <div className="bg-muted rounded-lg p-8 text-center">
                <Image className="w-20 h-20 mx-auto text-primary mb-4" />
                <p className="text-muted-foreground">Preview tidak tersedia untuk file</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingDoc} onOpenChange={() => setDeletingDoc(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus dokumen "{deletingDoc?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DocumentPage;
