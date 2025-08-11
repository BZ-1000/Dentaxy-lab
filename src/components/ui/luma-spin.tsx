import React from "react";

export const Component: React.FC = () => {
  return (
    <div className="relative w-[65px] h-[65px] mx-auto">
      <div 
        className="absolute inset-0 rounded-full border-[3px] border-gray-800 dark:border-gray-100"
        style={{
          animation: 'lumaSpinFirst 2s infinite ease-in-out'
        }}
      />
      <div 
        className="absolute inset-0 rounded-full border-[3px] border-gray-800 dark:border-gray-100"
        style={{
          animation: 'lumaSpinSecond 2s infinite ease-in-out',
          animationDelay: '-1s'
        }}
      />
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes lumaSpinFirst {
            0% { 
              top: 0px; 
              left: 35px; 
              width: 30px; 
              height: 30px; 
            }
            12.5% { 
              top: 0px; 
              left: 35px; 
              width: 30px; 
              height: 65px; 
            }
            25% { 
              top: 0px; 
              left: 0px; 
              width: 65px; 
              height: 65px; 
            }
            37.5% { 
              top: 0px; 
              left: 0px; 
              width: 65px; 
              height: 30px; 
            }
            50% { 
              top: 35px; 
              left: 0px; 
              width: 30px; 
              height: 30px; 
            }
            62.5% { 
              top: 35px; 
              left: 0px; 
              width: 30px; 
              height: 30px; 
            }
            75% { 
              top: 35px; 
              left: 35px; 
              width: 30px; 
              height: 30px; 
            }
            87.5% { 
              top: 0px; 
              left: 35px; 
              width: 30px; 
              height: 30px; 
            }
            100% { 
              top: 0px; 
              left: 35px; 
              width: 30px; 
              height: 30px; 
            }
          }
          
          @keyframes lumaSpinSecond {
            0% { 
              top: 0px; 
              left: 35px; 
              width: 30px; 
              height: 30px; 
            }
            12.5% { 
              top: 0px; 
              left: 35px; 
              width: 30px; 
              height: 65px; 
            }
            25% { 
              top: 0px; 
              left: 0px; 
              width: 65px; 
              height: 65px; 
            }
            37.5% { 
              top: 0px; 
              left: 0px; 
              width: 65px; 
              height: 30px; 
            }
            50% { 
              top: 35px; 
              left: 0px; 
              width: 30px; 
              height: 30px; 
            }
            62.5% { 
              top: 35px; 
              left: 0px; 
              width: 30px; 
              height: 30px; 
            }
            75% { 
              top: 35px; 
              left: 35px; 
              width: 30px; 
              height: 30px; 
            }
            87.5% { 
              top: 0px; 
              left: 35px; 
              width: 30px; 
              height: 30px; 
            }
            100% { 
              top: 0px; 
              left: 35px; 
              width: 30px; 
              height: 30px; 
            }
          }
        `
      }} />
    </div>
  );
};

export default Component;
