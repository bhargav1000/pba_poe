"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { toast } from "sonner"

export default function PhotoCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraOn(true);
          toast.success("Camera started successfully");
        }
      }
    } catch (error) {
      toast.error("Failed to start camera");
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 300, 200);
        const imageUrl = canvasRef.current.toDataURL("image/png");
        setPhoto(imageUrl);
        toast.success("Photo taken successfully");
      }
    }
  };

  const handleUpload = async () => {
    if (!photo) return;
    try {
      const response = await fetch(photo);
      const blob = await response.blob();
      const file = new File([blob], "photo.png", { type: "image/png" });
      console.log("File metadata:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });
      toast.success("Photo uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload photo");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">POE App</h1>
      <Card className="p-4 w-80 flex flex-col items-center">
        <CardContent className="flex flex-col items-center space-y-2 w-full">
          <video ref={videoRef} autoPlay playsInline className="rounded-lg w-full" hidden={!isCameraOn} />
          <canvas ref={canvasRef} width="300" height="200" hidden />
          {photo && <img src={photo} alt="Captured" className="rounded-lg" />}
          <div className="flex flex-col space-y-2 w-full">
            <Button onClick={startCamera} variant="secondary" className="w-full">
              Start Camera
            </Button>
            <Button onClick={takePhoto} variant="default" className="w-full">
              <Camera className="w-4 h-4 mr-2" /> Take Photo
            </Button>
            <Button onClick={handleUpload} disabled={!photo} className="w-full">
              Upload
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
