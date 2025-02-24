
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>
        
        <div className="space-y-6 text-white/80">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Información que recopilamos</h2>
            <p>
              Recopilamos información que nos proporcionas directamente cuando:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Te registras para usar nuestros servicios</li>
              <li>Creas o modificas tu cuenta</li>
              <li>Interactúas con nuestras características y funcionalidades</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Cómo usamos tu información</h2>
            <p>
              Utilizamos la información recopilada para:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Proporcionar y mantener nuestros servicios</li>
              <li>Mejorar y personalizar tu experiencia</li>
              <li>Comunicarnos contigo sobre actualizaciones o cambios</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Seguridad</h2>
            <p>
              Nos tomamos muy en serio la seguridad de tus datos y empleamos medidas técnicas y organizativas apropiadas para proteger tu información.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Contacto</h2>
            <p>
              Si tienes preguntas sobre esta Política de Privacidad, por favor contáctanos.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
