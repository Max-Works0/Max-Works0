'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Hackathon, Registration, Team } from '@/types';

export default function Dashboard() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    maxTeamSize: 4,
    status: 'registration' as const,
  });

  useEffect(() => {
    if (userData && userData.role !== 'admin' && userData.role !== 'organizer') {
      router.push('/');
      return;
    }
    loadDashboardData();
  }, [userData]);

  const loadDashboardData = async () => {
    try {
      const [hackathonsSnap, registrationsSnap, teamsSnap] = await Promise.all([
        getDocs(collection(db, 'hackathons')),
        getDocs(collection(db, 'registrations')),
        getDocs(collection(db, 'teams')),
      ]);

      setHackathons(hackathonsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Hackathon)));
      setRegistrations(registrationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration)));
      setTeams(teamsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team)));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHackathon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setCreating(true);
    try {
      const newHackathon: Omit<Hackathon, 'id'> = {
        name: formData.name,
        description: formData.description,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        registrationDeadline: new Date(formData.registrationDeadline),
        organizerId: user.uid,
        maxTeamSize: formData.maxTeamSize,
        status: formData.status,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addDoc(collection(db, 'hackathons'), newHackathon);
      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        registrationDeadline: '',
        maxTeamSize: 4,
        status: 'registration',
      });
      await loadDashboardData();
    } catch (error) {
      console.error('Error creating hackathon:', error);
      alert('Failed to create hackathon');
    } finally {
      setCreating(false);
    }
  };

  if (!userData || (userData.role !== 'admin' && userData.role !== 'organizer')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin or organizer privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            Create Hackathon
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">{hackathons.length}</div>
            <div className="text-gray-600">Total Hackathons</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">{teams.length}</div>
            <div className="text-gray-600">Total Teams</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">{registrations.length}</div>
            <div className="text-gray-600">Total Registrations</div>
          </div>
        </div>

        {/* Hackathons List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Hackathons</h2>
          {hackathons.length > 0 ? (
            <div className="space-y-4">
              {hackathons.map(hackathon => {
                const hackathonTeams = teams.filter(t => t.hackathonId === hackathon.id);
                const hackathonRegistrations = registrations.filter(r => r.hackathonId === hackathon.id);

                return (
                  <div key={hackathon.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{hackathon.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        hackathon.status === 'upcoming' ? 'bg-gray-100 text-gray-800' :
                        hackathon.status === 'registration' ? 'bg-blue-100 text-blue-800' :
                        hackathon.status === 'active' ? 'bg-green-100 text-green-800' :
                        hackathon.status === 'judging' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {hackathon.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{hackathon.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Max Team Size:</span>
                        <span className="ml-2 font-semibold">{hackathon.maxTeamSize}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Teams:</span>
                        <span className="ml-2 font-semibold">{hackathonTeams.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Registrations:</span>
                        <span className="ml-2 font-semibold">{hackathonRegistrations.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Participants:</span>
                        <span className="ml-2 font-semibold">
                          {hackathonTeams.reduce((sum, team) => sum + team.members.length, 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No hackathons created yet</p>
          )}
        </div>

        {/* Create Hackathon Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Create New Hackathon</h2>
              <form onSubmit={handleCreateHackathon} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hackathon Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Summer Code Jam 2024"
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
                    placeholder="Describe the hackathon..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Deadline
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Team Size
                    </label>
                    <input
                      type="number"
                      required
                      min={2}
                      max={10}
                      value={formData.maxTeamSize}
                      onChange={(e) => setFormData({ ...formData, maxTeamSize: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="registration">Registration Open</option>
                      <option value="active">Active</option>
                      <option value="judging">Judging</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
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
                    {creating ? 'Creating...' : 'Create Hackathon'}
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
