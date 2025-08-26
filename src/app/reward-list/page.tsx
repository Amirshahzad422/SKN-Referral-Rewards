'use client';

type RewardRow = {
  team: string;
  rank: string;
  reward: string;
  status: 'Non-active' | 'Active';
};

const rows: RewardRow[] = [
  { team: '30/30', rank: '1 Star', reward: 'Rs. 200', status: 'Non-active' },
  { team: '50/50', rank: '2 Star', reward: 'Rs. 500', status: 'Non-active' },
  { team: '100/100', rank: '3 Star', reward: 'Rs. 1,500', status: 'Non-active' },
  { team: '500/500', rank: '4 Star', reward: 'Rs. 20,000', status: 'Non-active' },
  { team: '2,500/2,500', rank: '5 Star', reward: 'Rs. 40,000', status: 'Non-active' },
  { team: '5,000/5,000', rank: '6 Star', reward: 'Rs. 80,000', status: 'Non-active' },
  { team: '10,000/10,000', rank: '7 Star', reward: 'Rs. 1,50,000', status: 'Non-active' },
  { team: '20,000/20,000', rank: '8 Star', reward: 'Rs. 3,00,000', status: 'Non-active' },
  { team: '30,000/30,000', rank: '9 Star', reward: 'Rs. 5,00,000', status: 'Non-active' },
  { team: '50,000/50,000', rank: '10 Star', reward: 'Rs. 10,00,000', status: 'Non-active' },
  { team: '100,000/100,000', rank: '11 Star', reward: 'Rs. 20,00,000', status: 'Non-active' },
];

import { useMemo, useState } from 'react';

export default function RewardList() {
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.ceil(rows.length / pageSize);

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="text-sm text-gray-600 mb-2">Home / Reward List</div>
        <h1 className="text-3xl font-bold text-gray-900">Reward List</h1>
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Top gradient bar matching screenshot */}
        <div className="relative mb-4">
          <div className="h-14 rounded-t-xl bg-gradient-to-r from-blue-500 to-blue-700 shadow-md flex items-center px-6 text-white font-semibold">
            Ranks & Rewards
          </div>
          <div className="rounded-b-xl bg-white shadow-sm"></div>
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-gray-500 text-xs uppercase tracking-wider bg-gray-50">
                  <th className="px-6 py-4">Team</th>
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Reward</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r, idx) => (
                  <tr key={`${r.rank}-${idx}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{r.team}</td>
                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{r.rank}</td>
                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{r.reward}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-gray-200 text-gray-700 text-xs px-3 py-1">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`w-8 h-8 rounded-full border text-sm ${page === 1 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 bg-white'}`}
            disabled={page === 1}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-full text-sm ${page === i + 1 ? 'bg-deep-indigo text-white' : 'bg-white border text-gray-700'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={`w-8 h-8 rounded-full border text-sm ${page === totalPages ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 bg-white'}`}
            disabled={page === totalPages}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
} 