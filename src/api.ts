import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'TU_PROJECT_URL';
const SUPABASE_KEY = 'TU_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ═══ PROSPECTS ═══
export const fetchProspects = () =>
  supabase.from('prospects').select('*').order('seller');
export const upsertProspect = (data: any) =>
  supabase.from('prospects').upsert(data, { onConflict: 'id' });
export const deleteProspectDB = (id: string) =>
  supabase.from('prospects').delete().eq('id', id);
export const updateProspectStatus = (id: string, status: string) =>
  supabase.from('prospects').update({ status }).eq('id', id);

// ═══ SELLERS ═══
export const fetchSellers = () =>
  supabase.from('sellers').select('*').order('seller');
export const upsertSeller = (data: any) =>
  supabase.from('sellers').upsert(data, { onConflict: 'sid' });
export const deleteSellerDB = (sid: string) =>
  supabase.from('sellers').delete().eq('sid', sid);

// ═══ CUPOS ═══
export const fetchCupos = () => supabase.from('cupos').select('*');
export const upsertCupo = (data: any) =>
  supabase.from('cupos').upsert(data, { onConflict: 'gerencia' });

// ═══ PERFORMANCE (NUEVO V2) ═══

// Obtener datos agregados por seller para un período
export const fetchPerformanceAgg = async (desde: string, hasta: string) => {
  // Esta query devuelve métricas agregadas por seller
  const { data, error } = await supabase.rpc('get_seller_performance_agg', {
    p_desde: desde,
    p_hasta: hasta,
  });
  return { data, error };
};

// Obtener datos semanales agregados (para gráficos)
export const fetchPerformanceWeekly = async (desde: string, hasta: string) => {
  const { data, error } = await supabase.rpc('get_weekly_performance', {
    p_desde: desde,
    p_hasta: hasta,
  });
  return { data, error };
};

// Importar CSV raw (para carga manual)
export const insertPerformanceRows = async (rows: any[]) => {
  // Insertar en lotes de 500
  const batchSize = 500;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase.from('seller_performance').insert(batch);
    if (error) return { error };
  }
  return { error: null };
};
