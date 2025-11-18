'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { Team, User } from '@/types';
import Link from 'next/link';

export default function TeamDetail() {
  const params = useParams();
  const router = useRouter();
  const { user, userData } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [projectData, setProjectData] = useState({
    projectName: '',
    projectDescription: '',
    githubRepo: '',
    demoUrl: '',
  });

  useEffect(() => {
    loadTeam();
  }, [params.id]);

  const loadTeam = async () => {
    try {
      const teamDoc = await getDoc(doc(db, 'teams', params.id as string));
      if (teamDoc.exists()) {
        const teamData = { id: teamDoc.id, ...teamDoc.data() } as Team;
        setTeam(teamData);
        setProjectData({
          projectName: teamData.projectName || '',
          projectDescription: teamData.projectDescription || '',
          githubRepo: teamData.githubRepo || '',
          demoUrl: teamData.demoUrl || '',
        });

        // Load member details
        const memberPromises = teamData.members.map(memberId =>
          getDoc(doc(db, 'users', memberId))
        );
        const memberDocs = await Promise.all(memberPromises);
        const memberData = memberDocs
          .filter(doc => doc.exists())
          .map(doc => ({ id: doc.id, ...doc.data() } as User));
        setMembers(memberData);
      }
    } catch (error) {
      console.error('Error loading team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async () => {
    if (!user || !team) return;

    try {
      await updateDoc(doc(db, 'teams', team.id), {
        members: arrayUnion(user.uid),
      });
      await loadTeam();
    } catch (error) {
      console.error('Error joining team:', error);
      alert('Failed to join team');
    }
  };

  const handleLeaveTeam = async () => {
    if (!user || !team) return;

    if (team.ownerId === user.uid) {
      alert('Team owner cannot leave. Transfer ownership or delete the team.');
      return;
    }

    try {
      await updateDoc(doc(db, 'teams', team.id), {
        members: arrayRemove(user.uid),
      });
      router.push('/teams');
    } catch (error) {
      console.error('Error leaving team:', error);
      alert('Failed to leave team');
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;

    try {
      await updateDoc(doc(db, 'teams', team.id), {
        ...projectData,
        updatedAt: new Date(),
      });
      setEditMode(false);
      await loadTeam();
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading team...</div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Team not found</h1>
          <Link href="/teams" className="text-purple-600 hover:text-purple-700">
            Back to Teams
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.uid === team.ownerId;
  const isMember = user && team.members.includes(user.uid);
  const canJoin = !isMember && team.members.length < team.maxMembers && team.status === 'forming';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/teams" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
          ← Back to Teams
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Team Header */}
          <div className="border-b pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{team.name}</h1>
                <p className="text-gray-600">{team.description}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                team.status === 'forming' ? 'bg-yellow-100 text-yellow-800' :
                team.status === 'active' ? 'bg-green-100 text-green-800' :
                team.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {team.status}
              </span>
            </div>
          </div>

          {/* Team Members */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Team Members ({members.length}/{team.maxMembers})
            </h2>
            <div className="space-y-2">
              {members.map(member => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                  {member.id === team.ownerId && (
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Owner
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-6">
            {canJoin && (
              <button
                onClick={handleJoinTeam}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Join Team
              </button>
            )}
            {isMember && !isOwner && (
              <button
                onClick={handleLeaveTeam}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Leave Team
              </button>
            )}
          </div>

          {/* Project Information */}
          {isMember && (
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Project Details</h2>
                {isOwner && !editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                  >
                    Edit
                  </button>
                )}
              </div>

              {editMode ? (
                <form onSubmit={handleUpdateProject} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={projectData.projectName}
                      onChange={(e) => setProjectData({ ...projectData, projectName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="My Awesome Project"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Description
                    </label>
                    <textarea
                      value={projectData.projectDescription}
                      onChange={(e) => setProjectData({ ...projectData, projectDescription: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      rows={4}
                      placeholder="Describe your project..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub Repository
                    </label>
                    <input
                      type="url"
                      value={projectData.githubRepo}
                      onChange={(e) => setProjectData({ ...projectData, githubRepo: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Demo URL
                    </label>
                    <input
                      type="url"
                      value={projectData.demoUrl}
                      onChange={(e) => setProjectData({ ...projectData, demoUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="https://demo.example.com"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  {team.projectName ? (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Project Name</p>
                        <p className="font-semibold">{team.projectName}</p>
                      </div>
                      {team.projectDescription && (
                        <div>
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="text-gray-700">{team.projectDescription}</p>
                        </div>
                      )}
                      {team.githubRepo && (
                        <div>
                          <p className="text-sm text-gray-500">GitHub Repository</p>
                          <a
                            href={team.githubRepo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-700"
                          >
                            {team.githubRepo}
                          </a>
                        </div>
                      )}
                      {team.demoUrl && (
                        <div>
                          <p className="text-sm text-gray-500">Demo URL</p>
                          <a
                            href={team.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-700"
                          >
                            {team.demoUrl}
                          </a>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500 italic">No project details yet</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
