import React, { useState } from 'react';
import { Award, GraduationCap, Play, CheckCircle2, Clock, Users, BookOpen, Sparkles, FileBadge } from 'lucide-react';
import { AcademyCourse } from '../../types/live-network';
import { MOCK_ACADEMY_COURSES } from '../../data/live-network-data';

export const OrbeAcademyHub: React.FC = () => {
  const [courses] = useState<AcademyCourse[]>(MOCK_ACADEMY_COURSES);
  const [enrolledCourse, setEnrolledCourse] = useState<AcademyCourse | null>(null);

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Header */}
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 border border-cyan-500/30 shadow-2xl relative">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/20">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Educação & Capacitação Técnica</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            ORBE Academy TV
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            Aprenda com os maiores profissionais da televisão moçambicana. Cursos práticos de produção com smartphone, iluminação de estúdio, locução para rádio e monetização digital.
          </p>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              Certificado Digital Gratuito
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-cyan-300">
              <Award className="w-4 h-4" />
              Oportunidades de Contratação na Be Universe
            </span>
          </div>
        </div>
      </div>

      {/* Courses Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="relative aspect-video overflow-hidden bg-black">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-600 text-white">
                  {course.level}
                </span>
                <span className="absolute bottom-3 right-3 text-[11px] font-mono px-2 py-0.5 rounded bg-black/70 text-slate-200">
                  {course.duration}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {course.description}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Instrutor: {course.instructor}</span>
                </div>
                <div className="text-[11px] text-cyan-300 font-medium">
                  {course.role}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-800/80 mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                {course.studentsEnrolled.toLocaleString('pt-PT')} alunos
              </span>
              <button
                onClick={() => setEnrolledCourse(course)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md"
              >
                Assistir Aulas
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Course Video Player Modal */}
      {enrolledCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#090d20] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-1">{enrolledCourse.title}</h3>
            <p className="text-xs text-cyan-300 mb-4">Instrutor: {enrolledCourse.instructor} · {enrolledCourse.role}</p>

            {/* Video container */}
            <div className="aspect-video w-full rounded-2xl bg-black overflow-hidden mb-5 border border-slate-800 relative">
              <video
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <FileBadge className="w-4 h-4" />
                <span>Progresso: Aula 1 de {enrolledCourse.modulesCount} (Certificado ao final)</span>
              </div>
              <button
                onClick={() => setEnrolledCourse(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
