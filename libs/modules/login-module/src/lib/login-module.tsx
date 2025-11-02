import { useState } from 'react';

/* eslint-disable-next-line */
export interface LoginModuleProps {}

export function LoginModule(props: LoginModuleProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { fullName, email, password });
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col lg:flex-row">
      {/* Left Panel - Mobile Preview Section */}
      <div className="w-full lg:w-1/2 bg-[#000000] p-6 lg:p-12 flex items-center justify-center relative min-h-[400px] lg:min-h-screen">
        <div className="relative w-full max-w-[320px] md:max-w-[400px] h-[600px] md:h-[700px]">
          {/* Mobile Device Frame */}
          <div className="absolute inset-0 bg-[#0F0F0F] rounded-[40px] shadow-2xl p-4">
            <div className="w-full h-full bg-[#1A1A1A] rounded-[32px] overflow-hidden relative">
              {/* Card 1 - Revenue Card */}
              <div
                className="absolute top-[10%] left-[5%] w-[45%] p-3 rounded-2xl shadow-lg"
                style={{
                  background:
                    'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)',
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] bg-white/30 px-2 py-0.5 rounded-full">
                      Beginner
                    </span>
                    <p className="text-[9px] text-gray-600 mt-2">
                      Total Revenue
                    </p>
                    <h3 className="text-lg font-bold mt-1">$120.29</h3>
                  </div>
                  <div className="text-[#FF6B9D]">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Card 2 - Learning Card */}
              <div className="absolute top-[30%] left-[10%] w-[80%] bg-[#2D2D2D] rounded-2xl shadow-xl p-4">
                <span className="inline-block text-[9px] px-2 py-1 bg-[#1E88E5]/20 text-[#42A5F5] rounded-full">
                  Intermediate
                </span>
                <div className="mt-3 mb-3 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-200 via-yellow-100 to-green-200 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-center text-[#FFFFFF]">
                  LEARN FIGMA
                </h3>
                <p className="text-[10px] text-[#858585] text-center mt-1">
                  My Instagram posts
                </p>
                <div className="flex items-center justify-center gap-3 mt-3 text-[9px] text-[#858585]">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    17 students
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                    2
                  </span>
                </div>
              </div>

              {/* Card 3 - Happy Students */}
              <div
                className="absolute bottom-[25%] left-[5%] w-[48%] rounded-xl p-3 shadow-lg"
                style={{
                  background:
                    'linear-gradient(135deg, #E8232C 0%, #A01A20 100%)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white text-xs font-bold tracking-wide">
                    HAPPY STUDENTS
                  </h4>
                  <svg
                    className="w-4 h-4 text-white/80"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                </div>
                <p className="text-white text-2xl font-bold mt-1 mb-2">
                  54,000+
                </p>
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-[8px] font-semibold"
                        style={{
                          background:
                            i === 1
                              ? '#FF4D56'
                              : i === 2
                              ? '#C41E26'
                              : i === 3
                              ? '#8A161C'
                              : '#FFFFFF20',
                        }}
                      >
                        {i === 4 ? '+' : ''}
                      </div>
                    ))}
                  </div>
                  <span className="text-white/90 text-[8px] ml-1 font-medium">
                    Active learners
                  </span>
                </div>
              </div>

              {/* Card 4 - Course Card */}
              <div className="absolute bottom-[8%] right-[5%] w-[45%] bg-[#2D2D2D] rounded-2xl shadow-lg p-3">
                <h4 className="text-[10px] font-bold text-[#FFFFFF]">
                  FIGMA FROM BASIC
                </h4>
                <div className="flex items-center gap-1 mt-2 text-[8px] text-[#858585]">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  12h 8m
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[8px] text-[#858585] flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    </svg>
                    32
                  </span>
                  <span className="text-xs font-bold text-[#FFFFFF]">$25</span>
                </div>
              </div>

              {/* Enroll Button */}
              <div className="absolute bottom-[4%] right-[5%]">
                <button className="bg-[#E8232C] hover:bg-[#C41E26] text-white text-[9px] font-bold px-4 py-2 rounded-lg transition-colors duration-200">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form Section */}
      <div className="w-full lg:w-1/2 bg-[#0F0F0F] px-6 py-8 md:px-12 md:py-12 lg:px-20 lg:py-16 flex items-center">
        <div className="w-full max-w-md mx-auto">
          {/* Branding */}
          <div className="mb-8 lg:mb-12">
            <h2 className="text-xs md:text-sm font-bold tracking-widest text-[#FFFFFF]">
              EDUMENTOR
            </h2>
          </div>

          {/* Header */}
          <div className="mb-8 lg:mb-10">
            <button
              type="button"
              className="text-xs md:text-sm text-[#E8232C] hover:text-[#FF4D56] inline-block mb-2 bg-transparent border-none cursor-pointer p-0 font-medium transition-colors duration-200"
            >
              Create an Account
            </button>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-[#FFFFFF]">
              WELCOME TO
              <br />
              BYTESPACE
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="fullname"
                className="block text-xs md:text-sm font-medium text-[#FFFFFF] mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jamie Davis"
                className="w-full px-4 py-3 md:py-4 bg-[#2D2D2D] text-[#FFFFFF] placeholder-[#858585] border border-[#404040] rounded-lg text-sm md:text-base focus:outline-none focus:border-[#E8232C] transition-all duration-200"
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs md:text-sm font-medium text-[#FFFFFF] mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="designer@example.com"
                className="w-full px-4 py-3 md:py-4 bg-[#2D2D2D] text-[#FFFFFF] placeholder-[#858585] border border-[#404040] rounded-lg text-sm md:text-base focus:outline-none focus:border-[#E8232C] transition-all duration-200"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs md:text-sm font-medium text-[#FFFFFF] mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 md:py-4 bg-[#2D2D2D] text-[#FFFFFF] placeholder-[#858585] border border-[#404040] rounded-lg text-sm md:text-base focus:outline-none focus:border-[#E8232C] transition-all duration-200"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#E8232C] hover:bg-[#C41E26] active:bg-[#A01A20] text-white font-bold py-3 md:py-4 px-8 rounded-lg text-sm md:text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#E8232C] focus:ring-offset-2 focus:ring-offset-[#0F0F0F]"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginModule;
