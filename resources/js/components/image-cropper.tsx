"use client";

import React, { type SyntheticEvent } from "react";

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import "react-image-crop/dist/ReactCrop.css";
import { CropIcon, Trash2Icon, ImageIcon } from "lucide-react";

export const ASPECT_RATIOS = {
  FREEFORM: { value: 0, label: "Freeform", ratio: undefined },
  SQUARE: { value: 1, label: "1:1 - Square", ratio: 1 },
  PORTRAIT: { value: 3 / 4, label: "3:4 - Portrait", ratio: 3 / 4 },
  LANDSCAPE_4_3: { value: 4 / 3, label: "4:3 - Landscape", ratio: 4 / 3 },
  LANDSCAPE_16_9: { value: 16 / 9, label: "16:9 - Widescreen", ratio: 16 / 9 },
  LANDSCAPE_21_9: { value: 21 / 9, label: "21:9 - Ultrawide", ratio: 21 / 9 },
} as const;

interface ImageCropperProps {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFile: File | null;
  onCropComplete: (croppedImageBlob: Blob, croppedImageUrl: string) => void;
  onCancel?: () => void;
  aspectRatio?: number; // e.g., 16/9 for hero, 1 for square
  allowAspectRatioChange?: boolean; // Allow user to change aspect ratio
  triggerLabel?: string;
  previewUrl?: string;
}

export function ImageCropper({
  dialogOpen,
  setDialogOpen,
  selectedFile,
  onCropComplete,
  onCancel,
  aspectRatio = 16 / 9,
  allowAspectRatioChange = false,
  triggerLabel = "Crop Image",
  previewUrl,
}: ImageCropperProps) {
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = React.useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>("");
  const [filePreview, setFilePreview] = React.useState<string>("");
  const [currentAspectRatio, setCurrentAspectRatio] = React.useState<number | undefined>(aspectRatio);

  React.useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setFilePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [selectedFile]);

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    if (currentAspectRatio) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, currentAspectRatio));
    }
  }

  function handleAspectRatioChange(value: string) {
    const ratioValue = parseFloat(value);
    const newAspectRatio = ratioValue === 0 ? undefined : ratioValue;
    setCurrentAspectRatio(newAspectRatio);

    // Recalculate crop with new aspect ratio
    if (imgRef.current && newAspectRatio) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, newAspectRatio));
    }
  }

  function getAspectRatioLabel(ratio?: number): string {
    if (!ratio) return ASPECT_RATIOS.FREEFORM.label;
    const entry = Object.values(ASPECT_RATIOS).find((r) => Math.abs((r.ratio || 0) - ratio) < 0.01);
    return entry?.label || "Custom Ratio";
  }

  function onCropChange(crop: PixelCrop) {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(imgRef.current, crop);
      setCroppedImageUrl(croppedImageUrl);
    }
  }

  function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );
    }

    return canvas.toDataURL("image/jpeg", 0.95);
  }

  async function onCrop() {
    try {
      if (!croppedImageUrl) return;

      // Convert data URL to Blob
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();

      onCropComplete(blob, croppedImageUrl);
      setDialogOpen(false);
    } catch (error) {
      console.error("Crop failed:", error);
      alert("Something went wrong while cropping the image!");
    }
  }

  function handleCancel() {
    setDialogOpen(false);
    onCancel?.();
  }

  const displayUrl = previewUrl || filePreview;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <ImageIcon className="mr-2 h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0 gap-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Crop Image
            </h3>
            {allowAspectRatioChange && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Aspect Ratio:</span>
                <Select
                  value={currentAspectRatio?.toString() || "0"}
                  onValueChange={handleAspectRatioChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ASPECT_RATIOS).map((ratio) => (
                      <SelectItem key={ratio.label} value={ratio.value.toString()}>
                        {ratio.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {!allowAspectRatioChange && (
              <span className="text-sm text-muted-foreground">
                {getAspectRatioLabel(currentAspectRatio)}
              </span>
            )}
          </div>
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => onCropChange(c)}
            aspect={currentAspectRatio}
            className="w-full max-h-[60vh]"
          >
            <img
              ref={imgRef}
              alt="Crop preview"
              src={displayUrl}
              onLoad={onImageLoad}
              className="max-w-full h-auto"
            />
          </ReactCrop>
        </div>
        <DialogFooter className="p-6 pt-0 justify-between sm:justify-between">
          <DialogClose asChild>
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              <Trash2Icon className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" size="sm" onClick={onCrop}>
            <CropIcon className="mr-2 h-4 w-4" />
            Crop & Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to center the crop
export function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}
