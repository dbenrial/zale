import { useEffect, useState } from 'react';
import DataTable, { Column } from '@/components/DataTable';
import { MaintenanceData, getMaintenanceData, addMaintenanceData, updateMaintenanceData, deleteMaintenanceData } from '@/lib/store';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useExcelUpload, downloadExcel } from '@/hooks/useExcelUpload';

const MaintenancePage = () => {
  const [data, setData] = useState<MaintenanceData[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MaintenanceData | null>(null);
  const [deletingItem, setDeletingItem] = useState<MaintenanceData | null>(null);
  const [formData, setFormData] = useState<Partial<MaintenanceData>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setData(getMaintenanceData());
  };

  const handleExcelImport = (importedData: MaintenanceData[]) => {
    importedData.forEach((item, index) => {
      const newItem: MaintenanceData = {
        id: `MT${String(data.length + index + 1).padStart(3, '0')}`,
        date: item.date || new Date().toISOString().split('T')[0],
        acId: item.acId || '',
        location: item.location || '',
        merk: item.merk || '',
        freon: item.freon || '',
        damage: item.damage || '',
        repair: item.repair || '',
        information: item.information || '',
      };
      addMaintenanceData(newItem);
    });
    loadData();
  };

  const { triggerUpload, fileInputRef, handleFileChange } = useExcelUpload<MaintenanceData>({
    onDataParsed: handleExcelImport,
    columnMapping: {
      'tanggal': 'date',
      'date': 'date',
      'id ac': 'acId',
      'acId': 'acId',
      'lokasi': 'location',
      'location': 'location',
      'merk': 'merk',
      'freon': 'freon',
      'kerusakan': 'damage',
      'damage': 'damage',
      'perbaikan': 'repair',
      'repair': 'repair',
      'info': 'information',
      'information': 'information',
    },
  });

  const columns: Column<MaintenanceData>[] = [
    { key: 'date', header: 'Tanggal' },
    { key: 'acId', header: 'ID AC', searchable: true },
    { key: 'location', header: 'Lokasi', searchable: true },
    { key: 'merk', header: 'Merk' },
    { key: 'freon', header: 'Freon', searchable: true },
    { key: 'damage', header: 'Kerusakan' },
    { key: 'repair', header: 'Perbaikan' },
    { 
      key: 'information', 
      header: 'Info',
      render: (item) => (
        <span className="truncate max-w-[150px] block" title={item.information}>
          {item.information}
        </span>
      )
    },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      id: `MT${String(data.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      acId: '',
      location: '',
      merk: '',
      freon: '',
      damage: '',
      repair: '',
      information: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: MaintenanceData) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (item: MaintenanceData) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingItem) {
      deleteMaintenanceData(deletingItem.id);
      loadData();
      toast.success('Data maintenance berhasil dihapus');
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
      updateMaintenanceData(editingItem.id, formData);
      toast.success('Data maintenance berhasil diupdate');
    } else {
      addMaintenanceData(formData as MaintenanceData);
      toast.success('Data maintenance berhasil ditambahkan');
    }
    setIsDialogOpen(false);
    loadData();
  };

  const handleDownload = () => {
    downloadExcel(data, 'data-maintenance', {
      id: 'ID',
      date: 'Tanggal',
      acId: 'ID AC',
      location: 'Lokasi',
      merk: 'Merk',
      freon: 'Freon',
      damage: 'Kerusakan',
      repair: 'Perbaikan',
      information: 'Info',
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
        title="Data Maintenance"
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
            <DialogTitle>{editingItem ? 'Edit Maintenance' : 'Tambah Maintenance'}</DialogTitle>
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
              <Label>Merk</Label>
              <Input
                value={formData.merk || ''}
                onChange={(e) => setFormData({ ...formData, merk: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Freon</Label>
              <Input
                value={formData.freon || ''}
                onChange={(e) => setFormData({ ...formData, freon: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Kerusakan</Label>
              <Input
                value={formData.damage || ''}
                onChange={(e) => setFormData({ ...formData, damage: e.target.value })}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Perbaikan</Label>
              <Input
                value={formData.repair || ''}
                onChange={(e) => setFormData({ ...formData, repair: e.target.value })}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Informasi Tambahan</Label>
              <Textarea
                value={formData.information || ''}
                onChange={(e) => setFormData({ ...formData, information: e.target.value })}
                rows={3}
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
              Apakah Anda yakin ingin menghapus data maintenance ini?
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

export default MaintenancePage;
