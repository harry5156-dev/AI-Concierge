import { useState, useRef, useEffect } from "react";

// ── Make.com Webhook Configuration ──
// 1. Create a Make.com scenario with a Custom Webhook trigger
// 2. Paste the webhook URL below
// 3. Add a WhatsApp Business or Twilio module to send messages
const MAKE_WEBHOOK_URL = ""; // Paste your Make.com webhook URL here
const CONCIERGE_OFFICER_PHONE = "+2347031381486";
const ACTIONABLE_CATEGORIES = ["room service", "spa", "dining", "transport", "concierge"];

const HILTON_LOGO = "data:image/jpeg;base64,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";

const QUICK_ACTIONS = [
  { icon: "🛎️", label: "Room Service", prompt: "I'd like to order room service please" },
  { icon: "🧖", label: "Spa & Wellness", prompt: "What spa services do you offer?" },
  { icon: "🍽️", label: "Dining", prompt: "Show me your restaurant options" },
  { icon: "🚗", label: "Transport", prompt: "I need airport transportation" },
  { icon: "🏊", label: "Amenities", prompt: "What amenities are available?" },
  { icon: "📍", label: "Abuja Guide", prompt: "Recommend local attractions in Abuja" },
  { icon: "👤", label: "Speak to Concierge", prompt: "I'd like to speak to a concierge officer please" },
];

const SAMPLE_RESPONSES = {
  "room service": "Certainly, sir. Our in-room dining at Transcorp Hilton Abuja operates 24 hours for your convenience. Tonight's chef's recommendations include:\n\n**Grilled Atlantic Salmon** — with lemon herb butter & seasonal vegetables | ₦18,500\n**Jollof Rice & Grilled Chicken** — our signature Nigerian classic | ₦12,000\n**Wagyu Beef Tenderloin** — with truffle mashed potatoes | ₦28,500\n**Continental Club Sandwich** — triple-decker with fries | ₦9,500\n\nI can also arrange a curated wine pairing selected by our sommelier. Shall I send the full menu, or would you like to place an order now?",
  "spa": "Welcome to the Transcorp Hilton Spa & Wellness Centre — your sanctuary of relaxation in the heart of Abuja. Today's available treatments include:\n\n**Deep Tissue Massage** — 60 min | ₦35,000\n**African Shea Butter Ritual** — 90 min | ₦48,000\n**Rejuvenating Facial** — 75 min | ₦32,000\n**Couples Retreat Package** — 120 min | ₦85,000\n\nOur fitness centre, sauna and steam rooms are complimentary for all hotel guests. Shall I book a session for you?",
  "dining": "Transcorp Hilton Abuja offers exceptional dining experiences across multiple venues:\n\n**Bukka Restaurant** — Ground Floor\nAuthentic Nigerian cuisine featuring jollof rice, suya, and regional specialities. Open for lunch & dinner.\n\n**Zari Restaurant** — Lobby Level\nContemporary international fine dining with panoramic garden views. Reservations recommended for dinner.\n\n**Oriental Restaurant** — First Floor\nAuthentic Asian cuisine — Chinese, Japanese, and Thai favourites.\n\n**Poolside Bar & Grill** — Pool Deck\nLight bites, cocktails, and grilled specialities in a tropical setting.\n\nWould you like me to make a reservation at any of these?",
  "transport": "I would be delighted to arrange your transportation. Our concierge services include:\n\n**Airport Transfer** — Nnamdi Azikiwe International Airport, from ₦25,000\n**Private Chauffeur** — Mercedes E-Class, from ₦15,000/hr\n**Executive SUV** — Toyota Land Cruiser, from ₦20,000/hr\n**City Tour Vehicle** — With professional guide, from ₦45,000/half day\n\nPlease let me know your destination and preferred pickup time, and I shall have everything arranged promptly.",
  "amenities": "As a valued guest of Transcorp Hilton Abuja, you have access to our full range of world-class amenities:\n\n**Outdoor Swimming Pool** — Heated, open 7 AM–9 PM daily\n**Fitness Centre** — 24/7 access, modern equipment\n**Tennis Courts** — Complimentary for guests, racquets available\n**Business Centre** — Printing, meeting rooms & high-speed WiFi\n**Gift Shop & Boutiques** — Lobby level\n**Salon & Barber** — Full grooming services\n\nIs there anything specific you would like to book or learn more about?",
  "local": "Abuja is a vibrant city with wonderful attractions nearby. Here are my curated recommendations:\n\n**Landmarks & Culture**\n• Aso Rock — Iconic monolith, 15-min drive\n• Nigerian National Mosque — 10-min drive\n• National Church — 12-min drive\n• Arts & Crafts Village — 8-min drive\n\n**Nature & Recreation**\n• Jabi Lake — Boat rides & waterfront dining, 10-min drive\n• Millennium Park — Beautiful gardens, 5-min walk\n• Wonderland Amusement Park — 15-min drive\n\n**Shopping**\n• Jabi Lake Mall — Premium retail, 10-min drive\n• Wuse Market — Authentic local experience, 8-min drive\n\nI can arrange private tours, guides, or transportation to any of these. What interests you?",
};

function getResponse(input) {
  const lower = input.toLowerCase();
  if (lower.includes("room service") || lower.includes("order")) return SAMPLE_RESPONSES["room service"];
  if (lower.includes("spa") || lower.includes("wellness") || lower.includes("massage")) return SAMPLE_RESPONSES["spa"];
  if (lower.includes("dining") || lower.includes("restaurant") || lower.includes("eat")) return SAMPLE_RESPONSES["dining"];
  if (lower.includes("transport") || lower.includes("car") || lower.includes("taxi") || lower.includes("airport")) return SAMPLE_RESPONSES["transport"];
  if (lower.includes("amenities") || lower.includes("pool") || lower.includes("gym") || lower.includes("fitness")) return SAMPLE_RESPONSES["amenities"];
  if (lower.includes("local") || lower.includes("attract") || lower.includes("recommend") || lower.includes("abuja") || lower.includes("nearby")) return SAMPLE_RESPONSES["local"];
  return "Thank you for reaching out. I would be happy to assist you with that. As your dedicated AI Concierge at Transcorp Hilton Abuja, I can help with dining reservations, spa bookings, transportation, local recommendations, and much more. How may I be of service?";
}

function classifyRequest(input) {
  const lower = input.toLowerCase();
  if (lower.includes("room service") || lower.includes("order")) return "room service";
  if (lower.includes("spa") || lower.includes("wellness") || lower.includes("massage")) return "spa";
  if (lower.includes("dining") || lower.includes("restaurant") || lower.includes("eat")) return "dining";
  if (lower.includes("transport") || lower.includes("car") || lower.includes("taxi") || lower.includes("airport")) return "transport";
  if (lower.includes("speak to concierge") || lower.includes("human") || lower.includes("real person")) return "concierge";
  return null;
}

async function sendWebhook({ guestName, roomNumber, category, message }) {
  if (!MAKE_WEBHOOK_URL) {
    console.warn("Make.com webhook URL is not configured. Skipping notification.");
    return { success: false, reason: "not_configured" };
  }
  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guest_name: guestName,
        room_number: roomNumber,
        request_type: category,
        message: message,
        timestamp: new Date().toISOString(),
        officer_phone: CONCIERGE_OFFICER_PHONE,
      }),
    });
    return { success: response.ok };
  } catch (error) {
    console.error("Webhook failed:", error);
    return { success: false, reason: "network_error" };
  }
}

function renderFormattedContent(content, isUser) {
  const boldColor = isUser ? "#A4BBDA" : "#003366";
  const bulletColor = isUser ? "#A4BBDA" : "#009CDE";
  const lines = content.split("\n");
  return lines.map((line, lineIdx) => {
    const parts = [];
    let lastIndex = 0;
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    while ((match = boldRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }
      parts.push(
        <strong key={`b-${lineIdx}-${match.index}`} style={{ color: boldColor, fontWeight: 600 }}>
          {match[1]}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }
    if (line.startsWith("• ")) {
      const bulletContent = parts.length > 0 ? parts : [line.slice(2)];
      if (typeof bulletContent[0] === "string" && bulletContent[0].startsWith("• ")) {
        bulletContent[0] = bulletContent[0].slice(2);
      }
      return (
        <span key={`l-${lineIdx}`}>
          {lineIdx > 0 && "\n"}
          <span style={{ color: bulletColor, marginRight: 6 }}>{"●"}</span>
          {bulletContent}
        </span>
      );
    }
    return (
      <span key={`l-${lineIdx}`}>
        {lineIdx > 0 && "\n"}
        {parts.length > 0 ? parts : line}
      </span>
    );
  });
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%",
        background: "#003366", display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, boxShadow: "0 2px 8px rgba(0,51,102,0.2)",
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#A4BBDA" />
        </svg>
      </div>
      <div style={{
        background: "#F0F4F8", borderRadius: "18px 18px 18px 4px",
        padding: "14px 22px", display: "flex", gap: 6, alignItems: "center",
        border: "1px solid #E2E8F0",
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#003366",
            animation: `hiltonPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message, isLast }) {
  if (message.role === "system") {
    return (
      <div style={{
        textAlign: "center", margin: "8px 0",
        animation: "hiltonSlideIn 0.4s ease-out",
      }}>
        <span style={{
          display: "inline-block", background: "#E8F5E9", color: "#2E7D32",
          fontSize: 11.5, fontWeight: 600, padding: "6px 14px", borderRadius: 20,
          letterSpacing: "0.01em",
        }}>
          {"✓ "}{message.content}
        </span>
      </div>
    );
  }
  const isUser = message.role === "user";
  return (
    <div style={{
      display: "flex", flexDirection: isUser ? "row-reverse" : "row",
      gap: 10, alignItems: "flex-start",
      animation: isLast ? "hiltonSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
      marginBottom: 4,
    }}>
      {!isUser && (
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "#003366", display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, boxShadow: "0 2px 8px rgba(0,51,102,0.2)",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#A4BBDA" />
          </svg>
        </div>
      )}
      <div style={{
        maxWidth: "78%", padding: "13px 18px",
        background: isUser ? "#003366" : "#F0F4F8",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        border: isUser ? "none" : "1px solid #E2E8F0",
        color: isUser ? "#FFFFFF" : "#1A2A3A",
        fontSize: 14, lineHeight: 1.7, letterSpacing: "0.01em",
        fontFamily: "'Source Sans 3', sans-serif",
        whiteSpace: "pre-line",
        boxShadow: isUser ? "0 2px 12px rgba(0,51,102,0.2)" : "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        {renderFormattedContent(message.content, isUser)}
      </div>
    </div>
  );
}

export default function HiltonAIConcierge() {
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", content: "Welcome to Transcorp Hilton Abuja. I'm your personal AI Concierge, here to ensure every moment of your stay is truly exceptional.\n\nHow may I assist you today?", time: "Now" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [webhookStatus, setWebhookStatus] = useState(null);
  const guestName = "Mr. Okonkwo";
  const roomNumber = "1205";
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const idCounter = useRef(1);
  const typingTimeoutRef = useRef(null);

  const nextId = () => ++idCounter.current;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const trimmed = text.trim();
    setMessages(prev => [...prev, { id: nextId(), role: "user", content: trimmed, time: "Now" }]);
    setInput("");
    setIsTyping(true);
    setShowQuickActions(false);

    const category = classifyRequest(trimmed);
    let webhookResult = null;
    if (category && ACTIONABLE_CATEGORIES.includes(category)) {
      setWebhookStatus("sending");
      webhookResult = await sendWebhook({ guestName, roomNumber, category, message: trimmed });
      setWebhookStatus(webhookResult.success ? "sent" : "failed");
    }

    typingTimeoutRef.current = setTimeout(() => {
      const botResponse = category === "concierge"
        ? "I have notified our concierge officer on duty. They will reach out to you on WhatsApp shortly at your registered number. Is there anything else I can assist you with in the meantime?"
        : getResponse(trimmed);

      setMessages(prev => [
        ...prev,
        { id: nextId(), role: "assistant", content: botResponse, time: "Now" },
        ...(webhookResult?.success ? [{
          id: nextId(), role: "system",
          content: `A concierge officer has been notified about your ${category} request.`,
          time: "Now",
        }] : []),
      ]);
      setIsTyping(false);

      if (webhookResult) {
        setTimeout(() => setWebhookStatus(null), 4000);
      }
    }, 1200 + Math.random() * 800);
  };

  return (
    <div style={{
      width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center",
      background: "linear-gradient(145deg, #001A33 0%, #003366 40%, #114C98 100%)",
      fontFamily: "'Source Sans 3', sans-serif",
    }}>
      {/* Google Fonts loaded via index.html or fallback to system fonts */}
      <style>{`
        @keyframes hiltonPulse { 0%,100%{opacity:.3;transform:scale(.85)} 50%{opacity:1;transform:scale(1.1)} }
        @keyframes hiltonSlideIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hiltonFadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gentleSpin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,51,102,0.15); border-radius: 4px; }
        ::placeholder { color: #94A3B8; }
        .hilton-quick-btn { transition: all 0.25s ease; }
        .hilton-quick-btn:hover {
          background: #003366 !important;
          border-color: #003366 !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,51,102,0.2) !important;
        }
        .hilton-quick-btn:hover span:last-child { color: #FFFFFF !important; }
        .hilton-input-wrap { transition: border-color 0.25s ease, box-shadow 0.25s ease; }
        .hilton-input-wrap:focus-within {
          border-color: #003366 !important;
          box-shadow: 0 0 0 3px rgba(0,51,102,0.1) !important;
        }
      `}</style>

      {/* Decorative circles */}
      <div style={{ position: "fixed", top: -120, right: -120, width: 340, height: 340, borderRadius: "50%", background: "rgba(0,156,222,0.06)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -80, left: -80, width: 260, height: 260, borderRadius: "50%", background: "rgba(164,187,218,0.06)", pointerEvents: "none" }} />

      <div style={{
        width: "100%", maxWidth: 440, height: "100%", maxHeight: 800,
        display: "flex", flexDirection: "column",
        background: "#FFFFFF",
        borderRadius: 28, overflow: "hidden",
        boxShadow: "0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
        position: "relative",
      }}>
        {/* Header */}
        <div style={{
          padding: "0", background: "#003366", position: "relative", overflow: "hidden",
        }}>
          {/* Subtle pattern overlay */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.04,
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, #fff 10px, #fff 11px)",
            pointerEvents: "none",
          }} />

          <div style={{ padding: "18px 20px 14px", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center",
                  padding: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}>
                  <img src={HILTON_LOGO} alt="Transcorp Hilton" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Libre Baskerville', serif",
                    fontSize: 16, fontWeight: 700, color: "#FFFFFF",
                    letterSpacing: "0.02em", lineHeight: 1.2,
                  }}>AI Concierge</div>
                  <div style={{
                    fontSize: 10.5, color: "#A4BBDA",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    marginTop: 3, fontWeight: 600,
                  }}>Transcorp Hilton Abuja</div>
                </div>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.1)", borderRadius: 20,
                padding: "5px 12px",
              }}>
                <div style={{
                  width: 7, height: 7, borderRadius: "50%", background: "#34D399",
                  animation: "hiltonPulse 2s ease-in-out infinite",
                }} />
                <span style={{ fontSize: 10, color: "#A4BBDA", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Online</span>
              </div>
              {webhookStatus === "sending" && (
                <span style={{ fontSize: 10, color: "#FFB300", fontWeight: 600 }}>Notifying officer...</span>
              )}
              {webhookStatus === "sent" && (
                <span style={{ fontSize: 10, color: "#4CAF50", fontWeight: 600 }}>Officer notified ✓</span>
              )}
              {webhookStatus === "failed" && (
                <span style={{ fontSize: 10, color: "#E53935", fontWeight: 600 }}>Notification failed</span>
              )}
            </div>
          </div>

          {/* Guest bar */}
          <div style={{
            padding: "10px 20px 12px",
            background: "rgba(0,0,0,0.15)",
            display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
          }}>
            <span style={{ fontSize: 11.5, color: "#A4BBDA", fontWeight: 400 }}>Guest:</span>
            <span style={{ fontSize: 11.5, color: "#FFFFFF", fontWeight: 600 }}>{guestName}</span>
            <span style={{ color: "rgba(164,187,218,0.4)", margin: "0 3px", fontSize: 10 }}>|</span>
            <span style={{ fontSize: 11.5, color: "#A4BBDA", fontWeight: 400 }}>Room:</span>
            <span style={{ fontSize: 11.5, color: "#FFFFFF", fontWeight: 600 }}>{roomNumber}</span>
            <span style={{ color: "rgba(164,187,218,0.4)", margin: "0 3px", fontSize: 10 }}>|</span>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
              color: "#009CDE",
            }}>Hilton Honors Gold</span>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{
          flex: 1, overflowY: "auto", padding: "16px 16px 8px",
          display: "flex", flexDirection: "column", gap: 10,
          background: "#FAFBFD",
        }}>
          {messages.map((msg, i) => (
            <MessageBubble key={msg.id} message={msg} isLast={i === messages.length - 1 && messages.length > 1} />
          ))}
          {isTyping && <TypingIndicator />}

          {showQuickActions && (
            <div style={{ marginTop: 6, animation: "hiltonFadeIn 0.6s ease-out 0.3s both" }}>
              <div style={{
                fontSize: 11, color: "#64748B", fontWeight: 600,
                letterSpacing: "0.1em", textTransform: "uppercase",
                marginBottom: 10, paddingLeft: 2,
              }}>How may I assist you?</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {QUICK_ACTIONS.map((action, i) => (
                  <button key={i} onClick={() => sendMessage(action.prompt)} className="hilton-quick-btn" style={{
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: 14, padding: "14px 6px",
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: 7, cursor: "pointer",
                    animation: `hiltonFadeIn 0.5s ease-out ${0.4 + i * 0.07}s both`,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}>
                    <span style={{ fontSize: 22 }}>{action.icon}</span>
                    <span style={{
                      fontSize: 11, color: "#334155", fontWeight: 600,
                      letterSpacing: "0.01em", transition: "color 0.25s ease",
                    }}>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{
          padding: "10px 14px 18px",
          borderTop: "1px solid #E2E8F0", background: "#FFFFFF",
        }}>
          <div className="hilton-input-wrap" style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#F0F4F8", borderRadius: 16,
            padding: "4px 5px 4px 18px",
            border: "2px solid transparent",
          }}>
            <input
              ref={inputRef} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              placeholder="Ask your concierge anything..."
              maxLength={500}
              aria-label="Type your message"
              style={{
                flex: 1, border: "none", outline: "none",
                background: "transparent", color: "#1A2A3A",
                fontSize: 14, fontFamily: "'Source Sans 3', sans-serif",
                padding: "10px 0",
              }}
            />
            <button onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping} aria-label="Send message" style={{
              width: 40, height: 40, borderRadius: 12, border: "none",
              background: input.trim() && !isTyping ? "#003366" : "#CBD5E1",
              color: "#FFFFFF",
              cursor: input.trim() && !isTyping ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.25s ease", flexShrink: 0,
              boxShadow: input.trim() && !isTyping ? "0 2px 8px rgba(0,51,102,0.3)" : "none",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
          <div style={{
            textAlign: "center", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <span style={{ fontSize: 9.5, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>
              Powered by AI Concierge
            </span>
            <span style={{ fontSize: 9, color: "#CBD5E1" }}>•</span>
            <span style={{ fontSize: 9.5, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>
              Transcorp Hilton Abuja
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
