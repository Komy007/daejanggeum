export const CATEGORIES = [
    { id: 'all', nameKO: '전체', nameEN: 'All', nameKM: 'ទាំងអស់', nameZH: '全部', nameJA: 'すべて', nameVI: 'Tất cả' },
    { id: 'traditional', nameKO: '전통 요리', nameEN: 'Traditional', nameKM: 'ម្ហូបប្រពៃណី', nameZH: '传统料理', nameJA: '伝統料理', nameVI: 'Món truyền thống' },
    { id: 'signature', nameKO: '시그니처', nameEN: 'Signature', nameKM: 'មុខម្ហូបពិសេស', nameZH: '招牌菜', nameJA: 'シグネチャー', nameVI: 'Món đặc trưng' },
    { id: 'modern', nameKO: '현대적 요리', nameEN: 'Modern', nameKM: 'ម្ហូបសម័យ', nameZH: '现代料理', nameJA: '現代料理', nameVI: 'Món hiện đại' },
    { id: 'meat', nameKO: '고기류', nameEN: 'Premium Meat', nameKM: 'សាច់លំដับខ្ពស់', nameZH: '优质肉类', nameJA: 'プレミアム肉', nameVI: 'Thịt cao cấp' },
    { id: 'drinks', nameKO: '음료', nameEN: 'Drinks', nameKM: 'ភេសជ្ជៈ', nameZH: '饮品', nameJA: 'お飲み물', nameVI: 'Đồ uống' },
];

export const MENU_ITEMS = [
    {
        id: 'm1',
        category: 'traditional',
        names: { ko: '신선로 (궁중 전골)', en: 'Sinseollo (Royal Hot Pot)', km: 'ស៊ុបព្រះរាជទ្រព្យ', zh: '神仙炉', ja: '神仙炉（シン선로）', vi: 'Lẩu cung đình' },
        descriptions: {
            ko: '12가지 산해진미를 담아 은은한 화력으로 끓여낸 대장금 대표 궁중 요리',
            en: 'The flagship royal hot pot of DaeJangGeum, simmered with 12 precious ingredients.',
            km: 'ស៊ុបពិសេសរបស់ DaeJangGeum ដែលមានគ្រឿងផ្សំមានតម្លៃ ១2 មុខ។',
            zh: '包含12种珍贵食材，慢火炖煮的大长今代表宫廷料理。',
            ja: '12種類の珍味を盛り込み、ほのかな火力で煮込んだ大長今の代表的な宮廷料理。',
            vi: 'Món lẩu cung đình tiêu biểu của DaeJangGeum, được hầm từ 12 loại nguyên liệu quý hiếm.'
        },
        price: 65,
        image: '/images/sinseollo.png',
        popular: true,
    },
    {
        id: 'm2',
        category: 'traditional',
        names: { ko: '궁중 구절판', en: 'Royal Gujeolpan', km: 'គុជុលផាន់ព្រះរាជទ្រព្យ', zh: '宫廷九折板', ja: '宮廷九節板', vi: 'Bánh cửu tiết cung đình' },
        descriptions: {
            ko: '아홉 가지 색채의 정성을 밀전병에 담아 즐기는 전통 미학의 정수',
            en: 'The essence of traditional aesthetics, nine colorful delicacies wrapped in buckwheat pancakes.',
            km: 'ខ្លឹមសារនៃសោភ័ណភាពប្រពៃណី រសជាតិ ៩ យ៉ាងក្នុងបន្ទះម្សៅស្តើង។',
            zh: '凝聚九种色彩精髓的传统美学料理，用薄饼卷食。',
            ja: '九つの色彩を小麦粉の薄焼き包んで楽しむ伝統美学の極致。',
            vi: 'Tinh hoa mỹ học truyền thống, với chín loại nguyên liệu màu sắc gói trong bánh tráng.'
        },
        price: 45,
        image: '/images/gujeolpan.png',
    },
    {
        id: 'm3',
        category: 'signature',
        names: { ko: '대장금 갈비찜', en: 'DaeJangGeum Galbijjim', km: 'ឆ្អឹងជំនីគោខ្វៃ DaeJangGeum', zh: '大长今炖排骨', ja: '大長今カルビ蒸し', vi: 'Sườn bò hầm DaeJangGeum' },
        descriptions: {
            ko: '특제 씨간장 소스로 48시간 숙성하여 부드러운 육질의 프리미엄 갈비찜',
            en: 'Premium braised short ribs matured for 48 hours in a special soy sauce for tender meat.',
            km: 'ឆ្អឹងជំនីគោខ្វៃពិសេស លំដាប់ខ្ពស់ ដែលផ្អាប់ជាមួយទឹកស៊ីអ៊ីវពិសេសរយៈពេល ៤8 ម៉ោង។',
            zh: '选用特制老抽酱油腌制48小时，肉质鲜嫩的高级炖排骨。',
            ja: '特製しょうゆソースで48時間熟成させた、柔らかな肉質のプレミアムカルビ蒸し。',
            vi: 'Sườn hầm cao cấp được ủ trong 48 giờ với nước tương đặc biệt cho thịt mềm mọng.'
        },
        price: 58,
        image: '/images/galbijjim.png',
        popular: true,
    },
    {
        id: 'm4',
        category: 'modern',
        names: { ko: '한우 트러플 육회', en: 'Hanwoo Truffle Yukhoe', km: 'សាច់គោឆៅជាមួយត្រាហ្វហ្វល', zh: '韩牛松露生肉', ja: '韓牛トリュフユッケ', vi: 'Gỏi bò Hanwoo nấm Truffle' },
        descriptions: {
            ko: '최상급 한우와 최고급 블랙 트러플 오일의 품격 있는 조화',
            en: 'A sophisticated harmony of top-grade Hanwoo beef and premium black truffle oil.',
            km: 'ការរួមបញ្ចូលគ្នាដ៏អស្ចារ្យនៃសាច់គោ Hanwoo លំដាប់ខ្ពស់ និងប្រេងត្រាហ្វហ្វលខ្មៅ។',
            zh: '极品韩牛与尊贵黑松露油的华丽融合。',
            ja: '最上級の韓牛と最高級のブラックトリュフオイルの気品ある調和。',
            vi: 'Sự kết hợp đẳng cấp giữa thịt bò Hanwoo thượng hạng và dầu nấm Truffle đen.'
        },
        price: 38,
        image: '/images/yukhoe.png',
    },
    {
        id: 'm5',
        category: 'drinks',
        names: { ko: '심곡 솔송주', en: 'Simgok Solsongju', km: 'ស្រាស្រល់ Simgok', zh: '沁谷松芽酒', ja: '沁谷（シムゴク）松芽酒', vi: 'Rượu lá thông Simgok' },
        descriptions: {
            ko: '지리산 자락의 솔잎 향을 담은 은은하고 깔끔한 명품 전통주',
            en: 'A masterpiece of traditional liquor with the clean scent of pine needles from Mt. Jiri.',
            km: 'ស្រាប្រពៃណីលំដាប់ខ្ពស់ដែលមានក្លិនស្លឹកស្រល់ពីភ្នំ Jiri។',
            zh: '带有智异山脚下松针清香，口感清爽的高级传统酒。',
            ja: '智異山のふもとの松の葉の香りを盛り込んだ、ほのかでスッキリとした名品伝統酒。',
            vi: 'Tuyệt phẩm rượu truyền thống với hương lá thông thanh khiết từ chân núi Jiri.'
        },
        price: 25,
        image: '/images/solsongju.png',
    },
    {
        id: 'meat1',
        category: 'meat',
        names: { ko: '꽃등심', en: 'Grilled Beef Sirloin', km: 'សាច់គោឡាំប៊ឺត', zh: '花肉里脊', ja: '霜降りロース', vi: 'Thăn lưng bò hoa' },
        descriptions: {
            ko: '화려한 마블링과 풍부한 육즙이 일품인 최상급 한우 꽃등심',
            en: 'Top-grade Hanwoo beef sirloin with brilliant marbling and rich juices.',
            km: 'សាច់គោ Hanwoo លំដับខ្ពស់ដែលមានជាតិទឹក និងរសជាតិឆ្ងាញ់។',
            zh: '具有华丽大理石纹理和丰富肉汁的顶级韩牛花肉里脊。',
            ja: '華やかなマーブリングと豊かな肉汁が逸品の最上級韓牛霜降りロース。',
            vi: 'Thăn lưng bò Hanwoo thượng hạng với vân mỡ đẹp mắt và mọng nước.'
        },
        price: 30,
        image: '/images/meat1.png',
        popular: true,
    },
    {
        id: 'meat2',
        category: 'meat',
        names: { ko: '생갈비', en: 'Grilled Unfrozen Beef Ribs', km: 'ឆ្អឹងជំនីគោស្រស់', zh: '鲜牛排', ja: '生カルビ', vi: 'Sườn bò tươi' },
        descriptions: {
            ko: '얼리지 않은 신선함 그대로, 고소한 풍미가 살아있는 프리미엄 생갈비',
            en: 'Premium unfrozen beef ribs with a clean, savory flavor and natural texture.',
            km: 'ឆ្អឹងជំនីគោស្រស់ លំដับខ្ពស់ ដែលមានរសជាតិឆ្ងាញ់បំផុត។',
            zh: '保持未冷冻的新鲜感，充满香醇风味的优质鲜牛排。',
            ja: '凍らせない新鮮さそのまま、香ばしい風味が生きているプレミアム生カルビ。',
            vi: 'Sườn bò tươi cao cấp không qua đông lạnh, giữ trọn vị ngọt tự nhiên.'
        },
        price: 29,
        image: '/images/meat2.png',
    },
    {
        id: 'meat3',
        category: 'meat',
        names: { ko: '갈비살', en: 'Grilled Beef Ribs', km: 'សាច់ជំនីគោ', zh: '牛排肉', ja: 'カルビ肉', vi: 'Thịt sườn bò' },
        descriptions: {
            ko: '쫄깃한 식감과 고소한 맛이 어우러진 대장금 인기 부위',
            en: 'A popular cut at DaeJangGeum featuring a chewy texture and savory taste.',
            km: 'សាច់ជំនីគោដែលមានរសជាតិឈ្ងុយឆ្ងាញ់ និងពេញនិយមបំផុត។',
            zh: '嚼劲十足、鲜香可口的大长今人气部位牛排肉。',
            ja: '弾力のある食感と香ばしい味が調화한 大長今の人気部位カルビ肉。',
            vi: 'Phần thịt sườn phổ biến tại DaeJangGeum với độ dai giòn và vị ngọt đậm đà.'
        },
        price: 28,
        image: '/images/meat3.png',
    },
    {
        id: 'meat4',
        category: 'meat',
        names: { ko: '양념갈비', en: 'Marinated Beef Ribs', km: 'ឆ្អឹងជំនីគោប្រឡាក់', zh: '腌制牛排', ja: '味付けカルビ', vi: 'Sườn bò tẩm gia vị' },
        descriptions: {
            ko: '대장금 비법 양념에 재워 달콤하고 짭짤한 풍미가 일품인 양념갈비',
            en: 'Marinated beef ribs soaked in DaeJangGeum\'s secret sauce for a perfect sweet and savory flavor.',
            km: 'ឆ្អឹងជំនីគោប្រឡាក់ជាមួយគ្រឿងទេសពិសេសរបស់ DaeJangGeum។',
            zh: '浸泡在大长今秘制酱汁中，甜咸适中的优质腌制牛排。',
            ja: '大長今の秘法ソースに浸した、甘辛い風味が逸品の味付けカルビ。',
            vi: 'Sườn bò tẩm nước sốt bí truyền DaeJangGeum với vị mặn ngọt hài hòa.'
        },
        price: 25,
        image: '/images/meat4.png',
    },
];

export const STORE_INFO = {
    name: '대장금 (DaeJangGeum)',
    address: 'Cambodia Phnom Penh Store',
    wifi: 'DaeJangGeum_Guest',
};
