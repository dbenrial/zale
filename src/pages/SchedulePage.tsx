import { useEffect, useState } from 'react';
import DataTable, { Column } from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { ScheduleData, getScheduleData, addScheduleData, updateScheduleData, deleteScheduleData } from '@/lib/store';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useExcelUpload, downloadExcel } from '@/hooks/useExcelUpload';

const SchedulePage = () => {
  const [data, setData] = useState<ScheduleData[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleData | null>(null);
  const [deletingItem, setDeletingItem] = useState<ScheduleData | null>(null);
  const [formData, setFormData] = useState<Partial<ScheduleData>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setData(getScheduleData());
  };

  const handleExcelImport = (importedData: ScheduleData[]) => {
    importedData.forEach((item, index) => {
      const durationValue = String(item.duration || '').toLowerCase();
      let duration: ScheduleData['duration'] = 'Schedule';
      if (durationValue.includes('finish') || durationValue.includes('selesai')) {
        duration = 'Finished';
      } else if (durationValue.includes('reschedule') || durationValue.includes('ulang')) {
        duration = 'Reschedule';
      }
      
      const newItem: ScheduleData = {
        id: `SC${String(data.length + index + 1).padStart(3, '0')}`,
        date: item.date || new Date().toISOString().split('T')[0],
        acId: item.acId || '',
        location: item.location || '',
        merek: item.merek || '',
        duration,
      };
      addScheduleData(newItem);
    });
    loadData();
  };

  const { triggerUpload, fileInputRef, handleFileChange } = useExcelUpload<ScheduleData>({
    onDataParsed: handleExcelImport,
    columnMapping: {
      'tanggal': 'date',
      'date': 'date',
      'id ac': 'acId',
      'acId': 'acId',
      'lokasi': 'location',
      'location': 'location',
      'merek': 'merek',
      'merk': 'merek',
      'status': 'duration',
      'duration': 'duration',
    },
  });

  const columns: Column<ScheduleData>[] = [
    { key: 'date', header: 'Tanggal' },
    { key: 'acId', header: 'ID AC', searchable: true },
    { key: 'location', header: 'Lokasi', searchable: true },
    { key: 'merek', header: 'Merek' },
    {
      key: 'duration',
      header: 'Status',
      render: (item) => <StatusBadge status={item.duration} />,
    },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      id: `SC${String(data.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      acId: '',
      location: '',
      merek: '',
      duration: 'Schedule',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: ScheduleData) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (item: ScheduleData) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingItem) {
      deleteScheduleData(deletingItem.id);
      loadData();
      toast.success('Jadwal berhasil dihapus');
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
      updateScheduleData(editingItem.id, formData);
      toast.success('Jadwal berhasil diupdate');
    } else {
      addScheduleData(formData as ScheduleData);
      toast.success('Jadwal berhasil ditambahkan');
    }
    setIsDialogOpen(false);
    loadData();
  };

  const handleDownload = () => {
    downloadExcel(data, 'data-schedule', {
      id: 'ID',
      date: 'Tanggal',
      acId: 'ID AC',
      location: 'Lokasi',
      merek: 'Merek',
      duration: 'Status',
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
        title="Jadwal Maintenance"
        data={data}
        columns={columns}
        searchKeys={['acId', 'location']}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDownload={handleDownload}
        onUpload={triggerUpload}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Jadwal' : 'Tambah Jadwal'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
              <Label>Merek</Label>
              <Input
                value={formData.merek || ''}
                onChange={(e) => setFormData({ ...formData, merek: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData({ ...formData, duration: value as ScheduleData['duration'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Schedule">Dijadwalkan</SelectItem>
                  <SelectItem value="Reschedule">Dijadwalkan Ulang</SelectItem>
                  <SelectItem value="Finished">Selesai</SelectItem>
                </SelectContent>
              </Select>
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
              Apakah Anda yakin ingin menghapus jadwal ini?
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

export default SchedulePage;
