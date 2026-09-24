import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  sendChatMessage, 
  fetchUserConversations, 
  createConversation, 
  fetchConversationMessages, 
  renameConversation, 
  deleteConversation, 
  uploadChatAttachment 
} from '../api/api';
import { 
  Bot, Send, X, Globe, Sparkles, Copy, Check, RefreshCw, Trash2, RotateCcw, 
  MessageSquare, Mic, MicOff, Volume2, VolumeX, Plus, Paperclip, Square, Edit3, 
  MapPin, Compass, ShieldAlert, UserCheck, Calendar, ChevronLeft, Menu, FileText, Image as ImageIcon
} from 'lucide-react';

const worldLanguages = [
  { id: 'Auto-Detect', code: 'auto', label: '🌐 Auto-Detect Language' },
  { id: 'English', code: 'en', label: 'English — en' },
  { id: 'Telugu', code: 'te', label: 'తెలుగు — te' },
  { id: 'Hindi', code: 'hi', label: 'हिन्दी — hi' },
  { id: 'Tamil', code: 'ta', label: 'தமிழ் — ta' },
  { id: 'Kannada', code: 'kn', label: 'ಕನ್ನಡ — kn' },
  { id: 'Malayalam', code: 'ml', label: 'മലയാളം — ml' },
  { id: 'Bengali', code: 'bn', label: 'বাংলা — bn' },
  { id: 'Marathi', code: 'mr', label: 'మરાਠੀ — mr' },
  { id: 'Gujarati', code: 'gu', label: 'ગુજરાતી — gu' },
  { id: 'Punjabi', code: 'pa', label: 'ਪੰਜਾਬੀ — pa' },
  { id: 'Urdu', code: 'ur', label: 'اردو — ur' },
  { id: 'Odia', code: 'or', label: 'ଓଡ଼ିଆ — or' },
  { id: 'Assamese', code: 'as', label: 'অসমীয়া — as' },
  { id: 'Sanskrit', code: 'sa', label: 'संस्कृतम् — sa' },
  { id: 'Japanese', code: 'ja', label: '日本語 — ja' },
  { id: 'Chinese', code: 'zh', label: '中文 — zh' },
  { id: 'Korean', code: 'ko', label: '한국어 — ko' },
  { id: 'French', code: 'fr', label: 'Français — fr' },
  { id: 'German', code: 'de', label: 'Deutsch — de' },
  { id: 'Spanish', code: 'es', label: 'Español — es' },
  { id: 'Portuguese', code: 'pt', label: 'Português — pt' },
  { id: 'Italian', code: 'it', label: 'Italiano — it' },
  { id: 'Russian', code: 'ru', label: 'Русский — ru' },
  { id: 'Arabic', code: 'ar', label: 'العربية — ar' },
  { id: 'Turkish', code: 'tr', label: 'Türkçe — tr' },
  { id: 'Indonesian', code: 'id', label: 'Bahasa Indonesia — id' },
  { id: 'Vietnamese', code: 'vi', label: 'Tiếng Việt — vi' },
  { id: 'Thai', code: 'th', label: 'ไทย — th' },
  { id: 'Dutch', code: 'nl', label: 'Nederlands — nl' },
  { id: 'Greek', code: 'el', label: 'Ελληνικά — el' },
  { id: 'Hebrew', code: 'he', label: 'עברית — he' },
  { id: 'Persian', code: 'fa', label: 'فارسی — fa' },
  { id: 'Swahili', code: 'sw', label: 'Kiswahili — sw' },
  { id: 'Custom', code: 'custom', label: '✏️ Type Custom Language...' }
];

const generalPresetQueries = [
  "Plan a 3-day budget trip to Goa",
  "Top famous places to visit in Jaipur",
  "Sacred temples in Tirupati & Varanasi",
  "Best local street food in Lucknow & Delhi",
  "How to book a certified local tour guide?",
  "Discuss local culture & heritage insights"
];

// Helper to render Markdown-like text (code blocks, bold, lists, tables) with Copy Code button
function FormattedMarkdown({ text }) {
  const [copiedCodeIdx, setCopiedCodeIdx] = useState(null);

  if (!text) return null;

  const handleCopyCode = (codeContent, idx) => {
    navigator.clipboard.writeText(codeContent);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2">
      {parts.map((part, pIdx) => {
        if (part.startsWith('```')) {
          const match = part.match(/^```(\w+)?\n?([\s\S]*?)```$/);
          const lang = match ? match[1] || 'code' : 'code';
          const codeContent = match ? match[2] : part.slice(3, -3);

          return (
            <div key={pIdx} className="my-2.5 rounded-xl bg-slate-950 text-slate-100 border border-slate-800 overflow-hidden shadow-md">
              <div className="flex justify-between items-center bg-slate-900 px-3 py-1.5 text-[11px] text-slate-400 font-mono font-bold border-b border-slate-800">
                <span className="uppercase tracking-wider">{lang}</span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(codeContent, pIdx)}
                  className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 font-sans font-bold bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded transition"
                >
                  {copiedCodeIdx === pIdx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedCodeIdx === pIdx ? 'Copied Code!' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-3 text-xs font-mono whitespace-pre-wrap overflow-x-auto leading-relaxed">{codeContent.trim()}</pre>
            </div>
          );
        }

        const lines = part.split('\n');
        return (
          <div key={pIdx} className="space-y-1">
            {lines.map((line, lIdx) => {
              if (!line.trim()) return <div key={lIdx} className="h-1" />;

              if (line.startsWith('### ')) {
                return <h4 key={lIdx} className="font-extrabold text-sm sm:text-base text-slate-900 mt-2 mb-1">{line.replace('### ', '')}</h4>;
              }
              if (line.startsWith('#### ')) {
                return <h5 key={lIdx} className="font-bold text-xs sm:text-sm text-slate-800 mt-1 mb-1">{line.replace('#### ', '')}</h5>;
              }
              if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                const content = line.trim().substring(2);
                return (
                  <div key={lIdx} className="flex items-start gap-2 text-xs sm:text-sm pl-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>{parseInlineBold(content)}</span>
                  </div>
                );
              }
              if (line.trim().startsWith('> ')) {
                return (
                  <blockquote key={lIdx} className="border-l-4 border-amber-500 bg-amber-50/60 p-2 text-xs sm:text-sm italic text-slate-800 rounded-r-lg my-1">
                    {parseInlineBold(line.trim().substring(2))}
                  </blockquote>
                );
              }

              return <p key={lIdx} className="text-xs sm:text-sm leading-relaxed">{parseInlineBold(line)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

function parseInlineBold(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-extrabold text-slate-950">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function Chatbot({ destination = 'Goa' }) {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Auto-Detect');
  const [customLangText, setCustomLangText] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Conversations State
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [editingConvTitleId, setEditingConvTitleId] = useState(null);
  const [tempTitleText, setTempTitleText] = useState('');

  const activeLang = selectedLanguage === 'Custom' ? (customLangText || 'Custom Language') : selectedLanguage;

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Namaste! Welcome to **Digital Yatra AI**. 🤖✨\n\nI am your **AI Companion, Mentor & Travel Guide**! Ask me about **destinations, historical stories, local heritage, authentic street food, itineraries, certified local guides, or travel safety across India**.\n\nHow can I assist your journey today?`,
      suggestions: ["Plan 3-day trip to Goa", "Top places in Jaipur", "Find local tour guide", "Culture & heritage stories"]
    }
  ]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const res = await fetchUserConversations(1);
      if (res.success && res.conversations) {
        setConversations(res.conversations);
      }
    } catch (e) {
      console.warn("Could not load conversations:", e);
    }
  };

  const handleSelectConversation = async (convId) => {
    try {
      setActiveConvId(convId);
      setShowDrawer(false);
      setLoading(true);
      const res = await fetchConversationMessages(convId);
      if (res.success && res.messages) {
        const formatted = res.messages.map(m => ({
          id: m.id,
          sender: m.role === 'user' ? 'user' : 'bot',
          text: m.content,
          attachments: m.attachments || []
        }));
        setMessages(formatted.length > 0 ? formatted : [{
          sender: 'bot',
          text: `Conversation loaded! How can I continue assisting you?`,
          suggestions: ["Explain further", "Give code example", "Plan a trip"]
        }]);
      }
    } catch (e) {
      console.error("Failed to load conversation:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewChat = async () => {
    try {
      setLoading(true);
      const res = await createConversation({ user_id: 1, title: 'New Chat' });
      if (res.success && res.conversation) {
        setActiveConvId(res.conversation.id);
        setMessages([
          {
            sender: 'bot',
            text: `New chat started! I am your **Digital Yatra AI Companion**. Ask me any question or discuss any topic!`,
            suggestions: ["What is Machine Learning?", "Explain Newton's laws", "Plan 3-day trip to Goa"]
          }
        ]);
        loadConversations();
        setShowDrawer(false);
      }
    } catch (e) {
      console.error("Failed to create new chat:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleRenameConv = async (convId) => {
    if (!tempTitleText.trim()) return;
    try {
      await renameConversation(convId, tempTitleText.trim());
      setEditingConvTitleId(null);
      loadConversations();
    } catch (e) {
      console.error("Failed to rename:", e);
    }
  };

  const handleDeleteConv = async (convId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this chat conversation?")) return;
    try {
      await deleteConversation(convId);
      if (activeConvId === convId) {
        setActiveConvId(null);
        setMessages([
          {
            sender: 'bot',
            text: `Welcome! Start a new chat or select a previous conversation from the drawer.`,
            suggestions: ["What is Machine Learning?", "Explain Python loops", "Plan Goa trip"]
          }
        ]);
      }
      loadConversations();
    } catch (e) {
      console.error("Failed to delete conversation:", e);
    }
  };

  // Auto-request live location if location-based queries are asked
  const getLiveLocation = () => {
    return new Promise((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setUserLocation(coords);
            resolve(coords);
          },
          (err) => {
            console.warn("Geolocation denied or unavailable:", err.message);
            resolve(null);
          },
          { timeout: 5000 }
        );
      } else {
        resolve(null);
      }
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Text-to-Speech Language Resolver
  const detectTTSSpeechLang = (text, selectedLang) => {
    const t = text.toLowerCase();

    if (t.includes('in **hindi**') || t.includes('in hindi') || /[\u0900-\u097F]/.test(text)) return 'hi-IN';
    if (t.includes('in **telugu**') || t.includes('in telugu') || /[\u0C00-\u0C7F]/.test(text)) return 'te-IN';
    if (t.includes('in **tamil**') || t.includes('in tamil') || /[\u0B80-\u0BFF]/.test(text)) return 'ta-IN';
    if (t.includes('in **kannada**') || t.includes('in kannada') || /[\u0C80-\u0CFF]/.test(text)) return 'kn-IN';
    if (t.includes('in **malayalam**') || t.includes('in malayalam') || /[\u0D00-\u0D7F]/.test(text)) return 'ml-IN';
    if (t.includes('in **bengali**') || t.includes('in bengali') || /[\u0980-\u09FF]/.test(text)) return 'bn-IN';
    if (t.includes('in **marathi**') || t.includes('in marathi')) return 'mr-IN';
    if (t.includes('in **gujarati**') || t.includes('in gujarati') || /[\u0A80-\u0AFF]/.test(text)) return 'gu-IN';
    if (t.includes('in **punjabi**') || t.includes('in punjabi') || /[\u0A00-\u0A7F]/.test(text)) return 'pa-IN';
    if (t.includes('in **urdu**') || t.includes('in urdu')) return 'ur-PK';

    if (t.includes('in **japanese**') || t.includes('in japanese') || /[\u3040-\u30FF\u4E00-\u9FAF]/.test(text)) return 'ja-JP';
    if (t.includes('in **chinese**') || t.includes('in chinese')) return 'zh-CN';
    if (t.includes('in **korean**') || t.includes('in korean') || /[\uAC00-\uD7AF]/.test(text)) return 'ko-KR';
    if (t.includes('in **french**') || t.includes('in french')) return 'fr-FR';
    if (t.includes('in **german**') || t.includes('in german')) return 'de-DE';
    if (t.includes('in **spanish**') || t.includes('in spanish')) return 'es-ES';
    if (t.includes('in **portuguese**') || t.includes('in portuguese')) return 'pt-BR';
    if (t.includes('in **italian**') || t.includes('in italian')) return 'it-IT';
    if (t.includes('in **russian**') || t.includes('in russian') || /[\u0400-\u04FF]/.test(text)) return 'ru-RU';
    if (t.includes('in **arabic**') || t.includes('in arabic') || /[\u0600-\u06FF]/.test(text)) return 'ar-SA';
    if (t.includes('in **turkish**') || t.includes('in turkish')) return 'tr-TR';
    if (t.includes('in **indonesian**') || t.includes('in indonesian')) return 'id-ID';
    if (t.includes('in **vietnamese**') || t.includes('in vietnamese')) return 'vi-VN';
    if (t.includes('in **thai**') || t.includes('in thai') || /[\u0E00-\u0E7F]/.test(text)) return 'th-TH';
    if (t.includes('in **dutch**') || t.includes('in dutch')) return 'nl-NL';

    if (selectedLang === 'Hindi') return 'hi-IN';
    if (selectedLang === 'Telugu') return 'te-IN';
    if (selectedLang === 'Tamil') return 'ta-IN';
    if (selectedLang === 'Spanish') return 'es-ES';
    if (selectedLang === 'French') return 'fr-FR';
    if (selectedLang === 'German') return 'de-DE';
    if (selectedLang === 'Japanese') return 'ja-JP';

    return 'en-US';
  };

  // Text-to-Speech (Listening Tool)
  const handleSpeakText = (text, idx) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in this browser.');
      return;
    }

    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Code block omitted.')
      .replace(/[\#\*\_\>\`]/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = detectTTSSpeechLang(text, selectedLanguage);

    utterance.onend = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);

    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition (Voice Mic Tool)
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please use Chrome, Edge, Safari, or Brave.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;

      let langCode = 'en-US';
      if (selectedLanguage === 'Hindi') langCode = 'hi-IN';
      else if (selectedLanguage === 'Telugu') langCode = 'te-IN';
      else if (selectedLanguage === 'Tamil') langCode = 'ta-IN';
      else if (selectedLanguage === 'Spanish') langCode = 'es-ES';

      recognition.lang = langCode;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
        setInputMessage(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  // File Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFile(true);
      const res = await uploadChatAttachment(file);
      if (res.success && res.attachment) {
        setAttachments(prev => [...prev, res.attachment]);
      } else {
        alert(res.message || "Failed to upload attachment.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading file. Please try again.");
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (idx) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  // Send Message Logic
  const handleSend = async (textToSend, isEditId = null) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    if (isListening && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
      setIsListening(false);
    }

    let activeLoc = userLocation;
    if (text.toLowerCase().includes('near me') || text.toLowerCase().includes('nearby')) {
      activeLoc = await getLiveLocation();
    }

    const currentAttachments = [...attachments];
    setAttachments([]);
    setInputMessage('');
    setLoading(true);

    let updatedMessages = [...messages];

    if (isEditId) {
      // Find edit index and truncate downstream messages
      const editIdx = updatedMessages.findIndex(m => m.id === isEditId);
      if (editIdx !== -1) {
        updatedMessages[editIdx].text = text;
        updatedMessages = updatedMessages.slice(0, editIdx + 1);
      }
    } else {
      const userMsg = { sender: 'user', text, attachments: currentAttachments };
      updatedMessages.push(userMsg);
    }

    setMessages(updatedMessages);
    setEditingMessageId(null);

    try {
      const historyPayload = updatedMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await sendChatMessage({
        message: text,
        destination: destination,
        language: activeLang,
        messages: historyPayload,
        conversation_id: activeConvId,
        attachments: currentAttachments,
        user_location: activeLoc,
        edit_message_id: isEditId,
        user_id: 1
      });

      if (res.success && res.chat) {
        if (res.chat.conversation_id && !activeConvId) {
          setActiveConvId(res.chat.conversation_id);
          loadConversations();
        }

        const botMsg = {
          sender: 'bot',
          text: res.chat.reply,
          action_type: res.chat.action_type,
          suggestions: res.chat.suggestions || []
        };
        setMessages((prev) => [...prev, botMsg]);

        if (res.chat.action_type === 'OPEN_SAFETY') {
          setTimeout(() => navigate('/safety'), 1500);
        } else if (res.chat.action_type === 'GUIDE_ME' || res.chat.action_type === 'FIND_NEARBY') {
          setTimeout(() => navigate('/guide'), 1500);
        } else if (res.chat.action_type === 'BOOK_GUIDE') {
          setTimeout(() => navigate('/guides'), 1500);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: '⚠️ Unable to process request. Please tap Retry to try again.', error: true, retryText: text }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '⚠️ Network connection issue. Please check connection and try again.', error: true, retryText: text }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleRegenerateLast = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user');
    if (lastUserMsg) {
      handleSend(lastUserMsg.text);
    }
  };

  return (
    <div>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <div 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-[1500] bg-gradient-to-r from-blue-700 via-indigo-700 to-amber-600 text-white px-5 py-3.5 rounded-full font-extrabold text-sm shadow-2xl flex items-center gap-2 cursor-pointer hover:scale-105 transition-all border-2 border-white/20"
        >
          <Bot className="w-5 h-5 animate-bounce" />
          <span>🤖 DIGITAL YATRA AI</span>
        </div>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-3 left-3 sm:bottom-6 sm:left-6 z-[2000] w-[95vw] sm:w-[480px] h-[640px] max-h-[88vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
          
          {/* Header Bar */}
          <div className="bg-slate-900 text-white p-3 sm:p-4 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowDrawer(!showDrawer)}
                  className="p-1.5 bg-slate-800 text-amber-400 hover:text-white rounded-xl transition hover:bg-slate-700"
                  title="Toggle Chat History Drawer"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div className="bg-amber-500 text-slate-950 p-1.5 rounded-xl">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm leading-tight text-white flex items-center gap-1">
                    Digital Yatra AI
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-amber-400 font-semibold">General AI Companion, Mentor & Guide</p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={handleCreateNewChat} 
                  title="New Chat"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 shadow transition"
                >
                  <Plus className="w-3.5 h-3.5" /> New Chat
                </button>

                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-slate-950 text-amber-300 font-extrabold border border-amber-500/50 rounded-xl px-1.5 py-1 text-[11px] focus:outline-none max-w-[110px] cursor-pointer"
                >
                  {worldLanguages.map((lang) => (
                    <option key={lang.id} value={lang.id} className="bg-slate-900 text-amber-300 font-bold">
                      {lang.label}
                    </option>
                  ))}
                </select>

                <button 
                  onClick={() => {
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                    setSpeakingIdx(null);
                    setIsOpen(false);
                  }}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Custom Language Banner */}
            {selectedLanguage === 'Custom' && (
              <div className="mt-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Type custom language..."
                  value={customLangText}
                  onChange={(e) => setCustomLangText(e.target.value)}
                  className="w-full bg-slate-800 text-white text-xs border border-slate-700 rounded-lg px-2.5 py-1 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Main Layout Area (Drawer + Messages Body) */}
          <div className="flex-1 flex overflow-hidden relative bg-slate-50">

            {/* History Drawer Overlay */}
            {showDrawer && (
              <div className="absolute inset-0 z-30 bg-slate-900/95 text-white p-4 flex flex-col space-y-3 overflow-y-auto animate-in fade-in duration-200">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h4 className="font-extrabold text-sm text-amber-400 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" /> Previous Conversations
                  </h4>
                  <button onClick={() => setShowDrawer(false)} className="text-slate-400 hover:text-white p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleCreateNewChat}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow"
                >
                  <Plus className="w-4 h-4" /> Start New Chat
                </button>

                <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
                  {conversations.length === 0 ? (
                    <p className="text-xs text-slate-400 italic p-2 text-center">No past chats yet. Start a conversation!</p>
                  ) : (
                    conversations.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleSelectConversation(c.id)}
                        className={`p-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer border transition ${
                          activeConvId === c.id ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold' : 'bg-slate-800/60 hover:bg-slate-800 border-slate-800 text-slate-300'
                        }`}
                      >
                        {editingConvTitleId === c.id ? (
                          <div className="flex items-center gap-1 w-full" onClick={e => e.stopPropagation()}>
                            <input
                              type="text"
                              value={tempTitleText}
                              onChange={e => setTempTitleText(e.target.value)}
                              className="bg-slate-900 border border-amber-400 text-white px-2 py-0.5 rounded text-xs w-full"
                            />
                            <button onClick={() => handleRenameConv(c.id)} className="text-emerald-400 font-bold px-1.5">✓</button>
                          </div>
                        ) : (
                          <>
                            <span className="truncate flex-1 pr-2">{c.title || 'Chat session'}</span>
                            <div className="flex items-center gap-1 opacity-75 hover:opacity-100">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setEditingConvTitleId(c.id); setTempTitleText(c.title); }}
                                className="p-1 hover:text-amber-400"
                                title="Rename"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={(e) => handleDeleteConv(c.id, e)}
                                className="p-1 hover:text-red-400"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Messages Stream */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3.5">
              {messages.map((m, idx) => (
                <div 
                  key={m.id || idx} 
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} max-w-[94%] ${m.sender === 'user' ? 'ml-auto' : ''}`}
                >
                  <div 
                    className={`p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed relative group shadow-sm ${
                      m.sender === 'user' 
                        ? 'bg-blue-600 text-white font-medium rounded-br-none' 
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none font-normal'
                    }`}
                  >
                    {/* Render Attachments if any */}
                    {m.attachments && m.attachments.length > 0 && (
                      <div className="mb-2 space-y-1">
                        {m.attachments.map((att, aIdx) => (
                          <div key={aIdx} className="bg-black/10 rounded-lg p-1.5 text-[11px] flex items-center gap-2">
                            {att.type === 'image' ? <ImageIcon className="w-4 h-4 text-amber-300" /> : <FileText className="w-4 h-4 text-blue-300" />}
                            <span className="font-bold truncate max-w-[180px]">{att.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {m.sender === 'bot' ? <FormattedMarkdown text={m.text} /> : m.text}

                    {/* Actions for Messages */}
                    <div className="mt-2 flex items-center gap-2 justify-end text-[10px]">
                      {m.sender === 'user' && (
                        <>
                          <button
                            onClick={() => { setInputMessage(m.text); setEditingMessageId(m.id); }}
                            className="text-white/80 hover:text-white font-bold flex items-center gap-0.5 bg-white/10 px-2 py-0.5 rounded transition"
                            title="Edit message"
                          >
                            <Edit3 className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => handleCopyText(m.text, idx)}
                            className="text-white/80 hover:text-white font-bold flex items-center gap-0.5 bg-white/10 px-2 py-0.5 rounded transition"
                          >
                            {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                            {copiedIdx === idx ? 'Copied' : 'Copy'}
                          </button>
                        </>
                      )}

                      {m.sender === 'bot' && (
                        <>
                          <button
                            onClick={() => handleSpeakText(m.text, idx)}
                            className={`font-bold flex items-center gap-1 px-2 py-0.5 rounded border transition ${
                              speakingIdx === idx
                                ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                                : 'bg-slate-100 text-slate-700 hover:text-blue-600 border-slate-200'
                            }`}
                            title={speakingIdx === idx ? "Stop Listening" : "Listen out loud"}
                          >
                            {speakingIdx === idx ? <VolumeX className="w-3 h-3 text-slate-950" /> : <Volume2 className="w-3 h-3 text-blue-600" />}
                            {speakingIdx === idx ? 'Speaking...' : '🔊 Listen'}
                          </button>

                          <button
                            onClick={() => handleCopyText(m.text, idx)}
                            className="text-slate-500 hover:text-blue-600 font-bold flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 transition"
                          >
                            {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            {copiedIdx === idx ? 'Copied' : 'Copy'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Contextual Interactive App Feature Buttons */}
                  {m.sender === 'bot' && m.action_type && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(m.action_type === 'FIND_NEARBY' || m.action_type === 'GUIDE_ME') && (
                        <button 
                          onClick={() => navigate('/guide')} 
                          className="bg-white hover:bg-amber-50 text-slate-800 border border-slate-200 px-2.5 py-1 rounded-xl text-[11px] font-bold shadow-xs flex items-center gap-1"
                        >
                          <MapPin className="w-3 h-3 text-amber-500" /> 🗺️ Open Map
                        </button>
                      )}
                      {(m.action_type === 'BOOK_GUIDE') && (
                        <button 
                          onClick={() => navigate('/guides')} 
                          className="bg-white hover:bg-amber-50 text-slate-800 border border-slate-200 px-2.5 py-1 rounded-xl text-[11px] font-bold shadow-xs flex items-center gap-1"
                        >
                          <UserCheck className="w-3 h-3 text-blue-500" /> 🧑‍🏫 Find Local Guide
                        </button>
                      )}
                      {(m.action_type === 'OPEN_SAFETY') && (
                        <button 
                          onClick={() => navigate('/safety')} 
                          className="bg-white hover:bg-amber-50 text-slate-800 border border-slate-200 px-2.5 py-1 rounded-xl text-[11px] font-bold shadow-xs flex items-center gap-1"
                        >
                          <ShieldAlert className="w-3 h-3 text-red-500" /> 🚨 Safety Mode
                        </button>
                      )}
                    </div>
                  )}

                  {/* Suggestion Chips */}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {m.suggestions.map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => handleSend(chip)}
                          className="bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs transition hover:border-blue-400"
                        >
                          ⚡ {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="text-xs text-slate-600 italic flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-xs">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                  Digital Yatra AI is processing response...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Presets Bar */}
          <div className="p-2 bg-slate-100 border-t border-slate-200 overflow-x-auto whitespace-nowrap flex gap-1.5 items-center shrink-0">
            <button
              onClick={handleRegenerateLast}
              title="Regenerate last response"
              className="bg-amber-500 text-slate-950 font-bold px-2.5 py-1 rounded-xl text-xs flex items-center gap-1 hover:bg-amber-400 shrink-0"
            >
              <RefreshCw className="w-3 h-3" /> Regenerate
            </button>
            {generalPresetQueries.map((pq, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(pq)}
                className="bg-white text-slate-700 hover:text-blue-600 border border-slate-200 px-2.5 py-1 rounded-xl text-xs font-medium shrink-0 shadow-xs transition"
              >
                💬 {pq}
              </button>
            ))}
          </div>

          {/* Composer Input Area */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(null, editingMessageId); }}
            className="p-3 bg-white border-t border-slate-200 shrink-0 relative"
          >
            {/* Attachment Previews */}
            {attachments.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {attachments.map((att, idx) => (
                  <div key={idx} className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-slate-200">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span className="truncate max-w-[120px] font-bold">{att.name}</span>
                    <button type="button" onClick={() => handleRemoveAttachment(idx)} className="text-slate-400 hover:text-red-500">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {isListening && (
              <div className="absolute -top-9 left-4 right-4 bg-red-600 text-white text-[11px] font-bold py-1 px-3 rounded-full flex items-center justify-between shadow-md animate-pulse z-10">
                <span>🎙️ Listening... Speak your question now!</span>
                <button type="button" onClick={toggleVoiceInput} className="underline text-[10px]">Stop</button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept=".txt,.pdf,.png,.jpg,.jpeg,.webp,.csv,.json,.doc,.docx"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFile}
                title="Attach Document or Image"
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 transition"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <textarea 
                ref={textareaRef}
                rows={1}
                placeholder={isListening ? "Listening..." : (editingMessageId ? "Edit your message..." : "Ask ANY question in ANY language...")}
                className="flex-1 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium text-slate-900 resize-none max-h-24"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(null, editingMessageId);
                  }
                }}
              />

              <button
                type="button"
                onClick={toggleVoiceInput}
                title={isListening ? "Stop Voice Input" : "Speak with Mic"}
                className={`p-2.5 rounded-xl font-bold text-xs shadow transition flex items-center justify-center border ${
                  isListening ? 'bg-red-600 text-white border-red-500 animate-pulse' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-slate-700" />}
              </button>

              <button 
                type="submit" 
                disabled={loading || !inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow transition flex items-center justify-center disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
