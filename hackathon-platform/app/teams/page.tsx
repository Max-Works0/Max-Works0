'use client';

import { useState } from 'react';
import { useTeams } from '@/lib/hooks';
import { useAuth } from '@/lib/auth-context';
import TeamCard from '@/components/TeamCard';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Team } from '@/types';

export default function Teams() {
  const { teams, loading } = useTeams();
  const { user, userData } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxMembers: 4,
  });
  const [creating, setCreating] = useState(false);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userData) return;

    setCreating(true);
    try {
      const newTeam: Omit<Team, 'id'> = {
        name: formData.name,
        description: formData.description,
        ownerId: user.uid,
        members: [user.uid],
        maxMembers: formData.maxMembers,
        status: 'forming',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addDoc(collection(db, 'teams'), newTeam);
      setShowCreateModal(false);
      setFormData({ name: '', description: '', maxMembers: 4 });
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Failed to create team');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Teams</h1>
          {user && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              Create Team
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Loading teams...</div>
        ) : teams.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map(team => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 py-12">
            <p className="text-xl mb-4">No teams yet</p>
            <p>Be the first to create a team!</p>
          </div>
        )}

        {/* Create Team Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6">Create New Team</h2>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Awesome Team"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    rows={3}
                    placeholder="What's your team about?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Members
                  </label>
                  <input
                    type="number"
                    required
                    min={2}
                    max={10}
                    value={formData.maxMembers}
                    onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    {creating ? 'Creating...' : 'Create Team'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
