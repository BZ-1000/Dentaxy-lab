const data = [
  {
    title: 'Inicio',
    icon: (
      <HomeIcon className='h-full w-full text-neutral-600 dark:text-neutral-300' />
    ),
    href: '/',
  },
  // Cambios en el botón de Medicamentos
  {
    title: 'Medicamentos',
    icon: (
      <PillBottle className='h-full w-full text-white' /> // Cambiar el color del icono a blanco
    ),
    href: '#',
  },
  {
    title: 'Historial',
    icon: (
      <ScrollText className='h-full w-full text-neutral-600 dark:text-neutral-300' />
    ),
    href: '#',
  },
  {
    title: 'Comentarios',
    icon: (
      <Mail className='h-full w-full text-red-500 dark:text-red-400' />
    ),
    href: '#',
  },
];

export function AppleStyleDock() {
  // ... (código existente)

  return (
    <>
      <div className='fixed bottom-2 left-1/2 max-w-full -translate-x-1/2 z-50'>
        <Dock className={cn('items-end pb-3 flex', isVisible ? 'w-auto' : 'w-fit')}>
          {data.map((item, idx) => (
            <DockItem
              key={idx}
              onClick={() => handleItemClick(item.title)}
              className={`aspect-square rounded-full cursor-pointer ${
                item.title === 'Medicamentos' ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-neutral-800'
              }`} // Cambiar el fondo del botón a verde esmeralda
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>{item.icon}</DockIcon>
            </DockItem>
          ))}
          <DockItem
            onClick={toggleTheme}
            className='aspect-square rounded-full bg-gray-200 dark:bg-neutral-800 cursor-pointer'
          >
            <DockLabel>{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</DockLabel>
            <DockIcon>
              <SunMoon className='h-full w-full text-neutral-600 dark:text-neutral-300' />
            </DockIcon>
          </DockItem>
          {/* Botón de reset con icono de basura */}
          <DockItem
            onClick={handleResetForm}
            className='aspect-square rounded-full bg-red-500 hover:bg-red-600 cursor-pointer'
          >
            <DockLabel>Limpiar Formulario</DockLabel>
            <DockIcon>
              <Trash className='h-full w-full text-white' />
            </DockIcon>
          </DockItem>
          {/* Botón ScrollToName */}
          {isVisible && (
            <DockItem
              onClick={scrollToName}
              className='aspect-square rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg cursor-pointer slide-in'
            >
              <DockLabel>Scroll to Name</DockLabel>
              <DockIcon>
                <Save className='h-full w-full' />
              </DockIcon>
            </DockItem>
          )}
        </Dock>
      </div>

      {/* Include our new Medication Search modal */}
      <MedicationSearch
        open={showMedicationSearch}
        onOpenChange={setShowMedicationSearch}
      />

      {/* ... (resto del código) */}
    </>
  );
}
