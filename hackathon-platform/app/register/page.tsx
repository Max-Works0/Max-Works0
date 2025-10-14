'use client';

import { useState } from 'react';
import { useHackathons } from '@/lib/hooks';
import { useAuth } from '@/lib/auth-context';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Registration } from '@/types';
import { useRouter } from 'next/navigation';

export default function Register() {
  const { hackathons, loading } = useHackathons();
  const { user, userData } = useAuth();
  const router = useRouter();
  const [selectedHackathon, setSelectedHackathon] = useState('');
  const [registering, setRegistering] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userData || !selectedHackathon) return;

    setRegistering(true);
    try {
      // Check if already registered
      const q = query(
        collection(db, 'registrations'),
        where('userId', '==', user.uid),
        where('hackathonId', '==', selectedHackathon)
      );
      const existingRegistrations = await getDocs(q);

      if (!existingRegistrations.empty) {
        alert('You are already registered for this hackathon!');
        return;
      }

      const newRegistration: Omit<Registration, 'id'> = {
        userId: user.uid,
        hackathonId: selectedHackathon,
        teamId: userData.teamId,
        status: 'approved',
        registeredAt: new Date(),
      };

      await addDoc(collection(db, 'registrations'), newRegistration);
      alert('Registration successful!');
      router.push('/teams');
    } catch (error) {
      console.error('Error registering:', error);
      alert('Failed to register');
    } finally {
      setRegistering(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Please login to register
          </h1>
          <a
            href="/login"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition inline-block"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Register for Hackathon</h1>

        {loading ? (
          <div className="text-center">Loading hackathons...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Hackathon
                </label>
                <select
                  required
                  value={selectedHackathon}
                  onChange={(e) => setSelectedHackathon(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="">Choose a hackathon...</option>
                  {hackathons
                    .filter(h => h.status === 'registration' || h.status === 'active')
                    .map(hackathon => (
                      <option key={hackathon.id} value={hackathon.id}>
                        {hackathon.name} - {hackathon.status}
                      </option>
                    ))}
                </select>
              </div>

              {selectedHackathon && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Hackathon Details</h3>
                  {hackathons
                    .filter(h => h.id === selectedHackathon)
                    .map(hackathon => (
                      <div key={hackathon.id} className="space-y-2 text-sm">
                        <p><strong>Description:</strong> {hackathon.description}</p>
                        <p><strong>Max Team Size:</strong> {hackathon.maxTeamSize} members</p>
                        <p><strong>Status:</strong> <span className="capitalize">{hackathon.status}</span></p>
                      </div>
                    ))}
                </div>
              )}

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2">📝 Registration Info</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
                  <li>You can join or create a team after registration</li>
                  <li>Teams must meet the hackathon's max team size requirements</li>
                  <li>You can update your team and project details anytime</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={registering || !selectedHackathon}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registering ? 'Registering...' : 'Complete Registration'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
