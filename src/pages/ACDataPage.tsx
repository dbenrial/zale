import { useEffect, useState } from "react";
import DataTable, { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import {
  ACData,
  getACData,
  addACData,
  updateACData,
  deleteACData,
} from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useExcelUpload, downloadExcel } from "@/hooks/useExcelUpload";

const ACDataPage = () => {
  const [data, setData] = useState<ACData[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ACData | null>(null);
  const [deletingItem, setDeletingItem] = useState<ACData | null>(null);
  const [formData, setFormData] = useState<Partial<ACData>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setData(getACData());
  };

  const handleExcelImport = (importedData: ACData[]) => {
    importedData.forEach((item, index) => {
      const statusValue = String(item.status || "").toLowerCase();
      const newItem: ACData = {
        id: item.id || `AC${String(data.length + index + 1).padStart(3, "0")}`,
        location: item.location || "",
        merk: item.merk || "",
        freon: (item.freon as ACData["freon"]) || "R32",
        date: item.date || new Date().toISOString().split("T")[0],
        status:
          statusValue === "rusak" || statusValue === "broken"
            ? "broken"
            : "good",
      };
      addACData(newItem);
    });
    loadData();
  };

  const { triggerUpload, fileInputRef, handleFileChange } =
    useExcelUpload<ACData>({
      onDataParsed: handleExcelImport,
      columnMapping: {
        id: "id",
        lokasi: "location",
        location: "location",
        merk: "merk",
        freon: "freon",
        tanggal: "date",
        date: "date",
        status: "status",
      },
    });

  const columns: Column<ACData>[] = [
    { key: "id", header: "ID", searchable: true },
    { key: "location", header: "Lokasi", searchable: true },
    { key: "merk", header: "Merk" },
    { key: "freon", header: "Freon", searchable: true },
    { key: "date", header: "Tanggal" },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      id: `AC${String(data.length + 1).padStart(3, "0")}`,
      location: "",
      merk: "",
      freon: "R32",
      date: new Date().toISOString().split("T")[0],
      status: "good",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: ACData) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (item: ACData) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingItem) {
      deleteACData(deletingItem.id);
      loadData();
      toast.success("Data AC berhasil dihapus");
    }
    setIsDeleteDialogOpen(false);
    setDeletingItem(null);
  };

  const handleSave = () => {
    if (!formData.id || !formData.location || !formData.merk) {
      toast.error("Mohon lengkapi semua field");
      return;
    }

    if (editingItem) {
      updateACData(editingItem.id, formData);
      toast.success("Data AC berhasil diupdate");
    } else {
      addACData(formData as ACData);
      toast.success("Data AC berhasil ditambahkan");
    }
    setIsDialogOpen(false);
    loadData();
  };

  const handleDownload = () => {
    downloadExcel(data, "data-ac", {
      id: "ID",
      location: "Lokasi",
      merk: "Merk",
      freon: "Freon",
      date: "Tanggal",
      status: "Status",
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
        title="Data AC"
        data={data}
        columns={columns}
        searchKeys={["id", "location", "freon"]}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDownload={handleDownload}
        onUpload={triggerUpload}
        freonFilter
      />

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Data AC" : "Tambah Data AC"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>ID</Label>
              <Input
                value={formData.id || ""}
                onChange={(e) =>
                  setFormData({ ...formData, id: e.target.value })
                }
                disabled={!!editingItem}
              />
            </div>
            <div className="space-y-2">
              <Label>Lokasi</Label>
              <Input
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Masukkan lokasi"
              />
            </div>
            <div className="space-y-2">
              <Label>Merk</Label>
              <Input
                value={formData.merk || ""}
                onChange={(e) =>
                  setFormData({ ...formData, merk: e.target.value })
                }
                placeholder="Masukkan merk"
              />
            </div>
            <div className="space-y-2">
              <Label>Freon</Label>
              <Select
                value={formData.freon}
                onValueChange={(value) =>
                  setFormData({ ...formData, freon: value as ACData["freon"] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe freon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="R32">R32</SelectItem>
                  <SelectItem value="R410">R410</SelectItem>
                  <SelectItem value="R22">R22</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tanggal</Label>
              <Input
                type="date"
                value={formData.date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as ACData["status"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="good">Bagus</SelectItem>
                  <SelectItem value="broken">Rusak</SelectItem>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data AC "{deletingItem?.id}"?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ACDataPage;
