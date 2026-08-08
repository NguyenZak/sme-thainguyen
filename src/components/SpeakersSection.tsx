"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Mic, Award, Sparkles, Building2, X, CheckCircle2 } from "lucide-react";
import { DEFAULT_SPEAKERS, SpeakersContent, SpeakerItem } from "@/constants/defaultContent";

export default function SpeakersSection({ content }: { content?: SpeakersContent }) {
  const [selectedSpeaker, setSelectedSpeaker] = useState<SpeakerItem | null>(null);
  const data = content || DEFAULT_SPEAKERS;
  const speakers: SpeakerItem[] = Array.isArray(content?.items)
    ? content.items
    : DEFAULT_SPEAKERS.items;

  return (
    <section id="speakers" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold uppercase tracking-wider border border-emerald-200">
            {data.badge || DEFAULT_SPEAKERS.badge}
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-[#0D3B2E] tracking-tight mb-3"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            {data.title || DEFAULT_SPEAKERS.title}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            {data.subtitle || DEFAULT_SPEAKERS.subtitle}
          </p>
        </motion.div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {speakers.map((spk, idx) => (
            <motion.div
              key={spk.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setSelectedSpeaker(spk)}
              className="bg-[#F8FAFC] rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col group cursor-pointer"
            >
              {/* Portrait */}
              <div className="relative h-60 w-full bg-slate-900 overflow-hidden shrink-0">
                <Image
                  src={spk.imageUrl}
                  alt={spk.name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B3026] via-transparent to-transparent opacity-80" />

                {spk.badge && (
                  <span className="absolute top-3 left-3 bg-[#22C55E] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                    <span>{spk.badge}</span>
                  </span>
                )}

                <div className="absolute bottom-3 left-4 right-4 text-white space-y-0.5">
                  <h3
                    className="text-lg font-bold truncate leading-snug group-hover:text-emerald-300 transition-colors"
                    style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
                  >
                    {spk.name}
                  </h3>
                  <p className="text-xs text-emerald-300 font-medium truncate">{spk.title}</p>
                </div>
              </div>

              {/* Card body — 3 blocks + topic + CTA */}
              <div className="flex flex-col divide-y divide-slate-100 flex-1">

                {/* Tổ chức */}
                <div className="flex items-center gap-2 px-4 py-3 text-xs font-semibold text-slate-700">
                  <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{spk.organization}</span>
                </div>

                {/* Thành tựu nổi bật */}
                {spk.achievements && (
                  <div className="px-4 py-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-amber-700">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      Thành tựu nổi bật
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {spk.achievements}
                    </p>
                  </div>
                )}

                {/* Vì sao nên nghe */}
                {spk.whyListen && (
                  <div className="px-4 py-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      Vì sao nên nghe
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {spk.whyListen}
                    </p>
                  </div>
                )}

                {/* Giá trị bài nói */}
                {spk.speechValue && (
                  <div className="px-4 py-3 space-y-1 bg-emerald-50/60">
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-emerald-800">
                      <Mic className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      Giá trị bài nói
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed line-clamp-2 italic">
                      {spk.speechValue}
                    </p>
                  </div>
                )}

                {/* Topic */}
                {spk.topic && (
                  <div className="px-4 py-3 mt-auto">
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
                      🎤 &quot;{spk.topic}&quot;
                    </p>
                  </div>
                )}

                {/* CTA hint */}
                <div className="px-4 py-3">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider group-hover:underline">
                    Xem chi tiết →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Speaker Bio Modal */}
      {selectedSpeaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative shadow-2xl border border-emerald-100 animate-in zoom-in-95">
            <button
              onClick={() => setSelectedSpeaker(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-emerald-500">
                <Image
                  src={selectedSpeaker.imageUrl}
                  alt={selectedSpeaker.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase mb-1">
                  {selectedSpeaker.badge || "Diễn giả Sự kiện"}
                </span>
                <h3 className="text-xl font-bold text-[#0D3B2E]">{selectedSpeaker.name}</h3>
                <p className="text-xs text-emerald-700 font-semibold">{selectedSpeaker.title}</p>
                <p className="text-xs text-slate-500">{selectedSpeaker.organization}</p>
              </div>
            </div>

            {/* Chủ đề */}
            <div className="space-y-2 bg-[#F8FAFC] p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0D3B2E]">
                <Mic className="w-4 h-4 text-amber-500" />
                <span>Chủ đề phát biểu tại Diễn đàn</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium italic">
                &quot;{selectedSpeaker.topic}&quot;
              </p>
            </div>

            {/* Thành tựu */}
            {selectedSpeaker.achievements && (
              <div className="space-y-2 bg-amber-50 p-4 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Thành tựu nổi bật</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedSpeaker.achievements}
                </p>
              </div>
            )}

            {/* Vì sao nên nghe */}
            {selectedSpeaker.whyListen && (
              <div className="space-y-2 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Vì sao nên nghe</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedSpeaker.whyListen}
                </p>
              </div>
            )}

            {/* Giá trị bài nói */}
            {selectedSpeaker.speechValue && (
              <div className="space-y-2 bg-[#F8FAFC] p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0D3B2E]">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Giá trị bài nói</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedSpeaker.speechValue}
                </p>
              </div>
            )}

            <div className="pt-1 flex justify-end">
              <button
                onClick={() => setSelectedSpeaker(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0D3B2E] text-white hover:bg-emerald-800 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
