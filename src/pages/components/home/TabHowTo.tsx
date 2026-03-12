/**
 * Copyright (c) 2026 IDX Screener by @NeaByteLab (https://neabyte.com)
 * SPDX-License-Identifier: MIT
 *
 * Open to remote work & consulting.
 * Fullstack developer with a focus on security and experience in trading systems.
 */

import React from 'react'

export default function TabHowTo() {
  return (
    <div className='idx-home-article'>
      <h2 className='idx-home-h2'>Cara Menggunakan Screener</h2>
      <p className='idx-home-p'>
        Dari <strong>Beranda</strong>, klik menu <strong>Screener</strong>{' '}
        di navigasi atas untuk masuk ke halaman{' '}
        <strong>screener</strong>. Daftar kandidat diurutkan berdasarkan skor gabungan (<strong>
          composite
        </strong>). Berikut bagian utama dan cara menggunakannya.
      </p>
      <h3 className='idx-home-h3'>1. Header (Ringkasan &amp; Data)</h3>
      <ul className='idx-home-ul'>
        <li className='idx-home-li'>
          <strong>Data Kandidat</strong>: Jumlah emiten yang lolos filter dan tampil di daftar.
        </li>
        <li className='idx-home-li'>
          <strong>Tanggal Data</strong>{' '}
          : Tanggal referensi data fundamental dan ringkasan perdagangan (format YYYY-MM-DD).
        </li>
        <li className='idx-home-li'>
          Tombol <strong>Muat Ulang Data</strong>{' '}
          (ikon refresh): Kirim ulang permintaan ke server dan perbarui tabel. Gunakan setelah
          mengubah filter atau untuk memastikan data terbaru.
        </li>
      </ul>
      <h3 className='idx-home-h3'>2. Filter Kandidat</h3>
      <ol className='idx-home-list idx-home-ol'>
        <li className='idx-home-li'>
          Klik panel <strong>Filter Kandidat</strong>{' '}
          untuk membuka/menutup (expand/collapse) blok filter.
        </li>
        <li className='idx-home-li'>
          Atur parameter: sektor (tampilan), valuasi (<strong>PER</strong> Min/Max), fundamental (
          <strong>ROE</strong> Min, <strong>DER</strong> Max), momentum (periode{' '}
          <strong>26w</strong>/<strong>52w</strong>, <strong>Momentum Min</strong>{' '}
          %), likuiditas (Min <strong>Value</strong>, Min{' '}
          <strong>Volume</strong>), dan opsi eksklusi (
          <strong>notation</strong>, <strong>corporate action</strong>, <strong>UMA</strong>).
        </li>
        <li className='idx-home-li'>
          Klik <strong>Terapkan Filter</strong> agar parameter dikirim ke <strong>server</strong>
          {' '}
          dan tabel diperbarui.
        </li>
        <li className='idx-home-li'>
          Klik <strong>Reset Ke Default</strong> untuk mengembalikan semua filter ke setelan awal.
        </li>
      </ol>
      <h3 className='idx-home-h3'>3. Tabel Kandidat</h3>
      <ul className='idx-home-ul'>
        <li className='idx-home-li'>
          <strong>Kotak pencarian</strong>{' '}
          : Ketik kode emiten, nama, atau sektor untuk memfilter baris yang tampil (filter di
          browser, tidak mengubah total dari <strong>API</strong>).
        </li>
        <li className='idx-home-li'>
          Kolom tabel: Kode, Nama Emiten, Sektor, <strong>PER</strong>, <strong>ROE</strong>,{' '}
          <strong>DER</strong>, <strong>26w</strong> (%), <strong>52w</strong> (%),{' '}
          <strong>Comp (%)</strong> (<strong>persentil</strong>{' '}
          <strong>composite</strong>). Baris diurutkan dari skor tertinggi.
        </li>
        <li className='idx-home-li'>
          <strong>Paginasi</strong>{' '}
          : Tombol Sebelumnya/Selanjutnya untuk pindah halaman. Teks &quot;Baris X-Y Dari Z&quot;
          menunjukkan rentang dan total.
        </li>
        <li className='idx-home-li'>
          Klik <strong>satu baris</strong> untuk membuka modal <strong>Detail Saham</strong>.
        </li>
      </ul>
      <h3 className='idx-home-h3'>4. Pilih Sektor</h3>
      <p className='idx-home-p'>
        Dropdown <strong>Pilih Sektor</strong>{' '}
        di panel Filter Kandidat memfilter tampilan tabel per sektor. Pilih &quot;Semua&quot; untuk
        menampilkan seluruh kandidat. Filter ini hanya mengubah tampilan, tidak mengubah total
        kandidat dari <strong>server</strong>.
      </p>
      <h3 className='idx-home-h3'>5. Kekuatan Sektor (Sidebar)</h3>
      <ul className='idx-home-ul'>
        <li className='idx-home-li'>
          Widget di sisi kanan menampilkan rata-rata momentum per sektor (naik/turun/netral).
        </li>
        <li className='idx-home-li'>
          Tab <strong>26w</strong> / <strong>52w</strong> memilih horizon return yang ditampilkan.
        </li>
        <li className='idx-home-li'>
          Berguna untuk konteks makro: sektor mana yang secara agregat sedang positif atau negatif.
        </li>
      </ul>
      <h3 className='idx-home-h3'>6. Detail Saham (Modal)</h3>
      <p className='idx-home-p idx-home-p-mb8'>
        Klik baris saham di tabel untuk membuka modal <strong>Detail Saham</strong>. Berisi:
      </p>
      <ol className='idx-home-list idx-home-ol'>
        <li className='idx-home-li'>
          <strong>Klasifikasi</strong>: Sektor dan industri.
        </li>
        <li className='idx-home-li'>
          <strong>Valuasi, Profitabilitas, Leverage</strong>: <strong>PER</strong>,{' '}
          <strong>PBV</strong>, <strong>ROE</strong>, <strong>ROA</strong>, <strong>DER</strong>.
        </li>
        <li className='idx-home-li'>
          <strong>Likuiditas</strong>: <strong>Value</strong> (nilai transaksi) dan{' '}
          <strong>volume</strong>.
        </li>
        <li className='idx-home-li'>
          <strong>Skor</strong>: <strong>Value</strong>, <strong>Quality</strong>,{' '}
          <strong>Momentum</strong>, <strong>Composite</strong> (0-1).
        </li>
        <li className='idx-home-li'>
          <strong>Momentum</strong>: Return <strong>4w</strong>, <strong>13w</strong>,{' '}
          <strong>26w</strong>, <strong>52w</strong> (%).
        </li>
        <li className='idx-home-li'>
          <strong>Grafik harga (OHLC)</strong>{' '}
          : Close 90 hari terakhir. Tutup modal dengan tombol X atau klik di luar modal.
        </li>
      </ol>
      <p className='idx-home-note'>
        Gunakan informasi di <strong>screener</strong> dan <strong>detail saham</strong>{' '}
        sebagai awal riset, bukan satu-satunya dasar keputusan. Selalu lakukan riset mandiri dan
        pertimbangkan risiko pasar serta kondisi emiten sebelum berinvestasi.
      </p>
      <h3 className='idx-home-h3'>7. Pembaruan Data</h3>
      <ul className='idx-home-ul'>
        <li className='idx-home-li'>
          Data diperbarui secara berkala (cron). Tanggal data tercantum di header{' '}
          <strong>screener</strong>.
        </li>
        <li className='idx-home-li'>
          Jika tidak ada data untuk hari ini, sistem memakai tanggal terakhir yang tersedia untuk
          {' '}
          <strong>likuiditas</strong> dan indikator berbasis summary.
        </li>
      </ul>
      <p className='idx-home-p idx-home-p-mb0'>
        Data fundamental dan ringkasan perdagangan bersumber dari data resmi. Skor dan filter
        bersifat informatif.
      </p>
    </div>
  )
}
