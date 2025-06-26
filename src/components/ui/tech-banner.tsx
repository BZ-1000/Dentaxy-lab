
import { Marquee } from "./marquee";

const TechIcons = () => {
  const icons = [
    {
      name: "Todo List",
      src: "/lovable-uploads/e8d8ac6c-7648-4a38-b15a-d6470c9f09a7.png",
      alt: "Task Management"
    },
    {
      name: "Gmail",
      src: "/lovable-uploads/104ede46-15f3-4b38-81a8-fffb97199f2e.png",
      alt: "Email Integration"
    },
    {
      name: "AI Assistant",
      src: "/lovable-uploads/ef8b2c7f-7b50-4455-b253-cd8b3523518b.png",
      alt: "Artificial Intelligence"
    },
    {
      name: "JavaScript",
      src: "/lovable-uploads/688aaa11-080e-4ce1-ad03-970733b79d54.png",
      alt: "JavaScript"
    },
    {
      name: "HTML5",
      src: "/lovable-uploads/653a2835-38e0-465b-b288-e07e2141701c.png",
      alt: "HTML5"
    },
    {
      name: "TypeScript",
      src: "/lovable-uploads/a2b8f3d5-a650-4154-ab5b-6f940d4556b1.png",
      alt: "TypeScript"
    },
    {
      name: "Visual Studio",
      src: "/lovable-uploads/bce5010e-fad1-4148-a895-a1ebb1bd74aa.png",
      alt: "Visual Studio Code"
    },
    {
      name: "Dental Care",
      src: "/lovable-uploads/502dc4c5-337e-4bbe-a9cc-d3b85de7da2b.png",
      alt: "Dental Technology"
    }
  ];

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 via-white to-purple-50 border-b border-gray-100">
      <Marquee speed={40} className="py-2">
        {icons.map((icon, index) => (
          <div
            key={index}
            className="flex items-center justify-center mx-8 opacity-70 hover:opacity-100 transition-opacity duration-300"
          >
            <img 
              src={icon.src} 
              alt={icon.alt}
              className="h-8 w-8 object-contain filter hover:scale-110 transition-transform duration-300"
              title={icon.name}
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default TechIcons;
