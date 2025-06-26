'use client';

import { useAccount } from 'wagmi';
import { useLeaderboard } from '../hooks/useLeaderboard';

export default function Leaderboard() {
  const { address } = useAccount();
  const { leaderboard, userRank, loading, error, refetch } = useLeaderboard(10);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const isCurrentUser = (userAddress: string) => {
    return address?.toLowerCase() === userAddress.toLowerCase();
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4">🏆 Leaderboard</h2>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                <div className="w-32 h-4 bg-white/20 rounded"></div>
              </div>
              <div className="w-16 h-4 bg-white/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4">🏆 Leaderboard</h2>
        <div className="text-red-400 text-center py-8">
          <p>{error}</p>
          <button 
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">🏆 Leaderboard</h2>
        <button 
          onClick={refetch}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Current User Position */}
      {userRank && userRank.rank > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold text-sm">
                #{userRank.rank}
              </div>
              <div>
                <p className="font-medium text-blue-300">Your Position</p>
                <p className="text-sm text-white/60">
                  {userRank.score} click{userRank.score === 1 ? '' : 's'} • {userRank.totalUsers} players
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-white">
                {userRank.score.toLocaleString()}
              </div>
              <div className="text-xs text-white/60">
                clicks
              </div>
            </div>
          </div>
        </div>
      )}
      
      {leaderboard.length === 0 ? (
        <div className="text-center py-8 text-white/60">
          <p>No players in leaderboard yet</p>
          <p className="text-sm mt-2">Start clicking to appear here!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <div 
              key={entry.address}
              className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                isCurrentUser(entry.address) 
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/50' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-black font-bold text-lg">
                  {getRankIcon(entry.rank)}
                </div>
                <div>
                  <p className={`font-medium ${
                    isCurrentUser(entry.address) ? 'text-blue-300' : 'text-white'
                  }`}>
                    {formatAddress(entry.address)}
                    {isCurrentUser(entry.address) && (
                      <span className="ml-2 text-xs bg-blue-500 px-2 py-1 rounded-full">You</span>
                    )}
                  </p>
                  <p className="text-sm text-white/60">
                    {entry.score} click{entry.score === 1 ? '' : 's'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {entry.score.toLocaleString()}
                </div>
                <div className="text-xs text-white/60">
                  clicks
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-white/20">
        <p className="text-xs text-white/40 text-center">
          Leaderboard updates automatically every 30 seconds
        </p>
      </div>
    </div>
  );
} 