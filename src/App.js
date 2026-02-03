import React, { useState } from 'react';
import { supabase } from './lib/supabase';
import { encrypt } from './lib/crypto';
import { useSyncUs } from './hooks/useSyncUs'; 

// Modular Components & Views
import LoginGate from './components/LoginGate';
import Header from './components/Header';
import ProtocolSidebar from './components/ProtocolSidebar';
import Dashboard from './views/Dashboard';
import Stream from './views/Stream';
import Vault from './views/Vault';

const LINK_PREVIEW_KEY = process.env.REACT_APP_LINKPREVIEW_KEY;

export default function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('user_role')); 
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('lab_access') === 'granted');
  const [view, setView] = useState('DASHBOARD');
  const [activeChapterId, setActiveChapterId] = useState(null);

  const lab = useSyncUs(isAuthenticated, userRole);

  const handleLogout = () => {
    localStorage.removeItem('lab_access');
    localStorage.removeItem('user_role');
    setIsAuthenticated(false);
    setUserRole(null);
    window.location.reload(); 
  };

  const handlePostStream = async (text, forcedType = null) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const foundUrl = text.match(urlRegex);
    let preview = null;

    if (foundUrl && !forcedType) {
      try {
        const res = await fetch(`https://api.linkpreview.net/?key=${LINK_PREVIEW_KEY}&q=${foundUrl[0]}`);
        if (res.ok) preview = await res.json();
      } catch (err) { console.error("Metadata fetch failed", err); }
    }

    const encryptedContent = encrypt(text.trim());
    await supabase.from('stream').insert([{
      content: encryptedContent, 
      user_id: lab.MY_ID,
      type: forcedType || (foundUrl ? 'link' : 'thought'),
      preview_data: preview
    }]);

    lab.fetchData(); 
  };

  const handleCreateProject = async (title) => {
    await supabase.from('chapters').insert([{ title, progress: 0, milestones: [], consent_status: 'PENDING' }]);
    handlePostStream(`New project initialized: ${title}`, 'SYSTEM');
    lab.fetchData();
  };

  // ✅ SILENCED VERSION: Only notifies on status changes, not progress/milestones
  const handleUpdateChapter = async (id, updates) => {
    await supabase.from('chapters').update(updates).eq('id', id);
    
    const chapter = lab.chapters.find(c => c.id === id);
    
    // Only post to stream if the status is Confirmed or Alternative
    if (updates.consent_status) {
      handlePostStream(`${chapter?.title} status set to: ${updates.consent_status}`, 'SYSTEM');
    }

    lab.fetchData();
  };

  const handleDeleteChapter = async (id) => {
    const chapter = lab.chapters.find(c => c.id === id);
    if (!window.confirm(`Terminate protocol: ${chapter?.title}? This action is irreversible.`)) return;

    await supabase.from('chapters').delete().eq('id', id);
    handlePostStream(`Protocol terminated: ${chapter?.title}`, 'SYSTEM');
    setActiveChapterId(null); 
    lab.fetchData();
  };

  const handleDeleteStream = async (id) => {
    await supabase.from('stream').delete().eq('id', id);
    lab.fetchData();
  };

  if (!isAuthenticated) return (
    <LoginGate onAuth={(role) => {
      localStorage.setItem('lab_access', 'granted');
      localStorage.setItem('user_role', role);
      setUserRole(role);
      setIsAuthenticated(true);
    }} />
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-600 font-sans">
      <div className="max-w-5xl mx-auto p-6 md:p-10">
        <Header 
          userRole={userRole}
          myStatus={lab.myStatus}
          partnerStatus={lab.partnerStatus}
          onStatusChange={lab.updateStatus}
          currentView={view}
          setView={setView}
          onLogout={handleLogout} 
        />

        {view === 'DASHBOARD' && (
          <Dashboard 
            chapters={lab.chapters} 
            loading={lab.loading} 
            onCreate={handleCreateProject} 
            onOpen={setActiveChapterId} 
          />
        )}

        {view === 'STREAM' && (
          <Stream 
            items={lab.streamItems} 
            onPost={handlePostStream} 
            onDelete={handleDeleteStream} 
            myId={lab.MY_ID} 
            userRole={userRole} 
            loading={lab.loading} 
          />
        )}

        {view === 'VAULT' && <Vault />}
      </div>

      {activeChapterId && (
        <ProtocolSidebar 
          chapter={lab.chapters.find(c => c.id === activeChapterId)}
          onClose={() => setActiveChapterId(null)}
          onUpdate={handleUpdateChapter}
          onDelete={handleDeleteChapter}
        />
      )}
    </div>
  );
}