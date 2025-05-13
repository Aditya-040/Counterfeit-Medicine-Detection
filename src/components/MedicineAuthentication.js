import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { QrReader } from 'react-qr-reader';
import medicineDataset from '../data/medicineDataset';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ImageUpload = styled.div`
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;
  cursor: pointer;
  
  &:hover {
    border-color: #666;
  }
`;

const ResultsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ResultCard = styled.div`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
`;

const MedicineInfo = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #e3f2fd;
  border-radius: 8px;
`;

const MedicineAuthentication = () => {
  const [image, setImage] = useState(null);
  const [results, setResults] = useState({
    colorAnalysis: null,
    textureAnalysis: null,
    logoVerification: null,
    barcodeValidation: null,
    textVerification: null
  });
  const [identifiedMedicine, setIdentifiedMedicine] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          analyzeImage(img);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (img) => {
    // Color Analysis
    const colorAnalysis = analyzeColors(img);
    
    // Texture Analysis
    const textureFeatures = analyzeTexture(img);
    
    // Logo and Text Verification
    const { logoScore, textContent } = await verifyLogoAndText(img);
    
    // Barcode/QR Code Validation
    const barcodeData = await validateBarcode(img);

    // Try to identify the medicine
    let medicine = null;
    if (barcodeData.found) {
      medicine = medicineDataset.findMedicineByBarcode(barcodeData.data);
    }

    if (medicine) {
      // Verify against the identified medicine's characteristics
      const colorVerification = medicineDataset.verifyColor(
        colorAnalysis.dominantColor,
        medicine.characteristics.color.dominant,
        medicine.characteristics.color.tolerance
      );

      const textureVerification = medicineDataset.verifyTexture(
        textureFeatures,
        medicine.characteristics.texture
      );

      const textVerification = medicineDataset.verifyText(
        textContent,
        medicine.characteristics.packaging.text
      );

      setResults({
        colorAnalysis: {
          ...colorAnalysis,
          verification: colorVerification
        },
        textureAnalysis: {
          ...textureFeatures,
          verification: textureVerification
        },
        logoVerification: {
          score: logoScore,
          verification: textVerification
        },
        textVerification: textContent,
        barcodeValidation: {
          ...barcodeData,
          verified: true
        }
      });

      setIdentifiedMedicine(medicine);
    } else {
      setResults({
        colorAnalysis,
        textureAnalysis: textureFeatures,
        logoVerification: { score: logoScore },
        textVerification: textContent,
        barcodeValidation: barcodeData
      });
      setIdentifiedMedicine(null);
    }
  };

  const analyzeColors = (img) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }
    
    const pixelCount = data.length / 4;
    const dominantColor = [
      Math.round(r / pixelCount),
      Math.round(g / pixelCount),
      Math.round(b / pixelCount)
    ];

    return {
      dominantColor,
      colorMatch: {
        match: true,
        confidence: 0.9
      }
    };
  };

  const analyzeTexture = (img) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let variation = 0;
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      variation += brightness;
    }
    
    const avgVariation = variation / (data.length / 4);
    
    return {
      contrast: avgVariation / 255,
      homogeneity: 1 - (avgVariation / 255),
      energy: 0.8
    };
  };

  const verifyLogoAndText = async (img) => {
    // Placeholder for logo and text verification
    return {
      logoScore: 0.85,
      textContent: "Sample medicine text"
    };
  };

  const validateBarcode = async (img) => {
    // Placeholder for barcode validation
    return {
      found: true,
      data: "8901234567890"
    };
  };

  return (
    <Container>
      <h2>Medicine Authentication</h2>
      <ImageUpload onClick={() => fileInputRef.current.click()}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
        {image ? (
          <img src={image.src} alt="Uploaded medicine" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        ) : (
          <p>Click to upload medicine image</p>
        )}
      </ImageUpload>

      {identifiedMedicine && (
        <MedicineInfo>
          <h3>Identified Medicine</h3>
          <p><strong>Name:</strong> {identifiedMedicine.name}</p>
          <p><strong>Manufacturer:</strong> {identifiedMedicine.manufacturer}</p>
          <p><strong>ID:</strong> {identifiedMedicine.id}</p>
        </MedicineInfo>
      )}

      <ResultsContainer>
        <ResultCard>
          <h3>Color Analysis</h3>
          {results.colorAnalysis && (
            <div>
              <p>Dominant Color: RGB({results.colorAnalysis.dominantColor.join(', ')})</p>
              {results.colorAnalysis.verification && (
                <>
                  <p>Color Match: {results.colorAnalysis.verification.match ? 'Authentic' : 'Suspicious'}</p>
                  <p>Confidence: {(results.colorAnalysis.verification.confidence * 100).toFixed(1)}%</p>
                </>
              )}
            </div>
          )}
        </ResultCard>

        <ResultCard>
          <h3>Texture Analysis</h3>
          {results.textureAnalysis && (
            <div>
              <p>Contrast: {results.textureAnalysis.contrast.toFixed(2)}</p>
              <p>Homogeneity: {results.textureAnalysis.homogeneity.toFixed(2)}</p>
              <p>Energy: {results.textureAnalysis.energy}</p>
              {results.textureAnalysis.verification && (
                <>
                  <p>Texture Match: {results.textureAnalysis.verification.match ? 'Authentic' : 'Suspicious'}</p>
                  <p>Confidence: {(results.textureAnalysis.verification.confidence * 100).toFixed(1)}%</p>
                </>
              )}
            </div>
          )}
        </ResultCard>

        <ResultCard>
          <h3>Logo & Text Verification</h3>
          {results.logoVerification && (
            <div>
              <p>Logo Authenticity Score: {results.logoVerification.score * 100}%</p>
              <p>Detected Text: {results.textVerification}</p>
              {results.logoVerification.verification && (
                <>
                  <p>Text Match: {results.logoVerification.verification.match ? 'Authentic' : 'Suspicious'}</p>
                  <p>Confidence: {(results.logoVerification.verification.confidence * 100).toFixed(1)}%</p>
                </>
              )}
            </div>
          )}
        </ResultCard>

        <ResultCard>
          <h3>Barcode/QR Validation</h3>
          {results.barcodeValidation && (
            <div>
              <p>Barcode Found: {results.barcodeValidation.found ? 'Yes' : 'No'}</p>
              {results.barcodeValidation.data && (
                <p>Data: {results.barcodeValidation.data}</p>
              )}
              {results.barcodeValidation.verified && (
                <p>Status: Verified in Database</p>
              )}
            </div>
          )}
        </ResultCard>
      </ResultsContainer>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Container>
  );
};

export default MedicineAuthentication; 