
// Fix property access with optional chaining and correct property names
// For example:

// Original problematic code:
setFormData(prev => ({
  ...prev,
  padecimientoActual: {
    ...prev.padecimientoActual,
    [field]: value
  }
}));

// Fixed code:
setFormData(prev => ({
  ...prev,
  padecimientoActual: {
    ...(prev.padecimientoActual || {}),
    [field]: value
  }
}));

// Also fix 'antecedentesHeredoFamiliares' to 'antecedentesHeredofamiliares'
// Original problematic code:
setFormData(prev => ({
  ...prev,
  antecedentesHeredoFamiliares: {
    ...prev.antecedentesHeredoFamiliares,
    [familiar]: {
      ...prev.antecedentesHeredoFamiliares[familiar],
      [field]: value
    }
  }
}));

// Fixed code:
setFormData(prev => ({
  ...prev,
  antecedentesHeredoFamiliares: {
    ...(prev.antecedentesHeredoFamiliares || {}),
    [familiar]: {
      ...(prev.antecedentesHeredoFamiliares?.[familiar] || {}),
      [field]: value
    }
  }
}));

// Fix toggleService to handle servicios property correctly
const toggleService = (service: string) => {
  setFormData(prev => {
    const currentServices = [...(prev.antecedentesPersonalesNoPatologicos?.servicios || [])];
    
    if (service === 'todos') {
      const allServices = ['agua', 'luz', 'drenaje', 'transporte', 'internet', 'gas'];
      const hasAllServices = allServices.every(s => currentServices.includes(s));
      
      return {
        ...prev,
        antecedentesPersonalesNoPatologicos: {
          ...prev.antecedentesPersonalesNoPatologicos,
          servicios: hasAllServices ? [] : allServices
        }
      };
    }
    
    const updatedServices = currentServices.includes(service)
      ? currentServices.filter(s => s !== service)
      : [...currentServices, service];
      
    return {
      ...prev,
      antecedentesPersonalesNoPatologicos: {
        ...prev.antecedentesPersonalesNoPatologicos,
        servicios: updatedServices
      }
    };
  });
};
