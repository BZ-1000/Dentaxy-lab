
import { motion } from 'framer-motion';

const TermsOfService = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8">Términos de Servicio</h1>
        
        <div className="space-y-6 text-white/80">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Aceptación de los términos</h2>
            <p>
              Al acceder y utilizar este servicio, aceptas estar sujeto a estos términos de servicio, todas las leyes y regulaciones aplicables.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Uso del servicio</h2>
            <p>
              Te comprometes a no utilizar el servicio para ningún propósito ilegal o prohibido por estos términos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Cuentas</h2>
            <p>
              Cuando creas una cuenta con nosotros, debes proporcionar información precisa, completa y actualizada en todo momento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Modificaciones del servicio</h2>
            <p>
              Nos reservamos el derecho de modificar o discontinuar, temporal o permanentemente, el servicio con o sin previo aviso.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Contacto</h2>
            <p>
              Si tienes preguntas sobre estos Términos de Servicio, por favor contáctanos.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsOfService;
