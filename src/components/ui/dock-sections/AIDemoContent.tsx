import { useState } from 'react';
import { Brain, Mic, Send, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

// Demo messages data
const demoMessages = [
  {
    id: 1,
    type: 'user',
    content: 'Paciente masculino de 45 años con dolor en molar superior derecho',
    timestamp: '14:23',
    suggestions: ['Caries', 'Pulpitis', 'Absceso']
  },
  {
    id: 2,
    type: 'ai',
    content: 'He generado una historia clínica completa basada en los síntomas. Incluye anamnesis, examen clínico y diagnóstico diferencial. ¿Te gustaría que añada algún detalle específico?',
    timestamp: '14:23',
    suggestions: []
  }
];

export const AIDemoContent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showDemo, setShowDemo] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  const handleStartDemo = () => {
    setShowDemo(true);
    setDemoStep(0);
    
    // Simulate demo progression
    setTimeout(() => setDemoStep(1), 1000);
    setTimeout(() => setDemoStep(2), 3000);
  };

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Demo de IA Dental</h2>
        <p className="text-muted-foreground">
          Experimenta el poder de la inteligencia artificial especializada en odontología
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - AI Capabilities & Demo Control */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          {/* AI Capabilities */}
          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-lg font-semibold mb-4">Capacidades de la IA</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Generación automática de historias clínicas</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Diagnóstico diferencial inteligente</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Planes de tratamiento personalizados</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Terminología médica especializada</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Control */}
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-0 text-center">
              <h3 className="text-lg font-semibold mb-4">Prueba la Demo</h3>
              <Button
                onClick={handleStartDemo}
                className="w-full mb-4"
                size="lg"
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar Demo Interactiva
              </Button>
              <p className="text-sm text-muted-foreground">
                Observa cómo la IA procesa información clínica en tiempo real
              </p>
            </CardContent>
          </Card>

          {/* AI Performance Metrics */}
          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-lg font-semibold mb-4">Rendimiento de IA</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">97%</div>
                  <div className="text-xs text-muted-foreground">Precisión</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">2.3s</div>
                  <div className="text-xs text-muted-foreground">Respuesta</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">15k+</div>
                  <div className="text-xs text-muted-foreground">Términos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-xs text-muted-foreground">Disponible</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Panel - Chat Interface */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Dentaxy AI</div>
                  <div className="text-xs text-green-600 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    En línea
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <AnimatePresence>
                {showDemo && demoStep >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4"
                  >
                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2 max-w-xs">
                        <p className="text-sm">{demoMessages[0].content}</p>
                        <div className="text-xs opacity-70 mt-1">{demoMessages[0].timestamp}</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {showDemo && demoStep >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-4"
                  >
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-3 py-2 max-w-xs">
                        <p className="text-sm">{demoMessages[1].content}</p>
                        <div className="text-xs text-muted-foreground mt-1">{demoMessages[1].timestamp}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!showDemo && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Inicia la demo para ver la IA en acción</p>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Describe los síntomas del paciente..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRecording(!isRecording)}
                  className={isRecording ? 'bg-red-500 text-white' : ''}
                >
                  <Mic className="w-4 h-4" />
                </Button>
                <Button size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};