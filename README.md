# API Waktu Sholat Indonesia

## Endpoints

### `/province`

Mengembalikan daftar provinsi dan kota.

Contoh: [`/province`](http://waktu-sholat.vercel.app/province)

### `/province/{province.id}`

Mengembalikan provinsi dan daftar kota.

Contoh: [`/province/623170da0c9712e86967f918`](http://waktu-sholat.vercel.app/province/623170da0c9712e86967f918)

### `/province/{province.id}/city`

Mengembalikan daftar kota untuk provinsi tertentu.

Contoh: [`/province/623170da0c9712e86967f918/city`](http://waktu-sholat.vercel.app/province/623170da0c9712e86967f918/city)

### `/province/{province.id}/city/{city.id}`

Mengembalikan kota spesifik.

Contoh: [`/province/623170da0c9712e86967f918/city/623174648c0926930463d0a6`](http://waktu-sholat.vercel.app/province/623170da0c9712e86967f918/city/623174648c0926930463d0a6)

### `/location?latitude={latitude}&longitude={longitude}`

Mengembalikan kota spesifik.

Contoh: [`/location?latitude=-6.310433333333333&longitude=107.2922944444444`](http://waktu-sholat.vercel.app/location?latitude=-6.310433333333333&longitude=107.2922944444444)

### `/prayer?latitude={latitude}&longitude={longitude}`

Mengembalikan waktu sholat & imsak sesuai dengan kota terdekat berdasarkan koordinat, default Kota Jakarta. |

Contoh: [`/prayer?latitude=-6.310433333333333&longitude=107.2922944444444`](http://waktu-sholat.vercel.app/prayer?latitude=-6.310433333333333&longitude=107.2922944444444)

## Sumber Data

Kemenag
