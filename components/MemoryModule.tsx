import React, { useState, useMemo } from 'react';
import { Memory } from '../types';
import { FiArchive, FiX, FiSearch, FiTrash2, FiClock } from 'react-icons/fi';

const MemoryCard: React.FC<{ memory: Memory; onDelete: (id: number) => void }> = ({ memory, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="text-md font-semibold text-indigo-600 dark:text-indigo-400 mb-2 pr-8">
            "{memory.summary}"
        </h3>
        <button onClick={() => onDelete(memory.id)} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
          <FiTrash2 size={16} />
        </button>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 italic">
        {memory.content}
      </p>
      <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
        <FiClock size={12} className="mr-1.5" />
        <span>{new Date(memory.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
};

const MemoryModule: React.FC<{ 
    memories: Memory[];
    setMemories: React.Dispatch<React.SetStateAction<Memory[]>>;
    isMemoryLoading: boolean;
}> = ({ memories, setMemories }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMemories = useMemo(() => {
    if (!searchTerm.trim()) return memories;
    return memories.filter(
      (m) =>
        m.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [memories, searchTerm]);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this memory?")) {
        setMemories(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-3"><FiArchive /> Memory</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">A searchable archive of all the key insights you've saved.</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search memories..."
          className="w-full p-3 pl-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
         {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <FiX />
          </button>
        )}
      </div>

      {/* Memories List */}
      <div className="flex-grow overflow-y-auto pr-2">
        {memories.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-gray-500 pt-16">
            <FiArchive size={48} className="mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Memory is Empty</h2>
            <p>In the 'Converse' module, use the archive button on an AI response to save it here.</p>
          </div>
        ) : filteredMemories.length === 0 ? (
            <div className="text-center text-gray-400 dark:text-gray-500 pt-16">
                <h2 className="text-xl font-semibold">No memories found for "{searchTerm}"</h2>
            </div>
        ) : (
          <div className="space-y-4">
            {filteredMemories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryModule;
