import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About Us — Lakshya | IIT-JEE / NEET / Foundation",
  description:
    "Learn about Lakshya Institute — our story, mission, faculty, and 19+ years of shaping India's top IIT-JEE and NEET rankers.",
};

/* ─── Data ─────────────────────────────────────────────────── */



const values = [
  {
    icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
    title: "Excellence",
    desc: "We hold ourselves and our students to the highest academic standards, continuously improving our curriculum and teaching methods.",
    color: "from-[#C8102E] to-red-700",
  },
  {
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    title: "Student-First",
    desc: "Every decision — from course design to support systems — is made with the student's best interest and success at heart.",
    color: "from-[#1a1a2e] to-blue-800",
  },
  {
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    title: "Innovation",
    desc: "From digital classrooms to AI-driven analytics, we embrace technology to make learning more effective and engaging.",
    color: "from-[#F5C518] to-yellow-600",
  },
  {
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    title: "Community",
    desc: "We build a thriving community of learners, mentors, and alumni who support each other through every step of the journey.",
    color: "from-green-500 to-green-700",
  },
  {
    icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
    title: "Integrity",
    desc: "We are transparent about results, honest in our communication, and committed to ethical practices in everything we do.",
    color: "from-purple-500 to-purple-700",
  },
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Results",
    desc: "We are obsessed with outcomes. Everything we do is designed to maximise the chances of our students achieving their rank goals.",
    color: "from-orange-500 to-orange-700",
  },
];

const awards = [
  {
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
    title: "Best Coaching Institute",
    body: "Education Excellence Awards, 2023",
  },
  {
    icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
    title: "Top IIT-JEE Results",
    body: "Rajasthan State Education Board, 2022 & 2023",
  },
  {
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    title: "Best Faculty Network",
    body: "India EdTech Summit, 2022",
  },
  {
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2",
    title: "Innovation in Online Learning",
    body: "EdTech Innovators Forum, 2021",
  },
];

/* ─── Page ─────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main>

        {/* ── 1. BREADCRUMB BAR ───────────────────────────── */}
        <section className="bg-[#f7f8fc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="text-gray-500 hover:text-[#C8102E] transition-colors font-medium">
                Home
              </Link>
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-[#C8102E] font-semibold">About Us</span>
            </nav>
            <p className="hidden sm:block text-xs text-gray-400 font-medium tracking-wide uppercase">
              IIT-JEE · NEET · Foundation
            </p>
          </div>
        </section>

        {/* ── 3. OUR STORY ────────────────────────────────── */}
        <section id="our-story" className="py-20 bg-[#f7f8fc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              {/* Left — text */}
              <div>
                <p className="text-[#C8102E] font-semibold text-sm uppercase tracking-widest mb-2">
                  Our Story
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] mb-5 leading-tight">
                  Born from a Belief That{" "}
                  <span className="text-[#C8102E]">Every Student</span> Can Crack IIT &amp; NEET
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Lakshya was founded in 2005 by a group of IITians and doctors who believed that
                    quality coaching should not be a privilege of the few. Starting with a single
                    classroom in Kota and 40 determined students, we set out to build an institute
                    that combined expert teaching with genuine care for students.
                  </p>
                  <p>
                    Our name <strong className="text-[#1a1a2e]">Lakshya</strong> — meaning
                    &ldquo;goal&rdquo; in Sanskrit — is at the heart of everything we do. We help
                    students define their goal, build the roadmap, and stay laser-focused until they
                    achieve it.
                  </p>
                  <p>
                    Over 19 years, we have grown from 40 students in a single room to over 50,000
                    students across offline and online programs. But the mission has never changed:
                    transform every student who walks through our doors into a confident, capable
                    rank-holder.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-5">
                  {[
                    { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13", label: "Structured Curriculum" },
                    { icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197", label: "IITian Faculty" },
                    { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", label: "Proven Results" },
                  ].map(({ icon, label }) => (
                    <div key={label} className="flex items-center gap-2.5 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100">
                      <div className="w-8 h-8 rounded-lg bg-[#C8102E]/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-[#1a1a2e]">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — visual card stack */}
              <div className="relative flex justify-center">
                <div className="relative w-full max-w-sm space-y-4">
                  {/* Card 1 */}
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#C8102E] flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-[#1a1a2e] text-sm">Founded in Kota</p>
                      <p className="text-xs text-gray-500 mt-0.5">The coaching capital of India, home to Lakshya's flagship centre since 2005.</p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-[#1a1a2e] rounded-2xl p-6 shadow-md flex items-start gap-4 ml-8">
                    <div className="w-12 h-12 rounded-xl bg-[#F5C518] flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-[#1a1a2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">150+ Expert Faculty</p>
                      <p className="text-xs text-gray-400 mt-0.5">IITians, NITians, and AIIMS doctors dedicated to your success.</p>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-gradient-to-r from-[#C8102E] to-red-700 rounded-2xl p-6 shadow-md flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">1,000+ IIT Selections</p>
                      <p className="text-xs text-red-100 mt-0.5">A legacy of top rankers that speaks louder than any claim.</p>
                    </div>
                  </div>

                  {/* Floating badge */}
                  <div className="absolute -top-5 -right-5 bg-[#F5C518] text-[#1a1a2e] px-4 py-2 rounded-full text-xs font-bold shadow-lg rotate-6">
                    Since 2005 🎓
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. CORE VALUES ──────────────────────────────── */}
        <section className="py-20 bg-[#f7f8fc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-[#C8102E] font-semibold text-sm uppercase tracking-widest mb-2">
                What We Stand For
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] section-title-underline">
                Our Core Values
              </h2>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto">
                These six principles are the foundation of every decision we make — from how we teach to how we support our students.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map(({ icon, title, desc, color }) => (
                <div
                  key={title}
                  className="bg-white rounded-2xl p-6 shadow-sm card-hover border border-transparent hover:border-[#C8102E]/20 group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#1a1a2e] text-base mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. AWARDS & RECOGNITION ─────────────────────── */}
        <section id="awards" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-[#C8102E] font-semibold text-sm uppercase tracking-widest mb-2">
                Recognition
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] section-title-underline">
                Awards &amp; Achievements
              </h2>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto">
                Our results have been recognised by educational bodies and industry forums across India.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {awards.map(({ icon, title, body }) => (
                <div
                  key={title}
                  className="group text-center bg-[#f7f8fc] rounded-2xl p-6 border border-gray-100 card-hover hover:bg-white"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#C8102E] to-red-700 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#1a1a2e] text-sm mb-1">{title}</h3>
                  <p className="text-xs text-gray-500">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. CTA BANNER ───────────────────────────────── */}
        <section className="py-20 bg-gradient-to-br from-[#C8102E] via-red-700 to-[#1a1a2e] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #F5C518 0%, transparent 50%), radial-gradient(circle at 80% 20%, #fff 0%, transparent 40%)",
            }}
          />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
              Ready to Begin Your{" "}
              <span className="text-[#F5C518]">Lakshya</span> Journey?
            </h2>
            <p className="text-red-100 text-lg max-w-2xl mx-auto mb-8">
              Join 50,000+ students who trusted Lakshya to guide them to IIT, AIIMS, and beyond.
              Free counselling available for all new admissions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="px-8 py-4 bg-[#F5C518] text-[#1a1a2e] font-extrabold rounded-full text-base hover:bg-yellow-400 transition-all duration-200 shadow-xl hover:-translate-y-0.5"
              >
                Enroll Now — Free Counselling
              </Link>
              <Link
                href="/#courses"
                className="px-8 py-4 bg-white/10 text-white font-bold rounded-full text-base border border-white/30 hover:bg-white/20 transition-all duration-200"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
