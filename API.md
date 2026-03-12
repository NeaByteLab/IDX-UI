# Referensi API

Semua endpoint di dokumen ini memakai method **GET**.

- **Base URL:** `http://127.0.0.1:50270`
- **Dari UI (dev):** request ke `/api` di-proxy ke base URL di atas.

---

### Health

```http
GET /api/health
```

- Parameter: tidak ada
- Return: `{ ok: boolean, service: string, ts: string, root: string }`
- Deskripsi: Cek status layanan dan direktori kerja.

**Contoh:**

```bash
curl -s 'http://127.0.0.1:50270/api/health'
```

---

### Bid-Offer

```http
GET /api/:code/bid-offer
```

- Parameter path:
  - `code` `<string>`: Kode saham (contoh: BBCA, GOTO).
- Parameter query:
  - `start` `<string>`: (Wajib) Tanggal awal (yyyymmdd, 8 digit).
  - `end` `<string>`: (Wajib) Tanggal akhir (yyyymmdd), harus ≥ start.
- Return: `Array<{ date, bidVolume, offerVolume }>`
- Deskripsi: Deret waktu volume bid dan offer untuk satu emiten dalam rentang tanggal. Subset dari OHLC (hanya field bid/offer).
- Error: `400` jika code kosong atau start/end tidak valid.

**Contoh:**

```bash
curl -s 'http://127.0.0.1:50270/api/BBCA/bid-offer?start=20250101&end=20250301'
```

---

### Candidates

```http
GET /api/candidates
```

- Parameter query:
  - `date` `<string>`: (Opsional) Tanggal snapshot summary (yyyymmdd). Bawaan: hari ini.
  - `defaultFilter` `<boolean>`: (Opsional) Jika true, pakai set bawaan: excludeNotation, excludeCorpAction, excludeUma, perMax=25, roeMin=0, derMax=2, momentumMin=0, momentumWeek=26.
  - `derMax` `<number>`: (Opsional) DER maksimal.
  - `excludeCorpAction` `<boolean>`: (Opsional) Exclude saham dengan corporate action.
  - `excludeNotation` `<boolean>`: (Opsional) Exclude saham dengan notation.
  - `excludeUma` `<boolean>`: (Opsional) Exclude saham UMA.
  - `limit` `<number>`: (Opsional) Limit hasil per halaman.
  - `minValue` `<number>`: (Opsional) Nilai transaksi minimal.
  - `minVolume` `<number>`: (Opsional) Volume minimal.
  - `momentumMin` `<number>`: (Opsional) Momentum minimal (%).
  - `momentumWeek` `<number>`: (Opsional) Periode momentum: 26 atau 52 minggu. Bawaan: 26.
  - `mw` `<number>`: (Opsional) Bobot momentum (komposit).
  - `offset` `<number>`: (Opsional) Offset pagination.
  - `perMax` `<number>`: (Opsional) PER maksimal.
  - `perMin` `<number>`: (Opsional) PER minimal.
  - `qw` `<number>`: (Opsional) Bobot quality (komposit).
  - `roeMin` `<number>`: (Opsional) ROE minimal.
  - `vw` `<number>`: (Opsional) Bobot value (komposit).
  - `withSectorRank` `<boolean>`: (Opsional) Sertakan sectorRank dan sectorPercentile per saham.
- Return: `{ date, totalCount, limit, offset, serverTimestamp, data[] }`
- Deskripsi: Saham terfilter (fundamental + likuiditas + flag) dengan skor komposit dan pagination.

**Contoh:**

```bash
curl -s 'http://127.0.0.1:50270/api/candidates?defaultFilter=true&limit=10&offset=0'
```

---

### Foreign

```http
GET /api/:code/foreign
```

- Parameter path:
  - `code` `<string>`: Kode saham (contoh: BBCA, GOTO).
- Parameter query:
  - `start` `<string>`: (Wajib) Tanggal awal (yyyymmdd, 8 digit).
  - `end` `<string>`: (Wajib) Tanggal akhir (yyyymmdd), harus ≥ start.
- Return: `{ code, start, end, data: Array<{ date, buy, sell, net }>, summary: { totalBuy, totalSell, totalNet, dayCount } }`
- Deskripsi: Statistik aliran asing (buy, sell, net) per hari dalam rentang tanggal; plus agregat total dan jumlah hari.
- Error: `400` jika code kosong atau start/end tidak valid.

**Contoh:**

```bash
curl -s 'http://127.0.0.1:50270/api/BBCA/foreign?start=20250101&end=20250301'
```

---

### General

```http
GET /api/general
```

- Parameter: tidak ada
- Return: `{ stockList, industries, sectors, subSectors, subIndustries }`
- Deskripsi: Metadata untuk filter: daftar saham (code, name) dan daftar unik industri, sektor, subsektor, subindustri.

**Contoh:**

```bash
curl -s 'http://127.0.0.1:50270/api/general'
```

---

### OHLC

```http
GET /api/:code/ohlc
```

- Parameter path:
  - `code` `<string>`: Kode saham (contoh: BBCA, GOTO).
- Parameter query:
  - `start` `<string>`: (Wajib) Tanggal awal (yyyymmdd, 8 digit).
  - `end` `<string>`: (Wajib) Tanggal akhir (yyyymmdd), harus ≥ start.
- Return: `Array<{ date, open, high, low, close, volume, change, bidVolume, offerVolume }>`
- Deskripsi: Data OHLC + volume + change + bid/offer volume untuk satu emiten dalam rentang tanggal.
- Error: `400` jika code kosong atau start/end tidak valid.

**Contoh:**

```bash
curl -s 'http://127.0.0.1:50270/api/BBCA/ohlc?start=20250101&end=20250301'
```

---

### RSI

```http
GET /api/:code/rsi
```

- Parameter path:
  - `code` `<string>`: Kode saham (contoh: BBCA, GOTO).
- Parameter query:
  - `start` `<string>`: (Wajib) Tanggal awal (yyyymmdd, 8 digit).
  - `end` `<string>`: (Wajib) Tanggal akhir (yyyymmdd), harus ≥ start.
- Return: `{ code, start, end, period, data: Array<{ date, rsi }>, sector, sectorData: Array<{ date, rsi }> }`
- Deskripsi: Deret waktu RSI(14) untuk satu emiten dalam rentang tanggal. Jika saham punya sektor, `sectorData` berisi RSI rata-rata sektor per hari (berdasarkan saham-saham dalam sektor itu).
- Error: `400` jika code kosong atau start/end tidak valid.

**Contoh:**

```bash
curl -s 'http://127.0.0.1:50270/api/BBCA/rsi?start=20250101&end=20250301'
```

---

### Screener Bid-Offer

```http
GET /api/screener/bid-offer
```

- Parameter query:
  - `date` `<string>`: (Opsional) Tanggal referensi (yyyymmdd). Bawaan: hari terakhir yang ada di summary.
- Return: `{ date, data: Array<{ sector, bidVolume, offerVolume, count }> }` — agregat volume bid dan offer per sektor untuk satu hari. `data` diurutkan berdasarkan total volume (bid + offer) menurun.
- Deskripsi: Agregat volume bid dan offer per sektor (universe screener) untuk tanggal tertentu. Berguna untuk chart Bid vs Offer per sektor di Analisa Teknikal.

**Contoh:**

```bash
curl -s 'http://127.0.0.1:50270/api/screener/bid-offer'
curl -s 'http://127.0.0.1:50270/api/screener/bid-offer?date=20260312'
```

---

### Screener Ranked

```http
GET /api/screener/ranked
```

- Parameter query:
  - `limit` `<number>`: (Opsional) Limit hasil.
  - `mw` `<number>`: (Opsional) Bobot momentum.
  - `offset` `<number>`: (Opsional) Offset pagination.
  - `qw` `<number>`: (Opsional) Bobot quality.
  - `vw` `<number>`: (Opsional) Bobot value.
  - `withSectorRank` `<boolean>`: (Opsional) Sertakan sectorRank dan sectorPercentile.
- Return: `Array` baris ter-ranking (dengan pagination).
- Deskripsi: Semua saham ter-ranking komposit tanpa filter tanggal/likuiditas.

**Contoh:**

```bash
curl -s 'http://127.0.0.1:50270/api/screener/ranked?limit=20&offset=0&withSectorRank=true'
```

---

### Screener RSI

```http
GET /api/screener/rsi
```

- Parameter query:
  - `date` `<string>`: (Opsional) Tanggal referensi (yyyymmdd). Bawaan: hari terakhir yang ada di summary.
  - `period` `<number>`: (Opsional) Periode RSI (1–100). Bawaan: 14.
- Return: `{ date, period, data: { byCode, bySector } }` — `byCode`: array semua item (per code); `bySector`: key sector → array item.
- Deskripsi: Satu nilai RSI terakhir per saham (seluruh universe). Tanpa pagination/sort; sort/filter di frontend. `rsi` null jika data close tidak cukup.

**Contoh:**

```bash
curl -s 'http://127.0.0.1:50270/api/screener/rsi'
curl -s 'http://127.0.0.1:50270/api/screener/rsi?date=20260311&period=14'
```

---

### Sector Strength

```http
GET /api/sector/strength
```

- Parameter query:
  - `source` `<string>`: (Opsional) `ohlc` = hitung return dari OHLC summary; kosong = pakai week26PC/week52PC dari screener.
  - `week` `<number>`: (Opsional) Periode minggu: 26 atau 52.
- Return: `Array<{ sector, avgMomentum, count, rank }>`
- Deskripsi: Rata-rata momentum per sektor, diurutkan per ranking.

**Contoh:**

```bash
curl -s 'http://127.0.0.1:50270/api/sector/strength?week=26'
```

---

### Stock Detail

```http
GET /api/stock/:code/detail
```

- Parameter path:
  - `code` `<string>`: Kode saham.
- Parameter query:
  - `date` `<string>`: (Opsional) Tanggal snapshot untuk value/volume (yyyymmdd). Bawaan: hari ini.
  - `start` `<string>`: (Wajib) Tanggal awal rentang OHLC (yyyymmdd).
  - `end` `<string>`: (Wajib) Tanggal akhir rentang OHLC (yyyymmdd).
- Return: Objek detail saham: code, name, sector, industry, fundamental, skor value/quality/momentum/composite, value, volume, ohlc[], flags (hasNotation, hasCorpAction, hasUma).
- Deskripsi: Detail fundamental, skor komposit, dan deret waktu OHLC untuk satu saham.
- Error: `400` jika start/end tidak valid; `404` jika saham tidak ditemukan.

**Contoh:**

```bash
curl -s 'http://127.0.0.1:50270/api/stock/BBCA/detail?start=20250101&end=20250301'
```
