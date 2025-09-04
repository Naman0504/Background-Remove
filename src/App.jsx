import { useState, useRef } from "react";
import { removeBackground } from "@imgly/background-removal";

import "./App.css";

function App() {
  const [InputlImage, setInputImage] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const fileInput = useRef(null);

  const handleFileSelect = async (uploadedFile) => {
    if (!uploadedFile || uploadedFile.type.startWith("image/")) {
      setError("Please Select a valid image file");
      return;
    }

    setError(null);
    setIsProcessing(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        setInputImage(e.target.result);
      }
    };

    reader.readAsDataURL(file);

    try {
      const blob = await removeBackground(uploadedFile);
      const imgUrl = URL.createObjectURL(blob);
      setFinalImage(imgUrl);
    } catch (error) {
      setError("failed to process Image");
      console.log("failed to process Image.....");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = () => {
    const file =
      e.target.files && e.target.files[0] ? e.target.files[0] : undefined;
    handleDrop(file);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-tl from-green-300 to-purple-400">
      <h2 className=" text-5xl "> Background Remover. </h2>
    </div>
  );
}

export default App;
