'use client';

import { Team } from '@/types';
import Link from 'next/link';

interface TeamCardProps {
  team: Team;
}

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">{team.name}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          team.status === 'forming' ? 'bg-yellow-100 text-yellow-800' :
          team.status === 'active' ? 'bg-green-100 text-green-800' :
          team.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {team.status}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4">{team.description}</p>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Members:</span>
          <span className="font-semibold">{team.members.length} / {team.maxMembers}</span>
        </div>
        
        {team.projectName && (
          <div className="flex justify-between">
            <span className="text-gray-500">Project:</span>
            <span className="font-semibold">{team.projectName}</span>
          </div>
        )}
      </div>

      <div className="mt-6 flex space-x-2">
        <Link 
          href={`/teams/${team.id}`}
          className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-center"
        >
          View Details
        </Link>
        {team.members.length < team.maxMembers && team.status === 'forming' && (
          <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            Join Team
          </button>
        )}
      </div>
    </div>
  );
}
