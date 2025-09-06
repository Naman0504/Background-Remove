import { useState, useRef } from "react";
import { removeBackground } from "@imgly/background-removal";

import "./App.css";

function App() {
  const [InputImage, setInputImage] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const fileInput = useRef(null);

  const handleFileSelect = async (uploadedFile) => {
    if (!uploadedFile ||
      !uploadedFile.type ||
      !uploadedFile.type.startsWith("image/")) {
      setError("Please Select a valid image file");
      return;
    }

    setError(null);
   setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        setInputImage(e.target.result);
      }
    };

    reader.readAsDataURL(uploadedFile);

    try {
      const blob = await removeBackground(uploadedFile,);

      console.log("BG Removed Blob:", blob); // ✅ debug check
      const imgUrl = URL.createObjectURL(blob);
      
      console.log("BG Removed URLLLL", imgUrl); //
      setFinalImage(imgUrl);
    } catch (error) {
      setError("failed to process Image");
      console.log("failed to process Image.....");
    } finally {
      setIsProcessing(false);
    }
  };


  const handleDrag = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleInputChange = (e) => {
    const file =
      e.target.files && e.target.files[0] ? e.target.files[0] : undefined;
    if (file) {
      handleFileSelect(file);
    }
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
    <div className="p-2 flex justify-center flex-col gap-5 items-center min-h-screen bg-gradient-to-tl from-green-300 to-purple-400">
      <h2 className=" text-4xl md:text-5xl "> Background Remover. </h2>
      <div className="w-full max-w-3xl bg-gradient-to-r  from-green-300 to-purple-400 backdrop-blur-md rounded-md p-5 sm:p-6 shadow-2xl">
        {!InputImage && (
          <div
            className="flex flex-col items-center justify-center h-96 mb-5 p-5 bg-gradient-to-r from-green-300/40 to-purple-400/50 backdrop-blur-2xl hover:shadow-purple-300 shadow-2xl transition-all duration-300 text-center cursor-pointer"
            onClick={() => fileInput.current.click()}
             onDragOver={handleDrag}
              onDrop={handleDrop}
          >
            <div className="text-5xl sm:text-2xl animate-bounce">📷</div>
            <div className="text-xl text-black font-weight mb-2 sm-text-xl">
              Drag & drop to upload Image
            </div>
            <div className="text-sm text-black mb-2 sm-text-md">
              JPG, PNG, WEBP supported
            </div>
            <input
              type="file"
              ref={fileInput}
              accept="image/*"
              onChange={handleInputChange}
             
              className="hidden"
            />
          </div>
        )}

        {error &&
          <div className="text-center text-black font-semibold mb-5">
            {error}</div>}

        {InputImage && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <div className="text-black text-xl mb-2 font-bold">Original Image</div>
              <div className="aspect-square w-full max-w-md mx-auto border-b-black rounded-2xl overflow-hidden flex justify-center items-center">
                <img src={InputImage} className="object-contain w-full h-full" />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-black text-xl mb-2 font-bold">Background Removed Image</div>
              <div className="aspect-square w-full max-w-md mx-auto border-b-black rounded-2xl overflow-hidden flex justify-center items-center">
                {
                  finalImage ? (
                    <img src={finalImage} className="object-contain w-full h-full" />) : (<div className="flex flex-col items-center">
                      {isProcessing ? (<div className="flex flex-col items-center">
                        <div className="animate-spin w-6 h-6 border-2 border-black rounded-full "></div>
                        Processing.....
                      </div>) : (<span>Process image will apper here</span>)}
                    </div>)
                }

              </div>
            </div>
          </div>

        )}
        {
          InputImage && (<div className=" justify-center  items-center flex flex-col md:flex-row gap-5 p-3 mt-3">
            <button className="bg-black text-white px-6 py-3 w-full rounded-md hover:opacity-85 cursor-pointer" onClick={reset}>Reset Image</button>
            <button onClick={downloadImg} disabled={!finalImage} className="bg-black w-full text-white px-6 py-3 rounded-md hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">{finalImage ? "Download Result" : "processing..."}</button>
          </div>)
        }

      </div>
    </div>
  );
}

export default App;
