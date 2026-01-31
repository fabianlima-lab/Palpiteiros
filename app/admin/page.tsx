'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Rumor {
  id: string
  title: string
  playerName: string
  playerImage: string | null
  fromTeam: string | null
  toTeam: string
  description: string | null
  category: string
  sentiment: number
  status: string
  closesAt: string
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
  resolvedOutcome: boolean | null
  isAutomatic: boolean
  _count: {
    predictions: number
    signals: number
    newsItems: number
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

const statusOptions = [
  { value: 'open', label: 'Aberto', color: '#00f5a0' },
  { value: 'confirmed', label: 'Confirmado', color: '#00d9f5' },
  { value: 'denied', label: 'Negado', color: '#ff1744' },
  { value: 'deleted', label: 'Deletado', color: '#666680' },
]

const categoryOptions = [
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'contrato', label: 'Contrato' },
  { value: 'emprestimo', label: 'Emprestimo' },
  { value: 'renovacao', label: 'Renovacao' },
]

export default function AdminPage() {
  const [rumors, setRumors] = useState<Rumor[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtros
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterSource, setFilterSource] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal de edicao/criacao
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRumor, setEditingRumor] = useState<Rumor | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    playerName: '',
    playerImage: '',
    fromTeam: '',
    toTeam: '',
    description: '',
    category: 'transferencia',
    status: 'open',
    closesAt: '',
  })
  const [saving, setSaving] = useState(false)

  const fetchRumors = useCallback(async (page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        status: filterStatus,
        source: filterSource,
        search: searchQuery,
      })

      const response = await fetch(`/api/admin/rumors?${params}`)
      if (!response.ok) throw new Error('Erro ao carregar rumores')

      const data = await response.json()
      setRumors(data.rumors)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [filterStatus, filterSource, searchQuery])

  useEffect(() => {
    fetchRumors()
  }, [fetchRumors])

  const openCreateModal = () => {
    setEditingRumor(null)
    setFormData({
      title: '',
      playerName: '',
      playerImage: '',
      fromTeam: '',
      toTeam: '',
      description: '',
      category: 'transferencia',
      status: 'open',
      closesAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    })
    setModalOpen(true)
  }

  const openEditModal = (rumor: Rumor) => {
    setEditingRumor(rumor)
    setFormData({
      title: rumor.title,
      playerName: rumor.playerName,
      playerImage: rumor.playerImage || '',
      fromTeam: rumor.fromTeam || '',
      toTeam: rumor.toTeam,
      description: rumor.description || '',
      category: rumor.category,
      status: rumor.status,
      closesAt: rumor.closesAt.slice(0, 16),
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = '/api/admin/rumors'
      const method = editingRumor ? 'PATCH' : 'POST'
      const body = editingRumor
        ? { id: editingRumor.id, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao salvar')
      }

      setModalOpen(false)
      fetchRumors(pagination?.page || 1)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (rumorId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/rumors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: rumorId, status: newStatus }),
      })

      if (!response.ok) throw new Error('Erro ao atualizar status')

      fetchRumors(pagination?.page || 1)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao atualizar')
    }
  }

  const handleDelete = async (rumorId: string, hard = false) => {
    const confirmMsg = hard
      ? 'Tem certeza que deseja DELETAR PERMANENTEMENTE este rumor? Esta acao nao pode ser desfeita.'
      : 'Tem certeza que deseja arquivar este rumor?'

    if (!confirm(confirmMsg)) return

    try {
      const url = `/api/admin/rumors?id=${rumorId}${hard ? '&hard=true' : ''}`
      const response = await fetch(url, { method: 'DELETE' })

      if (!response.ok) throw new Error('Erro ao deletar')

      fetchRumors(pagination?.page || 1)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao deletar')
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    return statusOptions.find(s => s.value === status)?.color || '#666680'
  }

  return (
    <main style={{ backgroundColor: '#0f0f1a', minHeight: '100vh', padding: '20px' }}>
      {/* Header */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <Link href="/home" style={{ color: '#666680', textDecoration: 'none', fontSize: '13px' }}>
            ← Voltar ao app
          </Link>
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', margin: '8px 0 0' }}>
            Admin - Rumores
          </h1>
        </div>
        <button
          onClick={openCreateModal}
          style={{
            backgroundColor: '#ff1744',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          + Novo Rumor
        </button>
      </div>

      {/* Filtros */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto 24px',
        backgroundColor: '#16162a',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ display: 'block', color: '#666680', fontSize: '11px', marginBottom: '6px' }}>
            BUSCAR
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Jogador, time, titulo..."
            style={{
              width: '100%',
              backgroundColor: '#0f0f1a',
              border: '1px solid #2a2a3e',
              borderRadius: '8px',
              padding: '10px 12px',
              color: '#fff',
              fontSize: '14px',
            }}
          />
        </div>

        <div style={{ minWidth: '150px' }}>
          <label style={{ display: 'block', color: '#666680', fontSize: '11px', marginBottom: '6px' }}>
            STATUS
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#0f0f1a',
              border: '1px solid #2a2a3e',
              borderRadius: '8px',
              padding: '10px 12px',
              color: '#fff',
              fontSize: '14px',
            }}
          >
            <option value="all">Todos</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div style={{ minWidth: '150px' }}>
          <label style={{ display: 'block', color: '#666680', fontSize: '11px', marginBottom: '6px' }}>
            FONTE
          </label>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#0f0f1a',
              border: '1px solid #2a2a3e',
              borderRadius: '8px',
              padding: '10px 12px',
              color: '#fff',
              fontSize: '14px',
            }}
          >
            <option value="all">Todas</option>
            <option value="auto">Automatico</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            onClick={() => fetchRumors(1)}
            style={{
              backgroundColor: '#2a2a3e',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Filtrar
          </button>
        </div>
      </div>

      {/* Stats */}
      {pagination && (
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto 16px',
          color: '#666680',
          fontSize: '13px'
        }}>
          Mostrando {rumors.length} de {pagination.total} rumores
        </div>
      )}

      {/* Tabela */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        backgroundColor: '#16162a',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666680' }}>
            Carregando...
          </div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#ff1744' }}>
            {error}
          </div>
        ) : rumors.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666680' }}>
            Nenhum rumor encontrado
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#0f0f1a' }}>
                  <th style={thStyle}>Fonte</th>
                  <th style={thStyle}>Jogador</th>
                  <th style={thStyle}>Transferencia</th>
                  <th style={thStyle}>Titulo</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Fecha em</th>
                  <th style={thStyle}>Votos</th>
                  <th style={thStyle}>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {rumors.map((rumor) => (
                  <tr key={rumor.id} style={{ borderBottom: '1px solid #2a2a3e' }}>
                    <td style={tdStyle}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '600',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: rumor.isAutomatic ? 'rgba(0, 217, 245, 0.2)' : 'rgba(255, 23, 68, 0.2)',
                        color: rumor.isAutomatic ? '#00d9f5' : '#ff1744',
                      }}>
                        {rumor.isAutomatic ? 'AUTO' : 'MANUAL'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: '600', color: '#fff' }}>{rumor.playerName}</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontSize: '13px', color: '#ccc' }}>
                        {rumor.fromTeam || '?'} → {rumor.toTeam}
                      </div>
                    </td>
                    <td style={{ ...tdStyle, maxWidth: '250px' }}>
                      <div style={{
                        fontSize: '13px',
                        color: '#fff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {rumor.title}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <select
                        value={rumor.status}
                        onChange={(e) => handleStatusChange(rumor.id, e.target.value)}
                        style={{
                          backgroundColor: 'transparent',
                          border: `1px solid ${getStatusColor(rumor.status)}`,
                          borderRadius: '6px',
                          padding: '6px 10px',
                          color: getStatusColor(rumor.status),
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        {statusOptions.map(opt => (
                          <option key={opt.value} value={opt.value} style={{ backgroundColor: '#16162a' }}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontSize: '12px', color: '#666680' }}>
                        {formatDate(rumor.closesAt)}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontSize: '12px', color: '#00f5a0' }}>
                        {rumor._count.predictions} votos
                      </div>
                      <div style={{ fontSize: '11px', color: '#666680' }}>
                        {rumor._count.signals} sinais
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => openEditModal(rumor)}
                          style={actionBtnStyle}
                          title="Editar"
                        >
                          Editar
                        </button>
                        <Link
                          href={`/rumor/${rumor.id}`}
                          style={{ ...actionBtnStyle, textDecoration: 'none' }}
                          title="Ver"
                        >
                          Ver
                        </Link>
                        <button
                          onClick={() => handleDelete(rumor.id, false)}
                          style={{ ...actionBtnStyle, color: '#ff1744', borderColor: '#ff1744' }}
                          title="Arquivar"
                        >
                          Arquivar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginacao */}
        {pagination && pagination.totalPages > 1 && (
          <div style={{
            padding: '16px',
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            borderTop: '1px solid #2a2a3e'
          }}>
            <button
              onClick={() => fetchRumors(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              style={{
                ...paginationBtnStyle,
                opacity: pagination.hasPrev ? 1 : 0.5,
                cursor: pagination.hasPrev ? 'pointer' : 'not-allowed',
              }}
            >
              Anterior
            </button>
            <span style={{ color: '#666680', padding: '8px 16px', fontSize: '14px' }}>
              Pagina {pagination.page} de {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchRumors(pagination.page + 1)}
              disabled={!pagination.hasNext}
              style={{
                ...paginationBtnStyle,
                opacity: pagination.hasNext ? 1 : 0.5,
                cursor: pagination.hasNext ? 'pointer' : 'not-allowed',
              }}
            >
              Proxima
            </button>
          </div>
        )}
      </div>

      {/* Modal de Edicao/Criacao */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#16162a',
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <h2 style={{ color: '#fff', fontSize: '20px', marginBottom: '24px' }}>
              {editingRumor ? 'Editar Rumor' : 'Novo Rumor'}
            </h2>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Titulo *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={inputStyle}
                  placeholder="Ex: Neymar pode voltar ao Santos"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Jogador *</label>
                  <input
                    type="text"
                    value={formData.playerName}
                    onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                    style={inputStyle}
                    placeholder="Nome do jogador"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Imagem do Jogador (URL)</label>
                  <input
                    type="text"
                    value={formData.playerImage}
                    onChange={(e) => setFormData({ ...formData, playerImage: e.target.value })}
                    style={inputStyle}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Time de Origem</label>
                  <input
                    type="text"
                    value={formData.fromTeam}
                    onChange={(e) => setFormData({ ...formData, fromTeam: e.target.value })}
                    style={inputStyle}
                    placeholder="Ex: PSG"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Time de Destino *</label>
                  <input
                    type="text"
                    value={formData.toTeam}
                    onChange={(e) => setFormData({ ...formData, toTeam: e.target.value })}
                    style={inputStyle}
                    placeholder="Ex: Santos"
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Descricao</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  placeholder="Detalhes adicionais sobre o rumor..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={inputStyle}
                  >
                    {categoryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={inputStyle}
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Data de Fechamento *</label>
                <input
                  type="datetime-local"
                  value={formData.closesAt}
                  onChange={(e) => setFormData({ ...formData, closesAt: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#666680',
                  border: '1px solid #2a2a3e',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  backgroundColor: '#ff1744',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'Salvando...' : editingRumor ? 'Salvar Alteracoes' : 'Criar Rumor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

// Estilos reutilizaveis
const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '14px 12px',
  fontSize: '11px',
  fontWeight: '600',
  color: '#666680',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

const tdStyle: React.CSSProperties = {
  padding: '14px 12px',
  verticalAlign: 'middle',
}

const actionBtnStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  color: '#00d9f5',
  border: '1px solid #00d9f5',
  borderRadius: '6px',
  padding: '6px 12px',
  fontSize: '12px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

const paginationBtnStyle: React.CSSProperties = {
  backgroundColor: '#2a2a3e',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '8px 16px',
  fontSize: '14px',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  color: '#666680',
  fontSize: '12px',
  marginBottom: '6px',
  fontWeight: '500',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#0f0f1a',
  border: '1px solid #2a2a3e',
  borderRadius: '8px',
  padding: '12px',
  color: '#fff',
  fontSize: '14px',
}
