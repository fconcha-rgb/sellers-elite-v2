import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kwwksilahgxqmycshocp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3d2tzaWxhaGd4cW15Y3Nob2NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NTI2MDUsImV4cCI6MjA5MTQyODYwNX0.FB8LA8Fybt9atSfhWHHzeRKG0UCY2UBieEaJ9DB8s8c';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ═══ PROSPECTS (V1) ═══
export const fetchProspects = () => supabase.from('prospects').select('*').order('seller');
export const upsertProspect = (data: any) => supabase.from('prospects').upsert(data, { onConflict: 'id' });
export const deleteProspectDB = (id: string) => supabase.from('prospects').delete().eq('id', id);
export const updateProspectStatus = (id: string, status: string) =>
  supabase.from('prospects').update({ status }).eq('id', id);

// ═══ SELLERS (V1) ═══
export const fetchSellers = () => supabase.from('sellers').select('*').order('seller');
export const upsertSeller = (data: any) => supabase.from('sellers').upsert(data, { onConflict: 'sid' });
export const deleteSellerDB = (sid: string) => supabase.from('sellers').delete().eq('sid', sid);

// ═══ CUPOS (V1) ═══
export const fetchCupos = () => supabase.from('cupos').select('*');
export const upsertCupo = (data: any) => supabase.from('cupos').upsert(data, { onConflict: 'gerencia' });

// ═══ PERFORMANCE (V2 NUEVO) ═══
export const fetchPerformanceAgg = async (desde: string, hasta: string) => {
  const { data, error } = await supabase.rpc('get_seller_performance_agg', {
    p_desde: desde,
    p_hasta: hasta,
  });
  return { data, error };
};

export const fetchPerformanceWeekly = async (desde: string, hasta: string) => {
  const { data, error } = await supabase.rpc('get_weekly_performance', {
    p_desde: desde,
    p_hasta: hasta,
  });
  return { data, error };
};

export const insertPerformanceRows = async (rows: any[]) => {
  const batchSize = 500;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase.from('seller_performance').insert(batch);
    if (error) return { error };
  }
  return { error: null };
};
