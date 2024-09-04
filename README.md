# Kayıp Eşyam

Kayıp Eşyam reposunu klonlamak için:

```sh
git clone https://github.com/MehmetNurKavan/kayipesyam.git
cd kayipesyam
```

Projeyi başlatmak için:

```sh
npm install    // Bağımlılıkları yükleyin
npm start      // Geliştirme sunucusunu başlatın
npm run build  // Üretim için derleyin
npm test       // Testleri çalıştırın
```

Kayıp Eşyam, kayıp ve bulunan eşyaların kolayca bildirilmesini, eşleştirilmesini ve sahiplerine ulaşmasını sağlayan bir web uygulamasıdır. Bu proje, insanların kaybettikleri değerli eşyalarını geri bulmalarına yardımcı olmak amacıyla geliştirilmiştir. Kullanıcılar, kayıp ya da buldukları eşyaları sisteme ekleyebilir, bu eşyalarla ilgili detaylı bilgi verebilir ve potansiyel sahiplerle iletişime geçebilirler.

## Proje Özellikleri

- Kullanıcı Kaydı ve Girişi: Firebase Authentication kullanarak güvenli kullanıcı kaydı ve girişi sağlanır.
- Eşya Bildirimi: Kullanıcılar, kayıp ya da bulunan eşyaları sisteme kaydedebilirler. Bu kayıtlar, eşyanın türü, fotoğrafı, kaybolduğu yer ve tarih gibi bilgileri içerir.
- Gerçek Zamanlı Eşleşme: Sistem, kaybolan eşyalarla bulunan eşyaları kriterlere (eşya türü, konum, tarih vb.) göre otomatik olarak eşleştirir
- Mesajlaşma: Eşleşen eşyaların sahipleri veya bulanlar, sistem üzerinden doğrudan mesajlaşarak iletişime geçebilirler.
- Bildirimler: Kullanıcılar, eşyalarıyla ilgili yeni bir eşleşme veya mesaj aldıklarında bildirim alırlar.
- Duyarlı Tasarım: Uygulama, masaüstü ve mobil cihazlarda sorunsuz çalışacak şekilde tasarlanmıştır.

## Teknolojiler

- React: Kullanıcı arayüzünü oluşturmak için kullanıldı.
- Redux: Uygulamanın durum yönetimi için kullanıldı.
- Firebase: Gerçek zamanlı veri tabanı, kullanıcı kimlik doğrulama ve depolama hizmetleri için kullanıldı.
- CSS Modules: Bileşenleri modüler ve yeniden kullanılabilir şekilde stilize etmek için kullanıldı.

## Proje Hedefleri

- İnsanları Yeniden Birleştirmek: İnsanların kaybettikleri eşyaları geri bulmalarını kolaylaştırmak.
- Kullanıcı Dostu Arayüz: Her seviyedeki kullanıcıya hitap eden, basit ve sezgisel bir arayüz sağlamak.
- Gerçek Zamanlı Etkileşim: Kayıp eşyaların bulunma şansını artırmak için kullanıcılar arasında gerçek zamanlı etkileşim sağlamak.
