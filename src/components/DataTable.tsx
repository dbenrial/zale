import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Download, Upload, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  searchable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onDownload?: () => void;
  onUpload?: () => void;
  title: string;
  freonFilter?: boolean;
}

function DataTable<T extends { id: string }>({
  data,
  columns,
  searchKeys = [],
  onAdd,
  onEdit,
  onDelete,
  onDownload,
  onUpload,
  title,
  freonFilter = false,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [freonType, setFreonType] = useState<string>('all');

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = searchKeys.some((key) => {
        const value = item[key];
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });

      const matchesFreon = freonType === 'all' || 
        (item as Record<string, unknown>).freon === freonType;

      return (searchTerm === '' || matchesSearch) && matchesFreon;
    });
  }, [data, searchTerm, searchKeys, freonType]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex flex-wrap gap-2">
          {onUpload && (
            <Button variant="outline" size="sm" onClick={onUpload}>
              <Upload className="w-4 h-4 mr-1" /> Upload
            </Button>
          )}
          {onDownload && (
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download className="w-4 h-4 mr-1" /> Download
            </Button>
          )}
          {onAdd && (
            <Button variant="gradient" size="sm" onClick={onAdd}>
              <Plus className="w-4 h-4 mr-1" /> Tambah
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan ID, Lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        {freonFilter && (
          <Select value={freonType} onValueChange={setFreonType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter Freon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Freon</SelectItem>
              <SelectItem value="R32">R32</SelectItem>
              <SelectItem value="R410">R410</SelectItem>
              <SelectItem value="R22">R22</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {columns.map((col) => (
                  <TableHead key={String(col.key)} className="font-semibold">
                    {col.header}
                  </TableHead>
                ))}
                {(onEdit || onDelete) && (
                  <TableHead className="text-right font-semibold">Aksi</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                    className="text-center py-10 text-muted-foreground"
                  >
                    Tidak ada data ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={cn(
                      'transition-colors hover:bg-muted/30',
                      index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                    )}
                  >
                    {columns.map((col) => (
                      <TableCell key={String(col.key)}>
                        {col.render
                          ? col.render(item)
                          : String((item as Record<string, unknown>)[col.key as string] ?? '')}
                      </TableCell>
                    ))}
                    {(onEdit || onDelete) && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                              onClick={() => onEdit(item)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => onDelete(item)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-sm text-muted-foreground">
        Menampilkan {filteredData.length} dari {data.length} data
      </div>
    </div>
  );
}

export default DataTable;
