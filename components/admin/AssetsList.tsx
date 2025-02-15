'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { NewAssetDialog } from './NewAssetDialog';
import { useToast } from '@/hooks/use-toast';
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

interface Asset {
  id: string;
  type: 'background' | 'character';
  name: string;
  url: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AssetsListProps {
  assets: Asset[];
  filter: 'all' | 'background' | 'character';
  onFilterChange: (value: 'all' | 'background' | 'character') => void;
}

export function AssetsList({ assets, filter, onFilterChange }: AssetsListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deletingAsset, setDeletingAsset] = useState<Asset | null>(null);

  const handleDelete = async () => {
    if (!deletingAsset) return;

    try {
      const response = await fetch(`/api/admin/assets/${deletingAsset.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Asset deleted successfully',
        });
        router.refresh();
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete asset',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setDeletingAsset(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Asset Management</h2>
        <div className="flex gap-4">
          <Select
            value={filter}
            onValueChange={onFilterChange}
          >
            <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="background">Backgrounds</SelectItem>
              <SelectItem value="character">Characters</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => setShowNewDialog(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="group bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors"
          >
            <div className="relative aspect-video">
              <Image
                src={asset.url}
                alt={asset.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setEditingAsset(asset)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeletingAsset(asset)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-blue-400">{asset.name}</h3>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                  {asset.type}
                </span>
              </div>
              {asset.category && (
                <p className="text-sm text-gray-400">{asset.category}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Updated: {new Date(asset.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <NewAssetDialog
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
        onSuccess={() => {
          setShowNewDialog(false);
          router.refresh();
        }}
        editingAsset={editingAsset}
        onClose={() => setEditingAsset(null)}
      />

      <AlertDialog open={!!deletingAsset} onOpenChange={() => setDeletingAsset(null)}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Asset</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this asset? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}