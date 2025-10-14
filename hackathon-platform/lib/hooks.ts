import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { Team, Hackathon, User } from '@/types';

export const useTeam = (teamId?: string) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, 'teams'),
      (snapshot) => {
        const teamDoc = snapshot.docs.find(doc => doc.id === teamId);
        if (teamDoc) {
          setTeam({ id: teamDoc.id, ...teamDoc.data() } as Team);
        }
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [teamId]);

  return { team, loading };
};

export const useTeams = (hackathonId?: string) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = hackathonId
      ? query(collection(db, 'teams'), where('hackathonId', '==', hackathonId))
      : collection(db, 'teams');

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teamsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Team[];
      setTeams(teamsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [hackathonId]);

  return { teams, loading };
};

export const useHackathons = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'hackathons'), (snapshot) => {
      const hackathonsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Hackathon[];
      setHackathons(hackathonsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { hackathons, loading };
};
