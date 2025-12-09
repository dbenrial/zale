import { useEffect, useState } from 'react';
import DataTable, { Column } from '@/components/DataTable';
import { FreonData, getFreonData, addFreonData, updateFreonData, deleteFreonData } from '@/lib/store';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useExcelUpload, downloadExcel } from '@/hooks/useExcelUpload';

const FreonPage = () => {
  const [data, setData] = useState<FreonData[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FreonData | null>(null);
  const [deletingItem, setDeletingItem] = useState<FreonData | null>(null);
  const [formData, setFormData] = useState<Partial<FreonData>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setData(getFreonData());
  };

  const handleExcelImport = (importedData: FreonData[]) => {
    importedData.forEach((item, index) => {
      const newItem: FreonData = {
        id: `FR${String(data.length + index + 1).padStart(3, '0')}`,
        date: item.date || new Date().toISOString().split('T')[0],
        acId: item.acId || '',
        location: item.location || '',
        freon: item.freon || '',
        damage: item.damage || '',
        repair: item.repair || '',
        kg: Number(item.kg) || 0,
      };
      addFreonData(newItem);
    });
    loadData();
  };

  const { triggerUpload, fileInputRef, handleFileChange } = useExcelUpload<FreonData>({
    onDataParsed: handleExcelImport,
    columnMapping: {
      'tanggal': 'date',
      'date': 'date',
      'id ac': 'acId',
      'acId': 'acId',
      'lokasi': 'location',
      'location': 'location',
      'freon': 'freon',
      'kerusakan': 'damage',
      'damage': 'damage',
      'perbaikan': 'repair',
      'repair': 'repair',
      'kg': 'kg',
    },
  });

  const columns: Column<FreonData>[] = [
    { key: 'date', header: 'Tanggal' },
    { key: 'acId', header: 'ID AC', searchable: true },
    { key: 'location', header: 'Lokasi', searchable: true },
    { key: 'freon', header: 'Freon', searchable: true },
    { key: 'damage', header: 'Kerusakan' },
    { key: 'repair', header: 'Perbaikan' },
    { 
      key: 'kg', 
      header: 'Kg',
      render: (item) => <span className="font-semibold text-primary">{item.kg} kg</span>
    },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      id: `FR${String(data.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      acId: '',
      location: '',
      freon: '',
      damage: '',
      repair: '',
      kg: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: FreonData) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (item: FreonData) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingItem) {
      deleteFreonData(deletingItem.id);
      loadData();
      toast.success('Data freon berhasil dihapus');
    }
    setIsDeleteDialogOpen(false);
    setDeletingItem(null);
  };

  const handleSave = () => {
    if (!formData.acId || !formData.location) {
      toast.error('Mohon lengkapi field yang diperlukan');
      return;
    }

    if (editingItem) {
      updateFreonData(editingItem.id, formData);
      toast.success('Data freon berhasil diupdate');
    } else {
      addFreonData(formData as FreonData);
      toast.success('Data freon berhasil ditambahkan');
    }
    setIsDialogOpen(false);
    loadData();
  };

  const handleDownload = () => {
    downloadExcel(data, 'data-freon', {
      id: 'ID',
      date: 'Tanggal',
      acId: 'ID AC',
      location: 'Lokasi',
      freon: 'Freon',
      damage: 'Kerusakan',
      repair: 'Perbaikan',
      kg: 'Kg',
    });
  };

  return (
    <div className="animate-slide-up">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        className="hidden"
      />
      <DataTable
        title="Data Penggunaan Freon"
        data={data}
        columns={columns}
        searchKeys={['acId', 'location', 'freon']}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDownload={handleDownload}
        onUpload={triggerUpload}
        freonFilter
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Data Freon' : 'Tambah Data Freon'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Tanggal</Label>
              <Input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>ID AC</Label>
              <Input
                value={formData.acId || ''}
                onChange={(e) => setFormData({ ...formData, acId: e.target.value })}
                placeholder="Contoh: AC001"
              />
            </div>
            <div className="space-y-2">
              <Label>Lokasi</Label>
              <Input
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipe Freon</Label>
              <Input
                value={formData.freon || ''}
                onChange={(e) => setFormData({ ...formData, freon: e.target.value })}
                placeholder="R32, R410, R22"
              />
            </div>
            <div className="space-y-2">
              <Label>Kerusakan</Label>
              <Input
                value={formData.damage || ''}
                onChange={(e) => setFormData({ ...formData, damage: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Perbaikan</Label>
              <Input
                value={formData.repair || ''}
                onChange={(e) => setFormData({ ...formData, repair: e.target.value })}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Jumlah (Kg)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.kg || ''}
                onChange={(e) => setFormData({ ...formData, kg: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="gradient" onClick={handleSave}>
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data freon ini?
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

export default FreonPage;
