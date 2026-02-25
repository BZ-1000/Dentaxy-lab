import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DentaxyPresentation from './DentaxyPresentation';

test('Slide transition test', () => {
  const { container } = render(<DentaxyPresentation />);
  console.log("Rendered Slide 0");
  const nextBtn = container.querySelector('button[style*="right: 12px"]');
  if (nextBtn) {
    fireEvent.click(nextBtn);
    console.log("Rendered Slide 1");
  } else {
    console.log("No next button found");
  }
});
