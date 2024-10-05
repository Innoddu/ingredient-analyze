import { useState } from 'react';
import Image from 'next/image';

interface DetectedObject {
  name: string;
  score: number;
}

const FoodUpload = () => {
  // State for managing selected image in Base64 format
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // State for storing detected objects from image analysis
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  
  // State to handle analysis failure
  const [analysisFailed, setAnalysisFailed] = useState(false);
  
  // State to control showing/hiding the uploader
  const [showUploader, setShowUploader] = useState(false);  
  
  // State to manage the loading spinner during image analysis
  const [loading, setLoading] = useState(false);

  // Function to convert an image to Base64 format
  const toBase64 = (file: File): Promise<string> => 
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);  // Cast result as string
    reader.onerror = error => reject(error);
  });

  // Function to handle the image selection and conversion to Base64
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Make sure target and files are not null
    const target = event.target as HTMLInputElement;  // Type narrowing
    if (target?.files?.[0]) {
      const file = target.files[0];
      const imageBase64 = await toBase64(file);
      setSelectedImage(imageBase64);
      setDetectedObjects([]);  // Reset previously detected objects when a new image is selected
      setAnalysisFailed(false); // Reset analysis failed state on new image selection
    }
  };

  // Function to handle image analysis by sending the image to an API
  const analyzeImage = async () => {
    setLoading(true);  // Set loading state to true when analysis starts
    if (selectedImage) {
      try {
        const res = await fetch('/api/analyzeImage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: selectedImage }),
        });
        
        const data = await res.json();
        
        if (data.detectedObjects.length > 0) {
          setDetectedObjects(data.detectedObjects);  // Store detected objects from API response
          setAnalysisFailed(false); // Reset failed state if objects are detected
        } else {
          setAnalysisFailed(true); // Set failed state if no objects are detected
        }
      } catch (error) {
        console.error("Error occurred during image analysis", error);
        setAnalysisFailed(true); // Set failed state if an error occurs
      } finally {
        setLoading(false); // Stop loading spinner after analysis is done
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white relative">
      {/* Left section for introduction text and Play Demo button */}
      <div
        className={`transition-all duration-500 transform flex flex-col justify-center items-center ${
          showUploader ? 'translate-x-[-40%]' : 'translate-x-0'
        } w-1/2 h-full p-8 text-center`}>
        <h1 className="text-8xl font-bold mb-4 text-black font-jost">Your Personal Chef Service</h1>
        <p className="text-xl mb-6 text-black font-jost">
          Using AI, we analyze the contents of your fridge and suggest the best meals tailored to your ingredients.
        </p>
        <button 
          onClick={() => setShowUploader(true)} 
          className="bg-black text-white px-6 py-3 rounded-md border border-transparent hover:bg-gray-300 hover:border-gray-500 hover:text-black transition">
          Play Demo!
        </button>
      </div>
  
      {/* Right section - Image upload section that appears when Play Demo is clicked */}
      <div
        className={`transition-all duration-500 transform flex flex-col justify-center items-center ${
          showUploader ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } w-1/2 h-1/2 p-8 bg-gray-100 rounded-lg shadow-lg max-w-md absolute right-36`}>
        
        {/* Close button for the uploader section */}
        <button 
          onClick={() => setShowUploader(false)} 
          className="absolute top-4 right-4 text-black text-xl font-bold">
          X
        </button>
  
        {/* Uploader heading */}
        <h1 className="text-2xl font-bold mb-4 text-center text-black font-jost">Upload Your Food</h1>
  
        {/* Show the selected image after it is uploaded */}
        {selectedImage && (
          <div className="mb-4">
            <Image
              src={selectedImage}
              alt="Selected"
              width={500} 
              height={300} 
              className="w-full h-auto rounded-md"
            />
          </div>
        )}
  
        {/* Input for selecting an image file */}
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
  
        {/* Analyze button that triggers the analyzeImage function */}
        {selectedImage && (
          <button 
            onClick={analyzeImage} 
            className="mt-4 w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-300 hover:border-gray-500 hover:text-black transition">
            Analyze
          </button>
        )}

      {/* Loading spinner that appears while analysis is running */}
      {loading && (
        <div className="flex justify-center items-center mt-4">
          <div className="loader ease-linear rounded-full border-4 border-gray-300 border-t-4 border-t-black h-12 w-12 animate-spin"></div>
        </div>
      )}

  
        {/* Display detected objects after the analysis is complete */}
        {Array.isArray(detectedObjects) && detectedObjects.length > 0 ? (
          <div className="mt-4 text-black font-jost">
            <h2 className="text-xl font-semibold mb-2">List of analyze images:</h2>
            <ul className="list-disc pl-5">
              {detectedObjects.map((obj, index) => (
                <li key={index}>
                  {obj.name} (confidence score: {(obj.score * 100).toFixed(2)}%)
                </li>
              ))}
            </ul>
          </div>
        ) : (
          // Show an error message if no objects are detected or if analysis fails
          analysisFailed && (
            <p className="mb-4 text-center text-black">No results found. Please try a different image.</p>
          )
        )}
      </div>
    </div>
  );
  
};

export default FoodUpload;
