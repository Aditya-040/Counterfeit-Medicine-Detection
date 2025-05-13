const medicineDataset = {
  medicines: [
    {
      id: "PARA001",
      name: "Paracetamol 500mg",
      manufacturer: "ABC Pharma",
      characteristics: {
        color: {
          dominant: [255, 255, 255], // White
          tolerance: 20,
          secondary: [0, 0, 0] // Black text
        },
        texture: {
          contrast: 0.7,
          homogeneity: 0.8,
          energy: 0.85
        },
        packaging: {
          logo: "ABC Pharma",
          text: "Paracetamol 500mg Tablets",
          barcode: "8901234567890"
        },
        image: "/assets/medicines/paracetamol.png"
      }
    },
    {
      id: "AMOX001",
      name: "Amoxicillin 250mg",
      manufacturer: "XYZ Pharma",
      characteristics: {
        color: {
          dominant: [255, 255, 0], // Yellow
          tolerance: 15,
          secondary: [0, 0, 0] // Black text
        },
        texture: {
          contrast: 0.75,
          homogeneity: 0.82,
          energy: 0.88
        },
        packaging: {
          logo: "XYZ Pharma",
          text: "Amoxicillin 250mg Capsules",
          barcode: "8901234567891"
        },
        image: "/assets/medicines/amoxicillin.png"
      }
    },
    {
      id: "CIPRO001",
      name: "Ciprofloxacin 500mg",
      manufacturer: "MediCorp",
      characteristics: {
        color: {
          dominant: [255, 200, 200], // Light pink
          tolerance: 15,
          secondary: [0, 0, 0] // Black text
        },
        texture: {
          contrast: 0.72,
          homogeneity: 0.78,
          energy: 0.86
        },
        packaging: {
          logo: "MediCorp",
          text: "Ciprofloxacin 500mg Tablets",
          barcode: "8901234567892"
        },
        image: "/assets/medicines/ciprofloxacin.png"
      }
    }
  ],

  // Helper functions for verification
  verifyColor: (inputColor, referenceColor, tolerance) => {
    const [r1, g1, b1] = inputColor;
    const [r2, g2, b2] = referenceColor;
    
    const diff = Math.sqrt(
      Math.pow(r1 - r2, 2) +
      Math.pow(g1 - g2, 2) +
      Math.pow(b1 - b2, 2)
    );
    
    return {
      match: diff <= tolerance,
      confidence: Math.max(0, 1 - (diff / (tolerance * 2))),
      difference: diff
    };
  },

  verifyTexture: (inputTexture, referenceTexture) => {
    const contrastDiff = Math.abs(inputTexture.contrast - referenceTexture.contrast);
    const homogeneityDiff = Math.abs(inputTexture.homogeneity - referenceTexture.homogeneity);
    const energyDiff = Math.abs(inputTexture.energy - referenceTexture.energy);
    
    const avgDiff = (contrastDiff + homogeneityDiff + energyDiff) / 3;
    
    return {
      match: avgDiff <= 0.2,
      confidence: Math.max(0, 1 - (avgDiff * 2)),
      differences: {
        contrast: contrastDiff,
        homogeneity: homogeneityDiff,
        energy: energyDiff
      }
    };
  },

  verifyText: (inputText, referenceText) => {
    const similarity = calculateTextSimilarity(inputText, referenceText);
    return {
      match: similarity >= 0.8,
      confidence: similarity,
      similarity: similarity
    };
  },

  findMedicineByBarcode: (barcode) => {
    return medicineDataset.medicines.find(med => 
      med.characteristics.packaging.barcode === barcode
    );
  }
};

// Helper function to calculate text similarity
function calculateTextSimilarity(str1, str2) {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.9;
  
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  
  const commonWords = words1.filter(word => words2.includes(word));
  return commonWords.length / Math.max(words1.length, words2.length);
}

export default medicineDataset; 