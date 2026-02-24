import React, { useState } from 'react';
import { Eye, EyeOff, Download, Lock, LogOut, Image, Type, ExternalLink } from 'lucide-react';
import bannersConfigDefault from '@/data/banners-config.json';
import { PLACEHOLDER_IMAGES } from '@/assets/placeholders';

const ADMIN_PASS_HASH = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

type SlotType = 'image_link' | 'image_text_cta';

interface BannerSlot {
  enabled: boolean;
  type: SlotType;
  image: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  link?: string;
  bgColor?: string;
  textColor?: string;
  targetBlank?: boolean;
}

const SLOT_LABELS: Record<string, { label: string; page: string }> = {
  'home-hero-below': { label: 'Debajo del Hero', page: 'Home' },
  'home-products-mid': { label: 'Entre productos (posicion 8)', page: 'Home' },
  'home-brands-below': { label: 'Debajo de marcas', page: 'Home' },
  'home-faq-below': { label: 'Debajo del FAQ', page: 'Home' },
  'product-description-below': { label: 'Debajo de descripcion', page: 'Producto' },
  'product-similar-below': { label: 'Debajo de similares', page: 'Producto' },
  'collection-header-below': { label: 'Debajo del header', page: 'Coleccion' },
};

export const AdminBannersPage: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('admin-auth') === 'true');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [slots, setSlots] = useState<Record<string, BannerSlot>>(
    () => JSON.parse(JSON.stringify(bannersConfigDefault.slots))
  );
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const hash = await sha256(password);
    if (hash === ADMIN_PASS_HASH) {
      sessionStorage.setItem('admin-auth', 'true');
      setAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Contrasena incorrecta');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin-auth');
    setAuthenticated(false);
    setPassword('');
  };

  const updateSlot = (slotId: string, updates: Partial<BannerSlot>) => {
    setSlots(prev => ({
      ...prev,
      [slotId]: { ...prev[slotId], ...updates }
    }));
  };

  const handleExportJSON = () => {
    const json = JSON.stringify({ slots }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'banners-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
          <div className="flex justify-center mb-6">
            <img src={PLACEHOLDER_IMAGES.logo} alt="Mr. Brown" className="h-14 object-contain" />
          </div>
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Lock className="w-5 h-5 text-[#0c3c1f]" />
            <h1 className="text-xl font-bold text-[#0c3c1f]">Admin Banners</h1>
          </div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Contrasena"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-[#0c3c1f] text-sm"
            autoFocus
          />
          {loginError && <p className="text-red-500 text-xs mb-3">{loginError}</p>}
          <button
            type="submit"
            className="w-full bg-[#0c3c1f] text-white py-3 rounded-lg font-bold hover:bg-[#0a3019] transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#0c3c1f] text-white px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img src={PLACEHOLDER_IMAGES.logo} alt="Mr. Brown" className="h-8 object-contain brightness-0 invert" />
          <h1 className="text-lg font-bold">Administrador de Banners</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar JSON
          </button>
          <button onClick={handleLogout} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          Edita los banners y luego haz clic en <strong>"Exportar JSON"</strong> para descargar el archivo actualizado.
          Reemplaza <code className="bg-blue-100 px-1 rounded">src/data/banners-config.json</code> en el proyecto y haz deploy.
        </div>

        <div className="space-y-4">
          {Object.entries(slots).map(([slotId, slot]) => {
            const meta = SLOT_LABELS[slotId] || { label: slotId, page: '?' };
            const isExpanded = expandedSlot === slotId;

            return (
              <div key={slotId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Slot header */}
                <button
                  onClick={() => setExpandedSlot(isExpanded ? null : slotId)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${slot.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className="text-left">
                      <p className="font-medium text-sm text-[#212121]">{meta.label}</p>
                      <p className="text-[11px] text-[#717182]">
                        Pagina: {meta.page} &middot; Tipo: {slot.type === 'image_link' ? 'Imagen + Link' : 'Imagen + Texto + CTA'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${slot.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {slot.enabled ? 'Activo' : 'Inactivo'}
                    </span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded editor */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 py-5 space-y-4">
                    {/* Toggle + Type */}
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={slot.enabled}
                          onChange={e => updateSlot(slotId, { enabled: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-300 text-[#0c3c1f] focus:ring-[#0c3c1f]"
                        />
                        <span className="text-sm font-medium">Habilitado</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#717182]">Tipo:</span>
                        <select
                          value={slot.type}
                          onChange={e => updateSlot(slotId, { type: e.target.value as SlotType })}
                          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0c3c1f]"
                        >
                          <option value="image_link">Imagen + Link</option>
                          <option value="image_text_cta">Imagen + Texto + CTA</option>
                        </select>
                      </div>
                    </div>

                    {/* Image URL */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-medium text-[#717182] mb-1.5">
                        <Image className="w-3.5 h-3.5" /> URL de imagen
                      </label>
                      <input
                        type="text"
                        value={slot.image}
                        onChange={e => updateSlot(slotId, { image: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3c1f]"
                        placeholder="https://..."
                      />
                    </div>

                    {slot.type === 'image_link' && (
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-[#717182] mb-1.5">
                          <ExternalLink className="w-3.5 h-3.5" /> Link destino
                        </label>
                        <input
                          type="text"
                          value={slot.link || ''}
                          onChange={e => updateSlot(slotId, { link: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3c1f]"
                          placeholder="/categorias/whisky o https://..."
                        />
                      </div>
                    )}

                    {slot.type === 'image_text_cta' && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-[#717182] mb-1.5">
                              <Type className="w-3.5 h-3.5" /> Titulo
                            </label>
                            <input
                              type="text"
                              value={slot.title || ''}
                              onChange={e => updateSlot(slotId, { title: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3c1f]"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-[#717182] mb-1.5 block">Texto CTA</label>
                            <input
                              type="text"
                              value={slot.ctaText || ''}
                              onChange={e => updateSlot(slotId, { ctaText: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3c1f]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-[#717182] mb-1.5 block">Descripcion</label>
                          <textarea
                            value={slot.description || ''}
                            onChange={e => updateSlot(slotId, { description: e.target.value })}
                            rows={2}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3c1f] resize-none"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs font-medium text-[#717182] mb-1.5 block">Link CTA</label>
                            <input
                              type="text"
                              value={slot.ctaLink || ''}
                              onChange={e => updateSlot(slotId, { ctaLink: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3c1f]"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-[#717182] mb-1.5 block">Color fondo</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={slot.bgColor || '#0c3c1f'}
                                onChange={e => updateSlot(slotId, { bgColor: e.target.value })}
                                className="w-8 h-8 rounded cursor-pointer border-0"
                              />
                              <input
                                type="text"
                                value={slot.bgColor || '#0c3c1f'}
                                onChange={e => updateSlot(slotId, { bgColor: e.target.value })}
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3c1f]"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-[#717182] mb-1.5 block">Color texto</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={slot.textColor || '#ffffff'}
                                onChange={e => updateSlot(slotId, { textColor: e.target.value })}
                                className="w-8 h-8 rounded cursor-pointer border-0"
                              />
                              <input
                                type="text"
                                value={slot.textColor || '#ffffff'}
                                onChange={e => updateSlot(slotId, { textColor: e.target.value })}
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3c1f]"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={slot.targetBlank || false}
                        onChange={e => updateSlot(slotId, { targetBlank: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-[#0c3c1f] focus:ring-[#0c3c1f]"
                      />
                      <span className="text-sm">Abrir en nueva pestana</span>
                    </label>

                    {/* Preview */}
                    <div>
                      <p className="text-xs font-medium text-[#717182] mb-2 flex items-center gap-1.5">
                        {slot.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        Vista previa
                      </p>
                      <div className={`border border-dashed rounded-xl overflow-hidden ${slot.enabled ? 'border-green-300' : 'border-gray-300 opacity-50'}`}>
                        {slot.type === 'image_link' ? (
                          <div className="relative">
                            <span className="absolute top-2 right-2 bg-black/40 text-white text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">Publicidad</span>
                            <img src={slot.image} alt="Preview" className="w-full h-auto max-h-48 object-cover" />
                          </div>
                        ) : (
                          <div className="relative" style={{ backgroundColor: slot.bgColor || '#0c3c1f', color: slot.textColor || '#ffffff' }}>
                            <span className="absolute top-2 right-2 bg-black/40 text-white text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">Publicidad</span>
                            <div className="flex flex-col sm:flex-row items-center gap-4 p-4">
                              <img src={slot.image} alt="Preview" className="w-full sm:w-1/3 h-32 object-cover rounded-lg" />
                              <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-base font-bold mb-1">{slot.title || 'Titulo'}</h3>
                                <p className="text-xs opacity-80 mb-2">{slot.description || 'Descripcion'}</p>
                                <span
                                  className="inline-block px-4 py-1.5 rounded text-xs font-bold"
                                  style={{ backgroundColor: slot.textColor || '#ffffff', color: slot.bgColor || '#0c3c1f' }}
                                >
                                  {slot.ctaText || 'CTA'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
