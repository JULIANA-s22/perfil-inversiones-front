import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatbotService, type MensajeDto } from '../services/api';
import './Valora.css';

const Valora = () => {
  const { userId } = useAuth();
  const [conversacionActiva, setConversacionActiva] = useState<number | null>(null);
  const [mensajes, setMensajes] = useState<MensajeDto[]>([]);
  const [input, setInput] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [modo, setModo] = useState<'chat' | 'cuestionario'>('chat');
  const mensajesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversacionActiva) return;
    chatbotService.obtenerMensajes(conversacionActiva).then(setMensajes).catch(() => {});
  }, [conversacionActiva]);

  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  }, [mensajes]);

  const nuevaConversacion = async (tipo: 'chat' | 'cuestionario') => {
    if (!userId) return;
    try {
      const conv = tipo === 'chat'
        ? await chatbotService.iniciarChat(userId)
        : await chatbotService.iniciarCuestionario(userId);
      setConversacionActiva(conv.id);
      setMensajes([]);
      setModo(tipo);

      if (tipo === 'cuestionario') {
        const msgs = await chatbotService.obtenerMensajes(conv.id);
        setMensajes(msgs);
      }
    } catch {
    }
  };

  const enviarMensaje = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !conversacionActiva || enviando) return;

    const texto = input.trim();
    setInput('');
    setEnviando(true);

    const msgUsuario: MensajeDto = {
      id: Date.now(),
      conversacionId: conversacionActiva,
      rol: 'USUARIO',
      contenido: texto,
      enviadoEn: new Date().toISOString(),
    };
    setMensajes(prev => [...prev, msgUsuario]);

    try {
      const respuesta = modo === 'cuestionario'
        ? await chatbotService.responderCuestionario(conversacionActiva, texto)
        : await chatbotService.enviarMensaje(conversacionActiva, texto);
      setMensajes(prev => [...prev, respuesta]);
    } catch {
      setMensajes(prev => [...prev, {
        id: Date.now() + 1,
        conversacionId: conversacionActiva,
        rol: 'ASISTENTE',
        contenido: 'Error al procesar tu mensaje. Intentá de nuevo.',
        enviadoEn: new Date().toISOString(),
      }]);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="valora-container">
      <div className="valora-sidebar">
        <div className="valora-sidebar-header">
          <h3>Conversaciones</h3>
        </div>
        <div className="valora-new-btns">
          <button className="btn-new-chat" onClick={() => nuevaConversacion('chat')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Chat libre
          </button>
          <button className="btn-new-quiz" onClick={() => nuevaConversacion('cuestionario')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            Cuestionario
          </button>
        </div>
      </div>

      <div className="valora-chat">
        {!conversacionActiva ? (
          <div className="chat-welcome">
            <div className="welcome-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" /><path d="M12 8h.01" />
                <path d="M8 12a4 4 0 0 1 8 0" />
              </svg>
            </div>
            <h2>Asistente Valora</h2>
            <p>Tu asesor experto en pensiones voluntarias en Colombia.</p>
            <div className="welcome-options">
              <button onClick={() => nuevaConversacion('chat')}>
                Iniciar chat libre
              </button>
              <button onClick={() => nuevaConversacion('cuestionario')}>
                Descubrir mi perfil de riesgo
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="chat-messages" ref={mensajesRef}>
              {mensajes.map(msg => (
                <div key={msg.id} className={`msg ${msg.rol === 'USUARIO' ? 'msg-user' : 'msg-bot'}`}>
                  {msg.rol === 'ASISTENTE' && (
                    <div className="msg-avatar">V</div>
                  )}
                  <div className="msg-bubble">
                    <p>{msg.contenido}</p>
                  </div>
                </div>
              ))}
              {enviando && (
                <div className="msg msg-bot">
                  <div className="msg-avatar">V</div>
                  <div className="msg-bubble msg-typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
            </div>

            <form className="chat-input" onSubmit={enviarMensaje}>
              <input
                type="text"
                placeholder="Escribí tu mensaje..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={enviando}
              />
              <button type="submit" disabled={enviando || !input.trim()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Valora;
