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

  const handleInputChange = (e) => {
    const file =
      e.target.files && e.target.files[0] ? e.target.files[0] : undefined;
    handleDrop(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const downloadImg = () => {
    if (!finalImage) return;
    const link = document.createElement("a");
    link.href = finalImage;
    link.download = "bg-removed.png";
    link.click();
    URL.revokeObjectURL(finalImage);
  };

  const reset = () => {
    setFinalImage(null);
    setInputImage(null);
    setIsProcessing(false);
    setError(null);
    if (fileInput.current) fileInput.current.value = "";
  };

  return (
    <div className="flex justify-center flex-col gap-5 items-center min-h-screen bg-gradient-to-tl from-green-300 to-purple-400">
      <h2 className=" text-5xl "> Background Remover. </h2>
      <div className="w-full max-w-3xl bg-gradient-to-r  from-green-300 to-purple-400 backdrop-blur-md rounded-md p-5 sm:p-6 shadow-2xl">
        {!InputlImage && (
          <div
            className="flex flex-col items-center justify-center h-96 mb-5 p-5 bg-gradient-to-r from-green-300/40 to-purple-400/50 backdrop-blur-2xl hover:shadow-purple-300 shadow-2xl transition-all duration-300 text-center cursor-pointer"
            onClick={() => fileInput.current.click()}
          >
            <div className="text-5xl sm:text-2xl animate-pulse">📷</div>
            <div className="text-xl text-black font-weight mb-2 sm-text-xl">
              Drag & drop to upload Image
            </div>
            <div className="text-sm text-black mb-2 sm-text-md">
              JPG, PNG, WEBP supported
            </div>
            <input
              type="file"
              ref={fileInput}
              accept="image/"
              onChange={handleInputChange}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className="hidden"
            />
          </div>
        )}

        {error && 
          <div className="text-center text-black font-semibold mb-5">
            {error}</div>}

            {InputlImage && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center">
                  <div className="text-black text-xl mb-3">Original Image</div>
                  <div className="aspect-square w-full max-w-md mx-auto border-b-black rounded-2xl overflow-hidden flex justify-center items-center">
                      <img src={InputlImage} className="object-contain w-full h-full"/>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-black text-xl mb-3">Background Removed Image</div>
                  <div className="aspect-square w-full max-w-md mx-auto border-b-black rounded-2xl overflow-hidden flex justify-center items-center">
                      {
                        finalImage ? (
                      <img src={finalImage} className="object-contain w-full h-full"/>):(<div className="flex flex-col items-center">
                        {isProcessing ? (<div className="flex flex-col items-center">
                          <div className="animate-spin w-6 h-6 border-2 border-black rounded-full "></div>
                          Processing.....
                        </div>):(<span>Process image will apper here</span>)}
                      </div>)
                      }
                      
                  </div>
                </div>
              </div>
              
            )}
          
        
      </div>
    </div>
  );
}

export default App;
