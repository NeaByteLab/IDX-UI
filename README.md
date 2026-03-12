<div align="center">

# IDX Screener

Screener saham Indonesia: analisis pakai data, bukan feeling.

[![Deno](https://img.shields.io/badge/deno-2.7.4-000000?logo=deno&logoColor=ffcb00)](https://deno.com) [![price](https://img.shields.io/badge/price-free-22c55e)](https://github.com/NeaByteLab/IDX-UI) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

<table align="center">
<tr>
<td width="50%" style="text-align: center"><img src="./preview/1.png" alt="Screener" width="100%"/>
<br/>
<strong>Screener</strong>: filter kandidat, fundamental, valuasi, momentum, dan kekuatan sektor donut chart 26w/52w.
</td>
<td width="50%" style="text-align: center"><img src="./preview/2.png" alt="Detail saham" width="100%"/>
<br/>
<strong>Detail saham</strong>: modal analisa fundamental, profitabilitas, valuasi, skor, momentum, dan chart harga.
</td>
</tr>
<tr>
<td width="50%" style="text-align: center"><img src="./preview/3.png" alt="Analisa teknikal" width="100%"/>
<br/>
<strong>Analisa teknikal</strong>: RSI per sektor dan chart bid vs offer per sektor hari ini, ringkasan snapshot periode satu hari.
</td>
<td width="50%" style="text-align: center"><img src="./preview/4.png" alt="Historical bid vs offer" width="100%"/>
<br/>
<strong>Historical bid vs offer</strong>: tabel agregat per sektor, periode 1W–12M, rasio bid/offer dan rata-rata per hari.
</td>
</tr>
</table>
</div>

## Fitur Utama

- **Screener** — Filter saham fundamental dan momentum, eksklusi risiko, pagination.
- **Skor komposit** — Skor gabungan value, quality, momentum; bobot diatur; peringkat sektor.
- **Ringkasan teknikal di Screener** — RSI dan bid/offer per sektor, chart satu hari.
- **Kekuatan sektor** — Pie chart kekuatan sektor, periode 26 atau 52 minggu.
- **Detail saham** — Modal tab fundamental dan teknikal: OHLC, RSI, foreign flow.
- **Historical bid/offer** — Agregat bid/offer per sektor, rasio dan rata-rata, periode 1W–12M.
- **API + SQLite** — Backend Deno, data di SQLite, cron tiap jam fetch data IDX.

> [!NOTE]
> Sedang dalam pengembangan

## Roadmap (Draft)

- [ ] Export Data
- [ ] Watchlist

## Instalasi

**Prasyarat:** [Git](https://git-scm.com/install/windows) (untuk clone) dan [Deno](https://docs.deno.com/runtime/getting_started/installation/) (sebagai runtime)

**1. Clone repo**

```bash
git clone https://github.com/NeaByteLab/IDX-UI.git
cd IDX-UI
```

**Update dari repo (reset ke versi origin)**

> [!WARNING]
> Ini akan membuang semua perubahan lokal yang belum kamu commit.

```bash
git fetch origin
git reset --hard origin/main
```

**2. Setup database**

Dari root proyek (`IDX-UI/`), jalankan:

```bash
deno task db:generate
deno task db:push
deno task db:init
```

- `db:generate` — buat file migrasi SQL dari schema, saat pertama kali.
- `db:push` — menerapkan skema ke SQLite (membuat/update tabel).
- `db:init` — mengisi data awal (snapshot screener, summary).

## Cara Menjalankan

### Production

```bash
deno task ui:build && deno task api:serve
```

Akses di `http://127.0.0.1:50270` atau `http://localhost:50270` (port sama).

> [!IMPORTANT]
> Cronjob akan otomatis mengambil data setiap jam (jadwal: menit 0).

### Development

**Terminal 1 — API:**

```bash
deno task api:dev
# Akses di `http://127.0.0.1:50270` atau `http://localhost:50270`
```

**Terminal 2 — UI:**

```bash
deno task ui:dev
# Akses di `http://127.0.0.1:50260` atau `http://localhost:50260`
```

## Dokumentasi

- **[Referensi API](API.md)** — Endpoint, parameter, return, dan contoh `curl` untuk integrasi & testing.

## Build & Tes

**Cek** — format, lint, dan typecheck:

```bash
deno task check
```

## Lisensi

Proyek ini dilisensikan di bawah MIT. Lihat berkas [LICENSE](LICENSE) untuk detail.
