/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import React from 'react'

export default function TabMethodology() {
  return (
    <div className='idx-home-article'>
      <h2 className='idx-home-h2'>Apa Itu Factor Investing?</h2>
      <p className='idx-home-p idx-home-p-mb20'>
        <strong>Factor investing</strong>{' '}
        adalah pendekatan investasi yang memilih saham berdasarkan karakteristik (faktor) yang
        secara historis dan riset akademik sering dikaitkan dengan return jangka panjang. Alih-alih
        hanya memilih berdasarkan nama atau sektor, kita mengukur saham dengan indikator terukur
        (misalnya murah vs mahal,{' '}
        <strong>profitabilitas</strong>, tren harga), lalu menggabungkannya menjadi satu skor.
        Dengan begitu daftar kandidat bisa diurutkan dan disaring secara konsisten, bukan sekadar
        &quot;feeling&quot; atau rumor.
      </p>
      <h3 className='idx-home-h3'>Tiga Pilar Yang Kita Pakai</h3>
      <ol className='idx-home-list idx-home-ol'>
        <li className='idx-home-li idx-home-li-mb16'>
          <strong>Valuasi (bobot 40%)</strong>{' '}
          : Valuasi menjawab: &quot;Apakah harga saham ini relatif murah dibanding laba dan kekayaan
          perusahaan?&quot; Indikator yang dipakai:
          <ul className='idx-home-ul idx-home-ul-mb0'>
            <li>
              <strong>PER</strong> (price-to-earnings) = harga saham ÷ laba per saham.{' '}
              <strong>PER</strong>{' '}
              rendah berarti pasar membayar lebih sedikit per rupiah laba, secara historis saham
              dengan <strong>PER</strong> rendah (dalam batas wajar) cenderung dianggap value.
            </li>
            <li>
              <strong>PBV</strong> (price-to-book value) = harga ÷ nilai buku per saham.{' '}
              <strong>PBV</strong>{' '}
              rendah berarti harga mendekati atau di bawah nilai buku, sering dipakai untuk menilai
              &quot;murah&quot; relatif terhadap aset perusahaan.
            </li>
          </ul>
          <p className='idx-home-note'>
            Di <strong>screener</strong> ini, <strong>PER</strong> dan <strong>PBV</strong> yang
            {' '}
            <em>lebih rendah</em>{' '}
            (dan positif) diberi skor valuasi lebih tinggi. Kita membalik (inversi) skala setelah
            {' '}
            <strong>normalisasi</strong> agar &quot;murah&quot; = skor tinggi, sehingga{' '}
            <strong>ranking</strong> sejalan dengan logika <strong>value</strong>.
          </p>
        </li>
        <li className='idx-home-li idx-home-li-mb16'>
          <strong>Kualitas (bobot 30%)</strong>{' '}
          : Kualitas mengukur seberapa profitabel dan sehat struktur modal perusahaan. Indikator
          yang dipakai:
          <ul className='idx-home-ul idx-home-ul-mb0'>
            <li>
              <strong>ROE</strong> (return on equity) = laba bersih ÷ ekuitas. <strong>ROE</strong>
              {' '}
              tinggi berarti perusahaan menghasilkan return bagus dari modal pemegang saham.
            </li>
            <li>
              <strong>ROA</strong> (return on assets) = laba bersih ÷ total aset.{' '}
              <strong>ROA</strong>{' '}
              tinggi menunjukkan efisiensi penggunaan aset untuk menghasilkan laba.
            </li>
            <li>
              <strong>DER</strong> (debt-to-equity ratio) = total utang ÷ ekuitas.{' '}
              <strong>DER</strong>{' '}
              rendah berarti utang relatif kecil, risiko finansial lebih terkendali.
            </li>
          </ul>
          <p className='idx-home-note'>
            <strong>ROE</strong> dan{' '}
            <strong>ROA</strong>: semakin tinggi, skor kualitas semakin tinggi. <strong>DER</strong>
            {' '}
            kita balik (inversi): utang rendah = skor tinggi, agar konsisten dengan &quot;kualitas
            baik&quot; = leverage wajar.
          </p>
        </li>
        <li className='idx-home-li idx-home-li-mb16'>
          <strong>Momentum (bobot 30%)</strong>{' '}
          : Momentum mengukur tren harga: saham yang naik dalam periode tertentu cenderung punya
          kelanjutan tren (persistence) dalam jangka pendek-menengah. Indikator yang dipakai:
          <ul className='idx-home-ul idx-home-ul-mb0'>
            <li>
              <strong>Return 26 minggu</strong> (setengah tahun) dan{' '}
              <strong>return 52 minggu</strong>{' '}
              (satu tahun). Keduanya mengukur persentase kenaikan/turun harga dari level N minggu
              lalu.
            </li>
          </ul>
          <p className='idx-home-note'>
            Return lebih tinggi = skor momentum lebih tinggi. Kita pakai <strong>26w</strong> dan
            {' '}
            <strong>52w</strong>{' '}
            karena riset momentum sering memakai horizon 6-12 bulan, periode terlalu pendek
            (misalnya 1 minggu) lebih berisik noise, terlalu panjang bisa kehilangan sinyal terbaru.
          </p>
        </li>
      </ol>
      <h3 className='idx-home-h3'>Kenapa Bobot 40% Valuasi, 30% Kualitas, 30% Momentum?</h3>
      <p className='idx-home-p idx-home-p-mb0'>
        <strong>Valuasi</strong> kita beri <strong>bobot</strong>{' '}
        terbesar (40%) karena dalam jangka panjang, membeli saham dengan harga relatif murah
        (<strong>value</strong>) adalah fondasi banyak strategi yang terbukti di riset.{' '}
        <strong>Kualitas</strong> dan <strong>momentum</strong>{' '}
        masing-masing 30% agar kita tidak mengabaikan profitabilitas dan tren harga, kombinasi
        ketiganya membantu mengurangi risiko &quot;<strong>value trap</strong>
        &quot; (saham murah tapi bisnis lemah) dan memberi konfirmasi dari sisi momentum.{' '}
        <strong>Bobot</strong> ini default dan bisa diubah lewat parameter <strong>API</strong>{' '}
        jika Anda ingin lebih fokus ke satu pilar.
      </p>
    </div>
  )
}
