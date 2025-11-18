'use client';

import Link from 'next/link';
import { useHackathons } from '@/lib/hooks';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const { hackathons, loading } = useHackathons();
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Build Amazing Projects Together
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-100">
            Join hackathons, form teams, collaborate, and bring your ideas to life
          </p>
          <div className="flex gap-4 justify-center">
            {user ? (
              <>
                <Link
                  href="/register"
                  className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-100 transition shadow-lg"
                >
                  Register for Hackathon
                </Link>
                <Link
                  href="/teams"
                  className="bg-purple-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-900 transition shadow-lg"
                >
                  Browse Teams
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-100 transition shadow-lg"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="bg-purple-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-900 transition shadow-lg"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-purple-50 rounded-lg">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-2xl font-bold mb-2">Team Management</h3>
              <p className="text-gray-600">
                Create teams, invite members, and manage your hackathon squad with ease
              </p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-2xl font-bold mb-2">Collaboration Space</h3>
              <p className="text-gray-600">
                Share code, track progress, and work together on your projects
              </p>
            </div>
            <div className="p-6 bg-indigo-50 rounded-lg">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold mb-2">Easy Registration</h3>
              <p className="text-gray-600">
                Quick signup process to get you hacking in minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Hackathons */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Active Hackathons</h2>
          {loading ? (
            <div className="text-center">Loading hackathons...</div>
          ) : hackathons.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hackathons
                .filter(h => h.status === 'registration' || h.status === 'active')
                .map(hackathon => (
                  <div key={hackathon.id} className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold mb-2">{hackathon.name}</h3>
                    <p className="text-gray-600 mb-4">{hackathon.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className="font-semibold capitalize">{hackathon.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Max Team Size:</span>
                        <span className="font-semibold">{hackathon.maxTeamSize}</span>
                      </div>
                    </div>
                    <Link
                      href="/register"
                      className="mt-4 block w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-center"
                    >
                      Register Now
                    </Link>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p className="text-xl mb-4">No active hackathons at the moment</p>
              <p>Check back soon for upcoming events!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
