import { useState, useEffect } from 'react';
import { supabase, ROLES } from '../lib/supabase';
import { encrypt, decrypt } from '../lib/crypto';

export function useSyncUs(isAuthenticated, userRole) {
  const [loading, setLoading] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [streamItems, setStreamItems] = useState([]);
  const [myStatus, setMyStatus] = useState('STEADY');
  const [partnerStatus, setPartnerStatus] = useState('STEADY');

  const MY_ID = userRole === 'PRIMARY' ? ROLES.PRIMARY : ROLES.PARTNER;
  const PARTNER_ID = userRole === 'PRIMARY' ? ROLES.PARTNER : ROLES.PRIMARY;

  const fetchData = async () => {
    const { data: ch } = await supabase.from('chapters').select('*').order('created_at', { ascending: false });
    const { data: st } = await supabase.from('user_protocols').select('*');
    const { data: sm } = await supabase.from('stream').select('*').order('created_at', { ascending: false });
    
    if (ch) setChapters(ch);
    if (sm) setStreamItems(sm.map(item => ({ ...item, content: decrypt(item.content) })));
    if (st) {
      setPartnerStatus(st.find(u => u.user_id === PARTNER_ID)?.current_status || 'STEADY');
      setMyStatus(st.find(u => u.user_id === MY_ID)?.current_status || 'STEADY');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      const channel = supabase.channel('sync_updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'user_protocols' }, fetchData)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'stream' }, fetchData)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chapters' }, fetchData)
        .subscribe();
      return () => supabase.removeChannel(channel);
    }
  }, [isAuthenticated, userRole]);

  const updateStatus = async (s) => {
    setMyStatus(s);
    await supabase.from('user_protocols').update({ current_status: s }).eq('user_id', MY_ID);
  };

  return { loading, chapters, streamItems, myStatus, partnerStatus, MY_ID, PARTNER_ID, updateStatus, fetchData };
}