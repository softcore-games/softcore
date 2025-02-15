'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Asset {
  id: string;
  type: 'background' | 'character';
  name: string;
  url: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NewAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editingAsset: Asset | null;
  onClose: () => void;
}

export function NewAssetDialog({
  open,
  onOpenChange,
  onSuccess,
  editingAsset,
  onClose,
}: NewAssetDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [asset, setAsset] = useState({
    type: 'background' as 'background' | 'character',
    name: '',
    url: '',
    category: '',
  });

  useEffect(() => {
    if (editingAsset) {
      setAsset({
        type: editingAsset.type,
        name: editingAsset.name,
        url: editingAsset.url,
        category: editingAsset.category || '',
      });
    } else {
      setAsset({
        type: 'background',
        name: '',
        url: '',
        category: '',
      });
    }
  }, [editingAsset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingAsset
        ? `/api/admin/assets/${editingAsset.id}`
        : '/api/admin/assets';
      
      const method = editingAsset ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(asset),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Asset ${editingAsset ? 'updated' : 'created'} successfully`,
        });
        onSuccess();
        onClose();
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.error || `Failed to ${editingAsset ? 'update' : 'create'} asset`,
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
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editingAsset ? 'Edit Asset' : 'Add New Asset'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={asset.type}
                onValueChange={(value: 'background' | 'character') =>
                  setAsset({ ...asset, type: value })
                }
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="background">Background</SelectItem>
                  <SelectItem value="character">Character</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={asset.name}
                onChange={(e) => setAsset({ ...asset, name: e.target.value })}
                required
                className="bg-gray-700 border-gray-600"
                placeholder="e.g., classroom or mei_happy"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">URL</label>
              <Input
                value={asset.url}
                onChange={(e) => setAsset({ ...asset, url: e.target.value })}
                required
                className="bg-gray-700 border-gray-600"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category (optional)</label>
              <Input
                value={asset.category}
                onChange={(e) => setAsset({ ...asset, category: e.target.value })}
                className="bg-gray-700 border-gray-600"
                placeholder="e.g., indoor, outdoor"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/20"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  {editingAsset ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                editingAsset ? 'Update Asset' : 'Add Asset'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}