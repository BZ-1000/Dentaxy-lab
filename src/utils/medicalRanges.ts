// IMC ranges according to WHO
export const imcRanges = {
  underweight: { min: 0, max: 18.5, label: 'Bajo peso', color: 'text-blue-500' },
  normal: { min: 18.5, max: 25, label: 'Normal', color: 'text-green-500' },
  overweight: { min: 25, max: 30, label: 'Sobrepeso', color: 'text-yellow-500' },
  obese: { min: 30, max: Infinity, label: 'Obesidad', color: 'text-red-500' }
};

// Blood pressure ranges
export const bpRanges = {
  low: { systolic: { max: 90 }, diastolic: { max: 60 }, label: 'Baja', color: 'text-blue-500' },
  normal: { systolic: { min: 90, max: 120 }, diastolic: { min: 60, max: 80 }, label: 'Normal', color: 'text-green-500' },
  high: { systolic: { min: 120 }, diastolic: { min: 80 }, label: 'Alta', color: 'text-red-500' }
};

// Age ranges for vital signs
export const vitalSignRanges = {
  child: {
    label: 'Niño (2-12 años)',
    pulse: { min: 60, max: 120 },
    heartRate: { min: 60, max: 120 },
    temperature: { min: 36.5, max: 37.5 }
  },
  teen: {
    label: 'Adolescente (13-18 años)',
    pulse: { min: 60, max: 100 },
    heartRate: { min: 60, max: 100 },
    temperature: { min: 36.5, max: 37.5 }
  },
  adult: {
    label: 'Adulto (19-65 años)',
    pulse: { min: 60, max: 100 },
    heartRate: { min: 60, max: 100 },
    temperature: { min: 36.5, max: 37.5 }
  },
  elder: {
    label: 'Adulto mayor (>65 años)',
    pulse: { min: 60, max: 90 },
    heartRate: { min: 60, max: 90 },
    temperature: { min: 36.5, max: 37.5 }
  }
};

// Helper functions
export const calculateIMC = (weight: number, height: number): number => {
  if (!weight || !height) return 0;
  return Number((weight / (height * height)).toFixed(2));
};

export const getIMCCategory = (imc: number) => {
  if (imc < imcRanges.underweight.max) return imcRanges.underweight;
  if (imc < imcRanges.normal.max) return imcRanges.normal;
  if (imc < imcRanges.overweight.max) return imcRanges.overweight;
  return imcRanges.obese;
};

export const getBPCategory = (systolic: number, diastolic: number) => {
  if (systolic < bpRanges.normal.systolic.min || diastolic < bpRanges.normal.diastolic.min) {
    return bpRanges.low;
  }
  if (systolic >= bpRanges.normal.systolic.min && systolic <= bpRanges.normal.systolic.max &&
      diastolic >= bpRanges.normal.diastolic.min && diastolic <= bpRanges.normal.diastolic.max) {
    return bpRanges.normal;
  }
  return bpRanges.high;
};
