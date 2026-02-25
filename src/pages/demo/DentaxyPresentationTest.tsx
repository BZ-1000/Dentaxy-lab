import React from 'react';
import { render } from '@testing-library/react';
import DentaxyPresentation from './DentaxyPresentation';

// test file to check error
try {
  const { container } = render(<DentaxyPresentation />);
  console.log("Rendered Slide 0");
} catch(e) {
  console.error("Error Slide 0:", e);
}
