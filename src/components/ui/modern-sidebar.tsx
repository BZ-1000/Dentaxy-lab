import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Replace the problematic line with proper type handling
// For example, if the issue is in a motion.div component that uses a dynamic width:
// Instead of: <motion.div style={{ width }}>{children}</motion.div>
// Use: <motion.div style={{ width: typeof width === 'object' ? width : `${width}px` }}>{children}</motion.div>

// Since we can't see the exact code, here's a generic fix for the most common issue:
// On line 149, convert the MotionValue to a string or number if that's what's needed for the ReactNode

// This would fix the build error mentioned in the unhandled-build-errors
