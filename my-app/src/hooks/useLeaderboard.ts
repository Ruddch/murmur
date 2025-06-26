import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CLICKER_ADDRESS, CLICKER_ABI } from '@/contracts/Clicker';

export interface LeaderboardEntry {
  address: string;
  score: number;
  rank: number;
}

export interface UserRank {
  rank: number;
  score: number;
  totalUsers: number;
}

export function useLeaderboard(count: number = 10) {
  const { address } = useAccount();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<UserRank | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read leaderboard data
  const { data: leaderboardData, refetch: refetchLeaderboard } = useReadContract({
    address: CLICKER_ADDRESS,
    abi: CLICKER_ABI,
    functionName: 'getLeaderboard',
    args: [BigInt(count)],
  });

  // Read user rank
  const { data: userRankData, refetch: refetchUserRank } = useReadContract({
    address: CLICKER_ADDRESS,
    abi: CLICKER_ABI,
    functionName: 'getUserRank',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });

  // Read total users
  const { data: totalUsers, refetch: refetchTotalUsers } = useReadContract({
    address: CLICKER_ADDRESS,
    abi: CLICKER_ABI,
    functionName: 'getTotalUsers',
  });

  // Process leaderboard data
  useEffect(() => {
    if (leaderboardData) {
      const [topUsers, topScores] = leaderboardData as [string[], bigint[]];
      const entries: LeaderboardEntry[] = topUsers.map((userAddress: string, index: number) => ({
        address: userAddress,
        score: Number(topScores[index]),
        rank: index + 1
      }));
      setLeaderboard(entries);
      setLoading(false);
      setError(null);
    }
  }, [leaderboardData]);

  // Process user rank data
  useEffect(() => {
    if (userRankData && totalUsers) {
      const [rank, score] = userRankData as [bigint, bigint];
      setUserRank({
        rank: Number(rank),
        score: Number(score),
        totalUsers: Number(totalUsers)
      });
    }
  }, [userRankData, totalUsers]);

  // Handle errors
  useEffect(() => {
    if (leaderboardData === undefined && !loading) {
      setError('Failed to load leaderboard');
    }
  }, [leaderboardData, loading]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchLeaderboard();
      refetchUserRank();
      refetchTotalUsers();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [refetchLeaderboard, refetchUserRank, refetchTotalUsers]);

  return {
    leaderboard,
    userRank,
    loading,
    error,
    refetch: () => {
      refetchLeaderboard();
      refetchUserRank();
      refetchTotalUsers();
    }
  };
} 