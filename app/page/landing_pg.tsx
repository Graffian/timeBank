"use client";
import React, { useState } from 'react';
import { Clock, Search, Star } from 'lucide-react';
import { useRouter } from 'next/navigation'

export default function TimeBankLanding() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  
  const allSkills = [
    { skill: 'JavaScript Help', mins: 60, student: 'Alex K.', rating: 4.9, tags: ['JS', 'React', 'Web Dev'] },
    { skill: 'Calculus Tutoring', mins: 45, student: 'Sarah M.', rating: 5.0, tags: ['Math', 'Calculus'] },
    { skill: 'Physics Revision', mins: 60, student: 'Mike R.', rating: 4.8, tags: ['Physics', 'STEM'] },
    { skill: 'Guitar Basics', mins: 30, student: 'Emma L.', rating: 4.7, tags: ['Music', 'Guitar'] },
    { skill: 'Interview Prep', mins: 45, student: 'Jordan P.', rating: 5.0, tags: ['Career', 'Interview'] },
    { skill: 'React Components', mins: 60, student: 'Chris T.', rating: 4.9, tags: ['React', 'JS', 'Frontend'] },
    { skill: 'Spanish Conversation', mins: 30, student: 'Maria G.', rating: 4.8, tags: ['Spanish', 'Language'] },
    { skill: 'Excel Formulas', mins: 45, student: 'David W.', rating: 4.6, tags: ['Excel', 'Data'] },
  ];

  const filteredSkills = searchQuery.trim() === '' 
    ? allSkills 
    : allSkills.filter(s => 
        s.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );

    function signupclicked(){
    router.push('/auth/SignUp');
  }

    function loginclicked(){
    router.push('/auth');
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="px-6 py-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-7 h-7 text-indigo-400" />
            <span className="text-xl font-bold">TimeBank</span>
          </div>
          <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-gray-300 hover:text-white font-medium transition cursor-pointer" onClick={loginclicked}>
            Log In
          </button>
          <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition cursor-pointer" onClick={signupclicked}>
            Sign Up
          </button>
          </div>
        </div>
      </nav>

      {/* Hero + Search */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">Time Banking for Students</h1>
          <p className="text-gray-400 text-lg">Trade your skills, get help instantly</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search skills... (e.g., React, calculus, excel)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex gap-4 justify-center mb-12">
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition cursor-pointer" onClick={signupclicked}>
            Sign Up Free
          </button>
          <button className="px-6 py-3 border border-gray-700 hover:border-gray-600 rounded-lg font-semibold transition">
            Post Your Skill
          </button>
        </div>
      </section>

      {/* Why TimeBank Section */}
      <section className="px-6 pb-16 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Why TimeBank?</h2>
          <p className="text-gray-400 text-lg">The smartest way to learn and earn as a student</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-indigo-500 transition flex items-start gap-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">No Money Required</h3>
              <p className="text-gray-400">
                Trade your time and skills instead of cash. Every hour you teach equals an hour you can learn—completely free.
              </p>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-indigo-500 transition flex items-start gap-6">
            <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Star className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Learn Anything</h3>
              <p className="text-gray-400">
                From coding to calculus, guitar to graphic design. Connect with students who excel in what you need help with.
              </p>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-indigo-500 transition flex items-start gap-6">
            <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Instant Matching</h3>
              <p className="text-gray-400">
                Search by skill, browse available sessions, and book help within minutes. Get answers when you need them most.
              </p>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-indigo-500 transition flex items-start gap-6">
            <div className="w-16 h-16 bg-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">🎯</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Build Your Skills</h3>
              <p className="text-gray-400">
                Teaching others is the best way to master a subject. Reinforce what you know while helping your peers succeed.
              </p>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-indigo-500 transition flex items-start gap-6">
            <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">🤝</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Student Community</h3>
              <p className="text-gray-400">
                Connect with fellow students who get your struggles. Learn in a judgment-free, supportive environment.
              </p>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-indigo-500 transition flex items-start gap-6">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">⚡</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Fair & Balanced</h3>
              <p className="text-gray-400">
                Automatic time tracking ensures every minute is accounted for. Give an hour, get an hour—it's that simple.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}