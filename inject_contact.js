const fs = require('fs');

const data = {
  ko: { title: "문의하기", description: "큐티스바이오에 대한 문의사항을 남겨주시면 빠르게 답변해 드리겠습니다.", addressTitle: "오시는 길", addressDetail: "서울시 강남구 논현로 842 압구정빌딩 8층", emailTitle: "이메일", emailAddress: "contact@cutisbio.com", mapTitle: "구글 지도" },
  en: { title: "Contact Us", description: "If you have any questions about CutisBio, please leave a message and we will get back to you quickly.", addressTitle: "Address", addressDetail: "8F, Apgujeong Bldg, 842 Nonhyeon-ro, Gangnam-gu, Seoul", emailTitle: "Email", emailAddress: "contact@cutisbio.com", mapTitle: "Location Map" },
  ja: { title: "お問い合わせ", description: "CutisBioに関するお問い合わせがございましたら、メッセージを残してください。すぐにお返事いたします。", addressTitle: "住所", addressDetail: "ソウル特別市江南区論峴路842 狎鴎亭ビル8階", emailTitle: "Eメール", emailAddress: "contact@cutisbio.com", mapTitle: "マップ" },
  bn: { title: "যোগাযোগ", description: "CutisBio সম্পর্কে আপনার কোন প্রশ্ন থাকলে দয়া করে একটি বার্তা দিন এবং আমরা দ্রুত আপনার কাছে ফিরে আসব।", addressTitle: "ঠিকানা", addressDetail: "৮ম তলা, আপগুজেওং ভবন, ৮৪২ ননহিয়ন-রো, গাংনাম-গু, সিউল", emailTitle: "ইমেইল", emailAddress: "contact@cutisbio.com", mapTitle: "অবস্থান মানচিত্র" },
  tr: { title: "İletişim", description: "CutisBio hakkında herhangi bir sorunuz varsa lütfen mesaj bırakın, size en kısa sürede dönüş yapacağız.", addressTitle: "Adres", addressDetail: "8. Kat, Apgujeong Binası, 842 Nonhyeon-ro, Gangnam-gu, Seul", emailTitle: "E-posta", emailAddress: "contact@cutisbio.com", mapTitle: "Konum Haritası" },
  zh: { title: "联系我们", description: "如果您对CutisBio有任何疑问，请留言，我们将尽快给您回复。", addressTitle: "地址", addressDetail: "首尔特别市江南区论岘路842 狎鸥亭大厦8层", emailTitle: "电子邮件", emailAddress: "contact@cutisbio.com", mapTitle: "位置地图" }
};

for (const lang of Object.keys(data)) {
  const path = `./messages/${lang}.json`;
  if (fs.existsSync(path)) {
    const file = JSON.parse(fs.readFileSync(path, 'utf8'));
    file['Contact'] = data[lang];
    fs.writeFileSync(path, JSON.stringify(file, null, 2) + '\n');
  }
}
