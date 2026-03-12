/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import React from 'react'

export default function TabFilter() {
  return (
    <div className='idx-home-article'>
      <h2 className='idx-home-h2'>Filter Fundamental Dan Eksklusi Risiko</h2>
      <ul className='idx-home-ul'>
        <li className='idx-home-li'>
          Semua filter dan opsi eksklusi diterapkan <em>sebelum</em>{' '}
          perankingan. Hanya emiten yang memenuhi kriteria yang masuk daftar kandidat dan dihitung
          skornya.
        </li>
        <li className='idx-home-li'>
          Setelah mengubah parameter di panel <strong>Filter Kandidat</strong>, klik{' '}
          <strong>Terapkan Filter</strong> agar permintaan dikirim ke <strong>server</strong>{' '}
          dan tabel diperbarui.
        </li>
        <li className='idx-home-li'>
          <strong>Reset Ke Default</strong> mengembalikan nilai ke setelan awal (
          <strong>valuasi</strong> wajar, fundamental, <strong>momentum</strong>,{' '}
          <strong>likuiditas</strong>, dan eksklusi aktif).
        </li>
      </ul>
      <h3 className='idx-home-h3'>1. Sektor</h3>
      <p className='idx-home-p'>
        <strong>Pilih Sektor</strong>{' '}
        adalah filter tampilan di sisi klien: daftar sektor diambil dari data{' '}
        <strong>server</strong>, dan saat Anda memilih satu sektor, tabel kandidat hanya menampilkan
        emiten di sektor tersebut. Tidak mengubah total kandidat dari{' '}
        <strong>API</strong>, hanya mempersempit tampilan untuk analisis per industri.
      </p>
      <h3 className='idx-home-h3'>2. Valuasi (PER Min &amp; PER Max)</h3>
      <ul className='idx-home-ul'>
        <li className='idx-home-li'>
          <strong>PER Min</strong>: Emiten dengan <strong>PER</strong>{' '}
          (price-to-earnings) di bawah nilai ini dikeluarkan dari kandidat.
        </li>
        <li className='idx-home-li'>
          <strong>PER Max</strong>: Emiten dengan <strong>PER</strong>{' '}
          di atas nilai ini (jika terisi) dikeluarkan dari kandidat.
        </li>
        <li className='idx-home-li'>
          Default misalnya <strong>PER</strong> Min 1 dan <strong>PER</strong>{' '}
          Max 25 agar fokus pada saham yang dinilai wajar atau murah. Kosongkan salah satu jika
          tidak ingin membatasi dari sisi itu.
        </li>
      </ul>
      <h3 className='idx-home-h3'>3. Fundamental (ROE Min (%) &amp; DER Max)</h3>
      <p className='idx-home-p idx-home-p-mb8'>
        Keduanya dikirim ke <strong>API</strong> dan diterapkan sebelum perhitungan skor.
      </p>
      <ul className='idx-home-ul'>
        <li className='idx-home-li'>
          <strong>ROE Min</strong> : Hanya emiten dengan <strong>ROE</strong>{' '}
          (return on equity) ≥ nilai ini yang lolos. Meningkatkan ROE Min menyaring saham dengan
          profitabilitas lebih rendah.
        </li>
        <li className='idx-home-li'>
          <strong>DER Max</strong> : Hanya emiten dengan <strong>DER</strong>{' '}
          (debt-to-equity ratio) ≤ nilai ini yang lolos. Menurunkan DER Max membatasi risiko
          leverage.
        </li>
      </ul>
      <h3 className='idx-home-h3'>4. Momentum (Periode &amp; Momentum Min (%))</h3>
      <ul className='idx-home-ul'>
        <li className='idx-home-li'>
          <strong>Periode</strong>: Memilih horizon return: <strong>26w</strong> (26 minggu) atau
          {' '}
          <strong>52w</strong> (52 minggu).
        </li>
        <li className='idx-home-li'>
          <strong>Momentum Min (%)</strong>{' '}
          : Batas minimal return dalam periode tersebut. Emiten dengan return di bawah nilai ini
          tidak masuk kandidat.
        </li>
        <li className='idx-home-li'>
          Default misalnya <strong>26w</strong> dan <strong>Momentum Min</strong>{' '}
          5% agar tren harga cukup positif.
        </li>
        <li className='idx-home-li'>
          Parameter ini selaras dengan pilar <strong>momentum</strong> di skor.
        </li>
      </ul>
      <h3 className='idx-home-h3'>5. Likuiditas (Min Value (Rp) &amp; Min Volume)</h3>
      <ul className='idx-home-ul'>
        <li className='idx-home-li'>
          <strong>Min Value (Rp)</strong>: Batas minimal nilai transaksi (dalam rupiah).
        </li>
        <li className='idx-home-li'>
          <strong>Min Volume</strong>: Batas minimal volume perdagangan.
        </li>
        <li className='idx-home-li'>
          Emiten yang nilai transaksinya di bawah <strong>Min Value</strong> atau volumenya di bawah
          {' '}
          <strong>Min Volume</strong> dikeluarkan dari daftar (harus memenuhi keduanya untuk lolos).
        </li>
        <li className='idx-home-li'>
          Tujuannya menyaring saham yang terlalu tipis sehingga sulit dibeli/dijual dalam ukuran
          wajar tanpa menggerakkan harga.
        </li>
      </ul>
      <h3 className='idx-home-h3'>6. Eksklusi Risiko (Notation, Corporate Action, UMA)</h3>
      <p className='idx-home-p'>
        Tiga opsi eksklusi mengacu pada flag di data resmi: <strong>notation</strong>,{' '}
        <strong>corporate action</strong>,{' '}
        <strong>UMA</strong>. Jika dicentang, emiten yang memenuhi flag tersebut <em>tidak</em>{' '}
        dimasukkan ke daftar kandidat.
      </p>
      <ul className='idx-home-ul idx-home-ul-mb0'>
        <li className='idx-home-li'>
          <strong>Kecualikan Saham dengan Notation</strong>{' '}
          : Sembunyikan saham yang memiliki notation/catatan khusus (misalnya peringatan dari bursa
          atau regulator).
        </li>
        <li className='idx-home-li'>
          <strong>Kecualikan Saham Corporate Action</strong>{' '}
          : Sembunyikan saham yang sedang dalam corporate action (right issue, stock split, dll.)
          agar daftar fokus pada kondisi normal.
        </li>
        <li className='idx-home-li'>
          <strong>Kecualikan Saham UMA</strong> : Sembunyikan saham dengan pengumuman{' '}
          <strong>UMA</strong>{' '}
          (Unusual Market Activity) yang bisa mengindikasikan volatilitas atau peristiwa khusus.
        </li>
      </ul>
      <p className='idx-home-note'>
        Eksklusi ini bukan rekomendasi jual, tujuannya memfokuskan daftar pada nama yang lebih
        &quot;bersih&quot; dari sisi regulasi dan peristiwa korporat. Default{' '}
        <strong>screener</strong> menyalakan ketiga opsi agar hasil awal lebih konservatif.
      </p>
      <h3 className='idx-home-h3'>Urutan Penerapan</h3>
      <ol className='idx-home-list idx-home-ol'>
        <li className='idx-home-li'>
          <strong>Filter fundamental</strong> (<strong>PER</strong>, <strong>ROE</strong>,{' '}
          <strong>DER</strong>,{' '}
          <strong>momentum</strong>) diterapkan dulu ke data mentah. Hanya emiten yang lolos yang
          masuk perhitungan skor dan <strong>ranking</strong>.
        </li>
        <li className='idx-home-li'>
          <strong>Eksklusi</strong> (<strong>notation</strong>, <strong>corporate action</strong>,
          {' '}
          <strong>UMA</strong>) dan <strong>batas likuiditas</strong> (min{' '}
          <strong>value</strong>, min{' '}
          <strong>volume</strong>) diterapkan setelah skor dihitung, lalu daftar final dipaginasi
          (<strong>limit</strong>/<strong>offset</strong>) per halaman.
        </li>
        <li className='idx-home-li'>
          <strong>Filter sektor</strong> tidak dikirim ke{' '}
          <strong>server</strong>, hanya mempersempit tampilan tabel di browser.
        </li>
      </ol>
      <p className='idx-home-p idx-home-p-mb0'>
        Data fundamental dan ringkasan perdagangan bersumber dari data resmi, skor dan filter
        bersifat informatif. Selalu lakukan <strong>riset mandiri</strong>{' '}
        dan pertimbangkan risiko sebelum mengambil keputusan investasi.
      </p>
    </div>
  )
}
