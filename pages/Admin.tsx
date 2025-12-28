
import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, collection, addDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { AppSettings, Memory } from '../types';
import { Settings, Image as ImageIcon, Plus, Trash2, Save, Music, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const Admin: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    loveStartDate: '',
    avatar1: '',
    avatar2: '',
    bgImage: '',
    bgMusic: '',
  });
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [newMemory, setNewMemory] = useState({ title: '', description: '', imageUrl: '' });
  const [isAddingMemory, setIsAddingMemory] = useState(false);

  useEffect(() => {
    // Load current settings
    const loadSettings = async () => {
      const docSnap = await getDoc(doc(db, 'settings', 'main'));
      if (docSnap.exists()) {
        setSettings(docSnap.data() as AppSettings);
      }
    };
    loadSettings();

    // Sync memories
    const q = query(collection(db, 'memories'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const items: Memory[] = [];
      snap.forEach((d) => items.push({ id: d.id, ...d.data() } as Memory));
      setMemories(items);
    });

    return () => unsub();
  }, []);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await setDoc(doc(db, 'settings', 'main'), settings);
      alert('Settings updated successfully!');
    } catch (err) {
      alert('Error updating settings: ' + err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingMemory(true);
    try {
      await addDoc(collection(db, 'memories'), {
        ...newMemory,
        createdAt: serverTimestamp(),
      });
      setNewMemory({ title: '', description: '', imageUrl: '' });
    } catch (err) {
      alert('Error adding memory: ' + err);
    } finally {
      setIsAddingMemory(false);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      await deleteDoc(doc(db, 'memories', id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 space-y-12">
      <h2 className="text-4xl font-serif-elegant font-bold text-gray-800 border-b-2 border-rose-100 pb-4">Admin Dashboard</h2>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Settings Form */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2 text-rose-500">
            <Settings className="w-6 h-6" />
            <h3 className="text-xl font-bold">App Configuration</h3>
          </div>
          
          <form onSubmit={handleUpdateSettings} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Love Start Date</label>
                <input 
                  type="date"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none"
                  value={settings.loveStartDate}
                  onChange={(e) => setSettings({...settings, loveStartDate: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Avatar 1 URL</label>
                  <input 
                    type="url"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none text-xs"
                    value={settings.avatar1}
                    onChange={(e) => setSettings({...settings, avatar1: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Avatar 2 URL</label>
                  <input 
                    type="url"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none text-xs"
                    value={settings.avatar2}
                    onChange={(e) => setSettings({...settings, avatar2: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1 flex items-center">
                  <ImageIcon className="w-4 h-4 mr-2" /> Background Image URL
                </label>
                <input 
                  type="url"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none text-xs"
                  value={settings.bgImage}
                  onChange={(e) => setSettings({...settings, bgImage: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1 flex items-center">
                  <Music className="w-4 h-4 mr-2" /> Background Music URL (.mp3)
                </label>
                <input 
                  type="url"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none text-xs"
                  value={settings.bgMusic}
                  onChange={(e) => setSettings({...settings, bgMusic: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSavingSettings}
              className="w-full flex items-center justify-center space-x-2 bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-100 transition-all disabled:opacity-50"
            >
              {isSavingSettings ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span>Save Changes</span>
            </button>
          </form>
        </section>

        {/* Memories Management */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-rose-500">
              <Plus className="w-6 h-6" />
              <h3 className="text-xl font-bold">Add New Memory</h3>
            </div>
          </div>

          <form onSubmit={handleAddMemory} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <input 
              type="text"
              placeholder="Memory Title"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none"
              value={newMemory.title}
              onChange={(e) => setNewMemory({...newMemory, title: e.target.value})}
            />
            <textarea 
              placeholder="What happened? Share the story..."
              required
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none"
              value={newMemory.description}
              onChange={(e) => setNewMemory({...newMemory, description: e.target.value})}
            />
            <input 
              type="url"
              placeholder="Image URL (optional)"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none text-xs"
              value={newMemory.imageUrl}
              onChange={(e) => setNewMemory({...newMemory, imageUrl: e.target.value})}
            />
            <button 
              type="submit"
              disabled={isAddingMemory}
              className="w-full flex items-center justify-center space-x-2 bg-rose-400 hover:bg-rose-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-50 transition-all disabled:opacity-50"
            >
              {isAddingMemory ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              <span>Capture Memory</span>
            </button>
          </form>

          {/* List of Memories for editing/deleting */}
          <div className="space-y-4 mt-8">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest px-2">Recent Memories</h4>
            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
              {memories.map(m => (
                <div key={m.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-rose-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={m.imageUrl || 'https://picsum.photos/100'} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{m.title}</p>
                      <p className="text-xs text-gray-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {m.createdAt ? format(m.createdAt.toDate(), 'MMM dd, yyyy') : '...'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteMemory(m.id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {memories.length === 0 && <p className="text-center py-8 text-gray-300 italic text-sm">No memories to manage.</p>}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admin;
