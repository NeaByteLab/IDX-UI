/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import React from 'react'
import { Info } from 'lucide-react'

export default function About() {
  return (
    <div className='idx-main'>
      <div className='idx-card idx-about-card'>
        <h1 className='idx-dashboard-title idx-about-title'>
          <Info size={28} strokeWidth={2} aria-hidden />
          <span>Tentang Aplikasi</span>
        </h1>
        <p className='idx-about-intro'>
          Dashboard gratis untuk screening dan analisa saham pasar Indonesia{' '}
          <strong>by @NeaByteLab</strong>.
        </p>

        <div className='idx-home-article'>
          <p className='idx-home-p'>
            <strong>IDX Screener</strong> adalah aplikasi web yang menyediakan{' '}
            <strong>dashboard screening dan analisa saham</strong>{' '}
            untuk pasar modal Indonesia secara{' '}
            <strong>gratis</strong>. Aplikasi ini memudahkan Anda menyaring emiten berdasarkan
            fundamental (<strong>valuasi</strong>, <strong>profitabilitas</strong>,{' '}
            <strong>leverage</strong>), <strong>momentum</strong> harga, dan{' '}
            <strong>likuiditas</strong>, lalu mengurutkannya dengan skor gabungan sehingga Anda
            punya daftar kandidat yang terstruktur untuk riset lanjutan, bukan sekadar daftar saham
            acak atau rekomendasi tanpa dasar terukur.
          </p>
          <p className='idx-home-p'>
            Data fundamental dan ringkasan perdagangan diambil dari sumber resmi (termasuk data
            terbuka dari bursa dan pihak terkait) serta diperbarui secara berkala. Skor dihitung di
            server dengan metodologi factor investing (<strong>value</strong>,{' '}
            <strong>quality</strong>,{' '}
            <strong>momentum</strong>) yang lazim dipakai dalam riset akademik dan manajemen
            portofolio, rumus <strong>normalisasi</strong> dan <strong>bobot</strong>{' '}
            diterapkan seragam ke seluruh emiten sehingga perbandingan antarsaham adil. Dengan
            begitu, <strong>ranking</strong>{' '}
            konsisten, dapat direproduksi, dan dapat diandalkan sebagai titik awal analisa maupun
            riset lanjutan.
          </p>

          <h2 className='idx-home-h2'>Yang Bisa Anda Lakukan</h2>
          <ul className='idx-home-ul'>
            <li className='idx-home-li'>
              <strong>Screener</strong>: Lihat daftar kandidat saham yang lolos filter, diurutkan
              berdasarkan skor gabungan (<strong>composite</strong>). Tabel menampilkan kode, nama
              emiten, sektor, <strong>PER</strong>, <strong>ROE</strong>,{' '}
              <strong>DER</strong>, return <strong>26w</strong> & <strong>52w</strong>, serta{' '}
              <strong>persentil</strong> <strong>composite</strong>.
            </li>
            <li className='idx-home-li'>
              <strong>Filter</strong>: Atur batas valuasi (<strong>PER</strong>{' '}
              min/max), fundamental (<strong>ROE</strong> min, <strong>DER</strong>{' '}
              max), momentum (periode{' '}
              <strong>26w</strong>/<strong>52w</strong>, batas minimal return),{' '}
              <strong>likuiditas</strong> (min <strong>value</strong> &{' '}
              <strong>volume</strong>), dan opsi eksklusi (<strong>notation</strong>,{' '}
              <strong>corporate action</strong>,{' '}
              <strong>UMA</strong>) agar daftar sesuai profil risiko dan preferensi Anda.
            </li>
            <li className='idx-home-li'>
              <strong>Kekuatan Sektor</strong>: Lihat rata-rata <strong>momentum</strong>{' '}
              per sektor (<strong>26w</strong> atau{' '}
              <strong>52w</strong>) untuk konteks makro: sektor mana yang secara agregat sedang
              positif atau negatif.
            </li>
            <li className='idx-home-li'>
              <strong>Detail Saham</strong>: Klik baris di tabel untuk membuka modal berisi{' '}
              <strong>klasifikasi</strong>, <strong>valuasi</strong>,{' '}
              <strong>profitabilitas</strong>, <strong>leverage</strong>, skor per pilar,{' '}
              <strong>momentum</strong>{' '}
              multi-horizon, dan grafik harga (<strong>OHLC</strong>) 90 hari terakhir.
            </li>
          </ul>
          <p className='idx-home-p'>
            Semua fitur di atas tersedia tanpa biaya. Untuk penjelasan rumus skor,{' '}
            <strong>normalisasi</strong>, dan urutan filter, buka tab <strong>Metodologi</strong>,
            {' '}
            <strong>Skor</strong>, <strong>Filter & Risiko</strong>, serta{' '}
            <strong>Cara Pakai</strong> di halaman <strong>Beranda</strong>.
          </p>

          <h3 className='idx-home-h3'>Metodologi Singkat</h3>
          <p className='idx-home-p'>
            Skor gabungan dibangun dari tiga pilar dengan <strong>bobot</strong>{' '}
            dan indikator berikut:
          </p>
          <ul className='idx-home-ul'>
            <li className='idx-home-li'>
              <strong>Valuasi (40%)</strong>: <strong>PER</strong> & <strong>PBV</strong>{' '}
              rendah = relatif murah.
            </li>
            <li className='idx-home-li'>
              <strong>Kualitas (30%)</strong>: <strong>ROE</strong>, <strong>ROA</strong>,{' '}
              <strong>DER</strong> untuk profitabilitas dan kesehatan utang.
            </li>
            <li className='idx-home-li'>
              <strong>Momentum (30%)</strong>: return <strong>26w</strong>/<strong>52w</strong>{' '}
              untuk tren harga.
            </li>
          </ul>
          <p className='idx-home-p'>
            Nilai di-<strong>normalisasi</strong>{' '}
            ke skala 0-1 lalu di-<strong>bobot</strong>. Indikator yang &quot;lebih rendah = lebih
            baik&quot; (<strong>PER</strong>, <strong>PBV</strong>,{' '}
            <strong>DER</strong>) di-inversi agar <strong>ranking</strong> sejalan dengan logika
            {' '}
            <strong>value</strong> dan <strong>kualitas</strong>.
          </p>

          <div className='idx-home-note idx-home-note-mt24'>
            <strong>Disclaimer</strong>: Gunakan informasi di <strong>screener</strong> dan{' '}
            <strong>detail saham</strong> hanya sebagai <em>awal riset</em>{' '}
            dan bahan pertimbangan, bukan satu-satunya dasar keputusan investasi. Selalu lakukan
            riset mandiri (
            <strong>due diligence</strong>), baca laporan keuangan dan pengumuman emiten, serta
            pertimbangkan risiko pasar, kondisi makro, dan fundamental perusahaan sebelum
            berinvestasi. Data dan skor di sini bersifat informatif serta tidak menjamin hasil di
            masa depan, aplikasi ini tidak memberikan rekomendasi jual/beli maupun{' '}
            <strong>nasihat investasi</strong>. Semua keputusan investasi sepenuhnya menjadi
            tanggung jawab pengguna. Pengembang aplikasi tidak bertanggung jawab atas segala
            kerugian, klaim, tuntutan, atau konsekuensi lain yang timbul dari penggunaan data, skor,
            dan fitur di aplikasi ini.
          </div>
        </div>
      </div>
    </div>
  )
}
