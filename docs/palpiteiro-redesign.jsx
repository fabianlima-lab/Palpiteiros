import React, { useState } from 'react';

const rumoresData = [
  {
    id: 1,
    time: 'Flamengo',
    timeColor: '#E11D48',
    jogador: 'Neymar Jr.',
    jogadorImg: '🇧🇷',
    origem: 'Al-Hilal',
    titulo: 'Neymar fecha com o Flamengo em 2025?',
    percentualVai: 73,
    totalPalpites: 2847,
    comentarios: 156,
    tempo: '2h',
    quente: true,
    influenciadores: [
      { nome: 'Venê Casagrande', palpite: 'vai', acertos: 92 },
      { nome: 'Jorge Nicola', palpite: 'nao', acertos: 78 },
    ]
  },
  {
    id: 2,
    time: 'Cruzeiro',
    timeColor: '#2563EB',
    jogador: 'Gabigol',
    jogadorImg: '🔥',
    origem: 'Flamengo',
    titulo: 'Gabigol acerta com o Cruzeiro?',
    percentualVai: 89,
    totalPalpites: 4521,
    comentarios: 312,
    tempo: '45min',
    quente: true,
    influenciadores: [
      { nome: 'Venê Casagrande', palpite: 'vai', acertos: 92 },
      { nome: 'Raisa Simplicio', palpite: 'vai', acertos: 88 },
    ]
  },
  {
    id: 3,
    time: 'Palmeiras',
    timeColor: '#16A34A',
    jogador: 'Andreas Pereira',
    jogadorImg: '🎯',
    origem: 'Fulham',
    titulo: 'Andreas Pereira volta ao Brasil pelo Palmeiras?',
    percentualVai: 34,
    totalPalpites: 892,
    comentarios: 67,
    tempo: '5h',
    quente: false,
    influenciadores: [
      { nome: 'Jorge Nicola', palpite: 'nao', acertos: 78 },
    ]
  },
  {
    id: 4,
    time: 'Corinthians',
    timeColor: '#18181B',
    jogador: 'Dudu',
    jogadorImg: '⚡',
    origem: 'Palmeiras',
    titulo: 'Dudu troca Palmeiras pelo Corinthians?',
    percentualVai: 12,
    totalPalpites: 3102,
    comentarios: 498,
    tempo: '1h',
    quente: true,
    influenciadores: [
      { nome: 'Marcelo Bechler', palpite: 'nao', acertos: 95 },
    ]
  },
  {
    id: 5,
    time: 'São Paulo',
    timeColor: '#DC2626',
    jogador: 'Oscar',
    jogadorImg: '🌟',
    origem: 'Shanghai Port',
    titulo: 'Oscar fecha retorno ao São Paulo?',
    percentualVai: 67,
    totalPalpites: 1876,
    comentarios: 89,
    tempo: '3h',
    quente: false,
    influenciadores: [
      { nome: 'Raisa Simplicio', palpite: 'vai', acertos: 88 },
    ]
  },
  {
    id: 6,
    time: 'Botafogo',
    timeColor: '#FBBF24',
    jogador: 'Thiago Almada',
    jogadorImg: '🇦🇷',
    origem: 'Atlanta United',
    titulo: 'Almada renova com o Botafogo até 2028?',
    percentualVai: 81,
    totalPalpites: 654,
    comentarios: 23,
    tempo: '8h',
    quente: false,
    influenciadores: []
  }
];

const times = [
  { nome: 'Todos', emoji: '⚽', cor: '#6B7280' },
  { nome: 'Flamengo', emoji: '🔴', cor: '#E11D48' },
  { nome: 'Corinthians', emoji: '⚫', cor: '#18181B' },
  { nome: 'Palmeiras', emoji: '💚', cor: '#16A34A' },
  { nome: 'Santos', emoji: '⚪', cor: '#E5E7EB' },
  { nome: 'São Paulo', emoji: '🔴', cor: '#DC2626' },
  { nome: 'Botafogo', emoji: '⭐', cor: '#FBBF24' },
  { nome: 'Fluminense', emoji: '🟢', cor: '#7C3AED' },
  { nome: 'Vasco', emoji: '⚫', cor: '#1F2937' },
  { nome: 'Atlético-MG', emoji: '⚫', cor: '#27272A' },
  { nome: 'Cruzeiro', emoji: '💙', cor: '#2563EB' },
  { nome: 'Inter', emoji: '🔴', cor: '#B91C1C' },
  { nome: 'Grêmio', emoji: '💙', cor: '#0EA5E9' },
];

const topPalpiteiros = [
  { nome: 'pedrosilva', acertos: 94, palpites: 127 },
  { nome: 'mariacampos', acertos: 91, palpites: 98 },
  { nome: 'joaomengo', acertos: 89, palpites: 156 },
  { nome: 'rafinhatimao', acertos: 87, palpites: 203 },
  { nome: 'gabiverdao', acertos: 85, palpites: 89 },
];

const RumorCard = ({ rumor, onVote }) => {
  const [voted, setVoted] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleVote = (tipo) => {
    setVoted(tipo);
  };

  return (
    <div 
      className="rumor-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--time-color': rumor.timeColor,
        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
      }}
    >
      <div className="rumor-header">
        <div className="rumor-time-badge" style={{ background: `${rumor.timeColor}20`, color: rumor.timeColor }}>
          {rumor.time}
        </div>
        <span className="rumor-tempo">{rumor.tempo}</span>
        {rumor.quente && <span className="rumor-quente">🔥 QUENTE</span>}
      </div>
      
      <h3 className="rumor-titulo">{rumor.titulo}</h3>
      
      <div className="rumor-bar-container">
        <div className="rumor-bar">
          <div 
            className="rumor-bar-fill"
            style={{ 
              width: `${rumor.percentualVai}%`,
              background: rumor.percentualVai > 50 
                ? `linear-gradient(90deg, #10B981, #34D399)` 
                : `linear-gradient(90deg, #6B7280, #9CA3AF)`
            }}
          />
        </div>
        <div className="rumor-bar-labels">
          <span className={rumor.percentualVai > 50 ? 'destaque' : ''}>{rumor.percentualVai}% VAI</span>
          <span className={rumor.percentualVai <= 50 ? 'destaque' : ''}>{100 - rumor.percentualVai}% NÃO VAI</span>
        </div>
      </div>

      {rumor.influenciadores.length > 0 && (
        <div className="rumor-influenciadores">
          {rumor.influenciadores.map((inf, i) => (
            <div key={i} className="influenciador-badge">
              <span className="inf-nome">{inf.nome}</span>
              <span className={`inf-palpite ${inf.palpite}`}>
                {inf.palpite === 'vai' ? '✓ VAI' : '✗ NÃO'}
              </span>
              <span className="inf-acertos">{inf.acertos}%</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="rumor-footer">
        <div className="rumor-stats">
          <span>{rumor.totalPalpites.toLocaleString()} palpites</span>
          <span>·</span>
          <span>{rumor.comentarios} comentários</span>
        </div>
        
        <div className="rumor-actions">
          <button 
            className={`btn-palpite vai ${voted === 'vai' ? 'active' : ''}`}
            onClick={() => handleVote('vai')}
            disabled={voted !== null}
          >
            🎯 VAI
          </button>
          <button 
            className={`btn-palpite nao ${voted === 'nao' ? 'active' : ''}`}
            onClick={() => handleVote('nao')}
            disabled={voted !== null}
          >
            ✗ NÃO VAI
          </button>
        </div>
      </div>
      
      {voted && (
        <div className="voted-feedback">
          Palpite registrado! {voted === 'vai' ? '🎯' : '❌'}
        </div>
      )}
    </div>
  );
};

export default function PalpiteiroRedesign() {
  const [timeSelecionado, setTimeSelecionado] = useState('Todos');
  const [filtro, setFiltro] = useState('quentes');

  const rumoresFiltrados = rumoresData
    .filter(r => timeSelecionado === 'Todos' || r.time === timeSelecionado)
    .sort((a, b) => {
      if (filtro === 'quentes') return b.totalPalpites - a.totalPalpites;
      if (filtro === 'novos') return a.tempo.localeCompare(b.tempo);
      return 0;
    });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Space Grotesk', sans-serif;
          background: #09090B;
          color: #FAFAFA;
          min-height: 100vh;
        }
        
        .app-container {
          display: flex;
          min-height: 100vh;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        /* SIDEBAR ESQUERDA */
        .sidebar-left {
          width: 240px;
          border-right: 1px solid #27272A;
          padding: 20px 16px;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          flex-shrink: 0;
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          margin-bottom: 32px;
        }
        
        .logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #10B981, #059669);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        
        .logo-text {
          font-size: 22px;
          font-weight: 700;
          background: linear-gradient(90deg, #10B981, #34D399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .sidebar-section {
          margin-bottom: 28px;
        }
        
        .sidebar-title {
          font-size: 11px;
          font-weight: 600;
          color: #71717A;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 0 12px;
          margin-bottom: 12px;
        }
        
        .time-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .time-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
          font-size: 14px;
          color: #A1A1AA;
        }
        
        .time-item:hover {
          background: #18181B;
          color: #FAFAFA;
        }
        
        .time-item.active {
          background: #1F1F23;
          color: #FAFAFA;
          font-weight: 500;
        }
        
        .time-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          width: 3px;
          height: 24px;
          background: #10B981;
          border-radius: 0 2px 2px 0;
        }
        
        .time-emoji {
          font-size: 16px;
        }
        
        .filtro-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .filtro-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
          font-size: 14px;
          color: #A1A1AA;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }
        
        .filtro-item:hover {
          background: #18181B;
          color: #FAFAFA;
        }
        
        .filtro-item.active {
          background: #10B98120;
          color: #10B981;
          font-weight: 500;
        }
        
        /* FEED CENTRAL */
        .feed-container {
          flex: 1;
          border-right: 1px solid #27272A;
          min-width: 0;
        }
        
        .feed-header {
          position: sticky;
          top: 0;
          background: #09090Bee;
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #27272A;
          padding: 16px 20px;
          z-index: 10;
        }
        
        .feed-header h1 {
          font-size: 20px;
          font-weight: 600;
        }
        
        .feed-tabs {
          display: flex;
          gap: 4px;
          margin-top: 12px;
        }
        
        .feed-tab {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          border: none;
          background: transparent;
          color: #71717A;
        }
        
        .feed-tab:hover {
          background: #27272A;
          color: #FAFAFA;
        }
        
        .feed-tab.active {
          background: #FAFAFA;
          color: #09090B;
        }
        
        .feed-content {
          padding: 0;
        }
        
        .rumor-card {
          padding: 20px;
          border-bottom: 1px solid #27272A;
          transition: all 0.2s ease;
          cursor: pointer;
          position: relative;
        }
        
        .rumor-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--time-color);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        
        .rumor-card:hover {
          background: #0F0F12;
        }
        
        .rumor-card:hover::before {
          opacity: 1;
        }
        
        .rumor-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        
        .rumor-time-badge {
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 4px;
        }
        
        .rumor-tempo {
          font-size: 12px;
          color: #71717A;
        }
        
        .rumor-quente {
          font-size: 11px;
          font-weight: 600;
          color: #F97316;
          background: #F9731620;
          padding: 3px 8px;
          border-radius: 4px;
          margin-left: auto;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .rumor-titulo {
          font-size: 17px;
          font-weight: 600;
          line-height: 1.4;
          margin-bottom: 14px;
          color: #FAFAFA;
        }
        
        .rumor-bar-container {
          margin-bottom: 14px;
        }
        
        .rumor-bar {
          height: 8px;
          background: #27272A;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 6px;
        }
        
        .rumor-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }
        
        .rumor-bar-labels {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #71717A;
          font-family: 'JetBrains Mono', monospace;
        }
        
        .rumor-bar-labels .destaque {
          color: #10B981;
          font-weight: 600;
        }
        
        .rumor-influenciadores {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
        }
        
        .influenciador-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #18181B;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 12px;
        }
        
        .inf-nome {
          color: #A1A1AA;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .inf-palpite {
          font-weight: 600;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 3px;
        }
        
        .inf-palpite.vai {
          color: #10B981;
          background: #10B98120;
        }
        
        .inf-palpite.nao {
          color: #EF4444;
          background: #EF444420;
        }
        
        .inf-acertos {
          color: #71717A;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
        }
        
        .rumor-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .rumor-stats {
          display: flex;
          gap: 8px;
          font-size: 13px;
          color: #71717A;
        }
        
        .rumor-actions {
          display: flex;
          gap: 8px;
        }
        
        .btn-palpite {
          padding: 8px 20px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          border: none;
          font-family: 'Space Grotesk', sans-serif;
        }
        
        .btn-palpite.vai {
          background: #10B98120;
          color: #10B981;
          border: 1px solid #10B98140;
        }
        
        .btn-palpite.vai:hover:not(:disabled) {
          background: #10B981;
          color: #FAFAFA;
        }
        
        .btn-palpite.vai.active {
          background: #10B981;
          color: #FAFAFA;
        }
        
        .btn-palpite.nao {
          background: #EF444420;
          color: #EF4444;
          border: 1px solid #EF444440;
        }
        
        .btn-palpite.nao:hover:not(:disabled) {
          background: #EF4444;
          color: #FAFAFA;
        }
        
        .btn-palpite.nao.active {
          background: #EF4444;
          color: #FAFAFA;
        }
        
        .btn-palpite:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .voted-feedback {
          margin-top: 12px;
          padding: 8px 12px;
          background: #10B98110;
          border: 1px solid #10B98130;
          border-radius: 6px;
          font-size: 13px;
          color: #10B981;
          text-align: center;
        }
        
        /* SIDEBAR DIREITA */
        .sidebar-right {
          width: 300px;
          padding: 20px 16px;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          flex-shrink: 0;
        }
        
        .trending-box {
          background: #18181B;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
        }
        
        .trending-title {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .trending-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .trending-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        
        .trending-rank {
          font-size: 14px;
          font-weight: 700;
          color: #71717A;
          font-family: 'JetBrains Mono', monospace;
          width: 20px;
        }
        
        .trending-info {
          flex: 1;
        }
        
        .trending-name {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 2px;
        }
        
        .trending-meta {
          font-size: 12px;
          color: #71717A;
        }
        
        .trending-percent {
          font-size: 13px;
          font-weight: 600;
          color: #10B981;
          font-family: 'JetBrains Mono', monospace;
        }
        
        .palpiteiros-box {
          background: #18181B;
          border-radius: 12px;
          padding: 16px;
        }
        
        .palpiteiro-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid #27272A;
        }
        
        .palpiteiro-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        
        .palpiteiro-item:first-child {
          padding-top: 0;
        }
        
        .palpiteiro-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10B981, #059669);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
        }
        
        .palpiteiro-info {
          flex: 1;
        }
        
        .palpiteiro-nome {
          font-size: 14px;
          font-weight: 500;
        }
        
        .palpiteiro-meta {
          font-size: 12px;
          color: #71717A;
        }
        
        .palpiteiro-acertos {
          font-size: 14px;
          font-weight: 700;
          color: #10B981;
          font-family: 'JetBrains Mono', monospace;
        }
        
        .cta-box {
          background: linear-gradient(135deg, #10B98120, #059669 20);
          border: 1px solid #10B98140;
          border-radius: 12px;
          padding: 20px;
          margin-top: 20px;
          text-align: center;
        }
        
        .cta-title {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .cta-text {
          font-size: 13px;
          color: #A1A1AA;
          margin-bottom: 16px;
        }
        
        .cta-button {
          width: 100%;
          padding: 12px;
          background: #10B981;
          color: #FAFAFA;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: 'Space Grotesk', sans-serif;
        }
        
        .cta-button:hover {
          background: #059669;
          transform: translateY(-1px);
        }
        
        .empty-state {
          padding: 60px 20px;
          text-align: center;
          color: #71717A;
        }
        
        .empty-state-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        
        /* Responsive */
        @media (max-width: 1200px) {
          .sidebar-right {
            display: none;
          }
        }
        
        @media (max-width: 768px) {
          .sidebar-left {
            display: none;
          }
          
          .app-container {
            flex-direction: column;
          }
          
          .feed-container {
            border-right: none;
          }
        }
      `}</style>
      
      <div className="app-container">
        {/* Sidebar Esquerda */}
        <aside className="sidebar-left">
          <div className="logo">
            <div className="logo-icon">⚽</div>
            <span className="logo-text">Palpiteiro</span>
          </div>
          
          <div className="sidebar-section">
            <div className="sidebar-title">Filtrar</div>
            <div className="filtro-list">
              <button 
                className={`filtro-item ${filtro === 'quentes' ? 'active' : ''}`}
                onClick={() => setFiltro('quentes')}
              >
                🔥 Mais quentes
              </button>
              <button 
                className={`filtro-item ${filtro === 'novos' ? 'active' : ''}`}
                onClick={() => setFiltro('novos')}
              >
                🆕 Mais recentes
              </button>
              <button 
                className={`filtro-item ${filtro === 'fechando' ? 'active' : ''}`}
                onClick={() => setFiltro('fechando')}
              >
                ⏰ Fechando logo
              </button>
            </div>
          </div>
          
          <div className="sidebar-section">
            <div className="sidebar-title">Times</div>
            <div className="time-list">
              {times.map(time => (
                <div 
                  key={time.nome}
                  className={`time-item ${timeSelecionado === time.nome ? 'active' : ''}`}
                  onClick={() => setTimeSelecionado(time.nome)}
                >
                  <span className="time-emoji">{time.emoji}</span>
                  <span>{time.nome}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
        
        {/* Feed Central */}
        <main className="feed-container">
          <header className="feed-header">
            <h1>Rumores</h1>
            <div className="feed-tabs">
              <button className={`feed-tab ${filtro === 'quentes' ? 'active' : ''}`} onClick={() => setFiltro('quentes')}>
                🔥 Quentes
              </button>
              <button className={`feed-tab ${filtro === 'novos' ? 'active' : ''}`} onClick={() => setFiltro('novos')}>
                Recentes
              </button>
              <button className={`feed-tab ${filtro === 'fechando' ? 'active' : ''}`} onClick={() => setFiltro('fechando')}>
                Fechando
              </button>
            </div>
          </header>
          
          <div className="feed-content">
            {rumoresFiltrados.length > 0 ? (
              rumoresFiltrados.map(rumor => (
                <RumorCard key={rumor.id} rumor={rumor} />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <p>Nenhum rumor encontrado para {timeSelecionado}</p>
              </div>
            )}
          </div>
        </main>
        
        {/* Sidebar Direita */}
        <aside className="sidebar-right">
          <div className="trending-box">
            <div className="trending-title">
              📈 Trending
            </div>
            <div className="trending-list">
              {rumoresData.slice(0, 5).map((r, i) => (
                <div key={r.id} className="trending-item">
                  <span className="trending-rank">{i + 1}</span>
                  <div className="trending-info">
                    <div className="trending-name">{r.jogador}</div>
                    <div className="trending-meta">{r.time} · {r.totalPalpites.toLocaleString()} palpites</div>
                  </div>
                  <span className="trending-percent">{r.percentualVai}%</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="palpiteiros-box">
            <div className="trending-title">
              🏆 Top Palpiteiros
            </div>
            {topPalpiteiros.map((p, i) => (
              <div key={p.nome} className="palpiteiro-item">
                <div className="palpiteiro-avatar">
                  {p.nome.charAt(0).toUpperCase()}
                </div>
                <div className="palpiteiro-info">
                  <div className="palpiteiro-nome">@{p.nome}</div>
                  <div className="palpiteiro-meta">{p.palpites} palpites</div>
                </div>
                <span className="palpiteiro-acertos">{p.acertos}%</span>
              </div>
            ))}
          </div>
          
          <div className="cta-box">
            <div className="cta-title">Entre no jogo</div>
            <div className="cta-text">Dê seu palpite e suba no ranking dos melhores palpiteiros do Brasil</div>
            <button className="cta-button">Criar conta grátis</button>
          </div>
        </aside>
      </div>
    </>
  );
}
