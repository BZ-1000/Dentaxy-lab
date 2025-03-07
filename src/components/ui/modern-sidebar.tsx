import React from "react";
import { useRouter } from "next/router";
import { SidebarLink } from "./SidebarLink";

const ModernSidebar = () => {
  const router = useRouter();
  const { pathname } = router;

  const links = [
    { href: "/historia-clinica", label: "Historia Clínica" },
    { href: "/antecedentes-personales", label: "Antecedentes Personales" },
    { href: "/examen-fisico", label: "Examen Físico" },
    { href: "/diagnostico", label: "Diagnóstico" },
    { href: "/pronostico", label: "Pronóstico" },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Menú</h2>
      <nav className="flex-1">
        {links.map((link) => (
          <SidebarLink key={link.href} href={link.href} isActive={pathname === link.href}>
            {link.label}
          </SidebarLink>
        ))}
      </nav>
    </div>
  );
};

const SidebarLink = ({ href, isActive, children }) => {
  return (
    <a
      href={href}
      className={`block p-2 rounded transition-colors ${
        isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-200"
      }`}
    >
      {children}
      {isActive ? (
        <span className="absolute left-2 w-1 h-6 bg-primary rounded-full" />
      ) : null}
    </a>
  );
};

export default ModernSidebar;
