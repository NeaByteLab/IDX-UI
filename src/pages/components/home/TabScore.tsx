/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import React from 'react'

export default function TabScore() {
  return (
    <div className='idx-home-article'>
      <h2 className='idx-home-h2'>Normalisasi Dan Skor Gabungan</h2>
      <p className='idx-home-p'>
        Tujuan kita satu: punya <strong>satu angka composite</strong>{' '}
        per saham agar semua emiten bisa diurutkan (<strong>ranking</strong>) secara adil.
        Masalahnya, tiap indikator punya satuan dan rentang yang beda: <strong>PER</strong>{' '}
        itu rasio (misalnya 8 atau 25), <strong>ROE</strong> dalam persen (5% atau 20%), return{' '}
        <strong>26w</strong>{' '}
        juga persen tapi konteksnya lain. Kalau dijumlah atau dirata-rata langsung, angka besar
        (misalnya <strong>PER</strong>{' '}
        25) akan mendominasi dan indikator lain jadi kurang bermakna. Oleh karena itu kita{' '}
        <strong>normalisasi</strong> ke skala 0-1 sebelum digabung.
      </p>
      <p className='idx-home-p'>
        Karena itu kita <strong>normalisasi</strong>{' '}
        dulu: setiap indikator kita ubah ke skala yang sama (0 sampai 1) berdasarkan posisi relatif
        emiten itu di antara semua emiten. Setelah semua dalam skala 0-1, kita bisa hitung rata-rata
        per pilar (<strong>value</strong>, <strong>quality</strong>,{' '}
        <strong>momentum</strong>) lalu gabungkan dengan <strong>bobot</strong>{' '}
        (40%, 30%, 30%) menjadi satu skor akhir. Dengan begitu tidak ada satu indikator yang
        &quot;mengalahkan&quot; yang lain hanya karena angkanya lebih besar.{' '}
        <strong>Ranking</strong> pun jadi adil dan konsisten untuk seluruh daftar kandidat.
      </p>
      <p className='idx-home-p idx-home-p-mb20'>
        Ringkasnya:{' '}
        <em>angka mentah → normalisasi ke 0-1 → skor per pilar → skor gabungan</em>. Berikut detail
        tiap langkah.
      </p>
      <h3 className='idx-home-h3'>1. Normalisasi Min-Max Per Indikator</h3>
      <p className='idx-home-p'>
        Untuk setiap indikator (<strong>PER</strong>, <strong>PBV</strong>, <strong>ROE</strong>,
        {' '}
        <strong>ROA</strong>, <strong>DER</strong>, return <strong>26w</strong>, return{' '}
        <strong>52w</strong>), kita ambil nilai <em>terendah</em> dan <em>tertinggi</em>{' '}
        di seluruh emiten yang lolos filter. Setiap nilai lalu kita ubah ke skala 0-1 dengan rumus:
      </p>
      <p className='idx-home-formula'>skor_normal = (nilai − min) ÷ (max − min)</p>
      <p className='idx-home-p idx-home-p-mb20'>
        Jadi emiten dengan nilai terendah dapat 0, tertinggi dapat 1, yang di tengah dapat angka
        antara 0 dan 1. Jika semua emiten punya nilai sama (max − min = 0), kita beri skor 0,5 agar
        tidak error.
      </p>
      <h3 className='idx-home-h3'>
        2. Inversi Untuk <strong>PER</strong>, <strong>PBV</strong>, Dan <strong>DER</strong>
      </h3>
      <p className='idx-home-p'>
        Untuk indikator yang &quot;lebih rendah = lebih baik&quot;, kita balik skornya agar
        &quot;lebih baik&quot; = skor lebih tinggi (sesuai logika ranking). Rumus:{' '}
        <strong>skor_final = 1 − skor_normal</strong>.
      </p>
      <ul className='idx-home-ul'>
        <li>
          <strong>PER &amp; PBV</strong>: murah = nilai rendah → setelah normalisasi, nilai rendah
          dapat skor kecil → kita inversi jadi (1 − skor). Hasil: <strong>PER</strong>/
          <strong>PBV</strong> rendah = skor valuasi tinggi.
        </li>
        <li>
          <strong>DER</strong>: utang sehat = <strong>DER</strong>{' '}
          rendah → sama, kita pakai (1 − skor_normal). <strong>DER</strong>{' '}
          rendah = skor kualitas tinggi.
        </li>
        <li>
          <strong>ROE, ROA, return 26w, return 52w</strong>: tinggi = baik → tidak di-inversi,
          skor_normal langsung dipakai.
        </li>
      </ul>
      <h3 className='idx-home-h3'>3. Skor Per Pilar (Value, Quality, Momentum)</h3>
      <p className='idx-home-p'>
        Satu pilar bisa punya lebih dari satu indikator. Skor pilar = <strong>rata-rata</strong>
        {' '}
        dari skor indikator yang tersedia (dan valid) di pilar itu:
      </p>
      <ul className='idx-home-ul'>
        <li>
          <strong>Value</strong> = rata-rata(skor <strong>PER</strong>, skor{' '}
          <strong>PBV</strong>). Jika hanya <strong>PER</strong> yang ada, value = skor{' '}
          <strong>PER</strong>. Jika <strong>PER</strong> &amp; <strong>PBV</strong>{' '}
          negatif/tidak ada, value = 0.
        </li>
        <li>
          <strong>Quality</strong> = rata-rata(skor <strong>ROE</strong>, skor{' '}
          <strong>ROA</strong>, skor{' '}
          <strong>DER</strong>). Hanya indikator yang ada yang masuk hitungan.
        </li>
        <li>
          <strong>Momentum</strong> = rata-rata(skor return <strong>26w</strong>, skor return{' '}
          <strong>52w</strong>). Sama, hanya yang ada yang dipakai.
        </li>
      </ul>
      <h3 className='idx-home-h3'>4. Skor Gabungan (Composite Score)</h3>
      <p className='idx-home-p'>
        Skor gabungan = <strong>bobot</strong> × skor tiap pilar. Default <strong>bobot</strong> 40%
        {' '}
        <strong>valuasi</strong>, 30% <strong>kualitas</strong>, 30% <strong>momentum</strong>:
      </p>
      <p className='idx-home-formula'>
        composite = (0,4 × value) + (0,3 × quality) + (0,3 × momentum)
      </p>
      <p className='idx-home-p idx-home-p-mb20'>
        Semua skor (per indikator, per pilar, dan{' '}
        <strong>composite</strong>) berada di rentang 0-1. Saham diurutkan dari{' '}
        <strong>composite</strong> tertinggi ke terendah, itulah <strong>ranking</strong>{' '}
        yang Anda lihat di tabel.
      </p>
      <h3 className='idx-home-h3'>5. Peringkat Sektor Dan Persentil</h3>
      <p className='idx-home-p'>
        <strong>Peringkat dalam sektor (sector rank)</strong> mengurutkan saham <em>per sektor</em>
        berdasarkan{' '}
        <strong>composite score</strong>. Jadi di sektor perbankan ada rank 1, 2, 3, …, di sektor
        konsumsi juga ada rank 1, 2, 3, …, dan seterusnya. Ini berguna ketika Anda ingin
        membandingkan &quot;apel dengan apel&quot;: misalnya siapa yang terbaik di sektor properti,
        atau siapa peringkat tiga teratas di sektor teknologi. <strong>Ranking</strong>{' '}
        global saja bisa didominasi sektor tertentu, sedangkan <strong>sector rank</strong>{' '}
        memberi konteks dalam industri yang sama.
      </p>
      <p className='idx-home-p'>
        <strong>Persentil composite</strong>{' '}
        menunjukkan posisi saham dalam distribusi seluruh kandidat, dari 0 sampai 100.{' '}
        <strong>Persentil</strong>{' '}
        90 artinya skor saham itu lebih tinggi dari 90% kandidat (jadi termasuk 10% teratas).{' '}
        <strong>Persentil</strong> 50 = median (di tengah). <strong>Persentil</strong>{' '}
        20 = lebih rendah dari 80% kandidat. Dengan begitu Anda bisa cepat menilai apakah suatu
        saham termasuk &quot;tier atas&quot;, &quot;tengah&quot;, atau &quot;bawah&quot; secara
        agregat tanpa harus menghafal angka <strong>composite</strong>{' '}
        mentah. Angka persentil ini tampil di kolom tabel dan di detail.
      </p>
      <p className='idx-home-p idx-home-p-mb0'>
        Di dashboard, ketiga informasi ini (<strong>ranking</strong> global,{' '}
        <strong>sector rank</strong>, dan <strong>persentil</strong>) tampil bersama. Gunakan{' '}
        <strong>ranking</strong> global untuk daftar urut keseluruhan, <strong>sector rank</strong>
        {' '}
        untuk fokus per sektor, dan <strong>persentil</strong>{' '}
        untuk menilai kekuatan relatif terhadap seluruh pasar dalam satu angka.
      </p>
    </div>
  )
}
